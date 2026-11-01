package com.arthik.service;

import com.arthik.dto.BudgetRequest;
import com.arthik.model.Budget;
import com.arthik.model.Category;
import com.arthik.repository.BudgetRepository;
import com.arthik.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;

    public BudgetService(BudgetRepository budgetRepository, CategoryRepository categoryRepository) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Budget> getBudgets(Long userId, String monthYear) {
        String queryMonth = (monthYear != null && !monthYear.trim().isEmpty())
                ? monthYear
                : LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

        return budgetRepository.findAllByUserIdAndMonth(userId, queryMonth);
    }

    public Budget createBudget(Long userId, BudgetRequest req) {
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category selected"));

        Budget budget = new Budget();
        budget.setUserId(userId);
        budget.setCategoryId(req.getCategoryId());
        budget.setCategoryName(category.getName());
        budget.setCategoryColor(category.getColor());
        budget.setCategoryIcon(category.getIcon());
        budget.setMonthYear(req.getMonthYear());
        budget.setAmountLimit(req.getAmountLimit());

        return budgetRepository.save(budget);
    }

    public Budget updateBudget(Long id, Long userId, BudgetRequest req) {
        Budget budget = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found or access denied"));

        budget.setCategoryId(req.getCategoryId());
        budget.setMonthYear(req.getMonthYear());
        budget.setAmountLimit(req.getAmountLimit());

        budgetRepository.update(budget);
        return budget;
    }

    public void deleteBudget(Long id, Long userId) {
        boolean deleted = budgetRepository.deleteByIdAndUserId(id, userId);
        if (!deleted) {
            throw new IllegalArgumentException("Budget not found or access denied");
        }
    }
}
