package com.arthik.service;

import com.arthik.dto.ContributionRequest;
import com.arthik.dto.SavingsGoalRequest;
import com.arthik.model.SavingsContribution;
import com.arthik.model.SavingsGoal;
import com.arthik.repository.SavingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * DBMS Integration - ACID Transactions:
 * Uses @Transactional to guarantee Atomicity, Consistency, Isolation, and Durability.
 * If contribution insertion or progress update fails, the entire transaction rolls back.
 */
@Service
public class SavingsService {

    private final SavingsRepository savingsRepository;

    public SavingsService(SavingsRepository savingsRepository) {
        this.savingsRepository = savingsRepository;
    }

    public List<SavingsGoal> getGoals(Long userId) {
        return savingsRepository.findAllGoalsByUserId(userId);
    }

    public SavingsGoal createGoal(Long userId, SavingsGoalRequest req) {
        SavingsGoal goal = new SavingsGoal();
        goal.setUserId(userId);
        goal.setTitle(req.getTitle().trim());
        goal.setTargetAmount(req.getTargetAmount());
        goal.setCurrentAmount(BigDecimal.ZERO);
        goal.setTargetDate(req.getTargetDate());
        goal.setCategory(req.getCategory() != null && !req.getCategory().trim().isEmpty() ? req.getCategory().trim() : "General");
        goal.setStatus("IN_PROGRESS");

        return savingsRepository.saveGoal(goal);
    }

    /**
     * ACID Demonstration: Atomic Contribution Workflow
     * Commits both contribution record and balance progression, rolls back completely on any error.
     */
    @Transactional(rollbackFor = Exception.class)
    public SavingsGoal contribute(Long goalId, Long userId, ContributionRequest req) {
        SavingsGoal goal = savingsRepository.findGoalByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Savings goal not found or access denied"));

        if ("COMPLETED".equalsIgnoreCase(goal.getStatus())) {
            throw new IllegalStateException("This savings goal is already completed!");
        }

        // 1. Record individual contribution
        SavingsContribution contribution = new SavingsContribution();
        contribution.setGoalId(goalId);
        contribution.setAmount(req.getAmount());
        contribution.setContributionDate(req.getContributionDate());
        contribution.setNotes(req.getNotes());
        savingsRepository.saveContribution(contribution);

        // 2. Increment goal progress & update status
        savingsRepository.updateGoalProgress(goalId, req.getAmount());

        // Return updated goal state
        return savingsRepository.findGoalByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new IllegalStateException("Failed to refresh savings goal after contribution"));
    }

    public List<SavingsContribution> getContributions(Long goalId, Long userId) {
        // Validate ownership first
        savingsRepository.findGoalByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Savings goal not found or access denied"));
        return savingsRepository.findContributionsByGoalId(goalId);
    }
}
