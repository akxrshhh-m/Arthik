package com.arthik.controller;

import com.arthik.dto.ContributionRequest;
import com.arthik.dto.SavingsGoalRequest;
import com.arthik.model.SavingsContribution;
import com.arthik.model.SavingsGoal;
import com.arthik.service.SavingsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class SavingsController {

    private final SavingsService savingsService;

    public SavingsController(SavingsService savingsService) {
        this.savingsService = savingsService;
    }

    private Long getUserId(HttpServletRequest request) {
        return (Long) request.getAttribute("userId");
    }

    @GetMapping
    public ResponseEntity<List<SavingsGoal>> getGoals(HttpServletRequest request) {
        Long userId = getUserId(request);
        List<SavingsGoal> list = savingsService.getGoals(userId);
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<SavingsGoal> createGoal(HttpServletRequest request, @Valid @RequestBody SavingsGoalRequest req) {
        Long userId = getUserId(request);
        SavingsGoal created = savingsService.createGoal(userId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/contribute")
    public ResponseEntity<SavingsGoal> contribute(
            HttpServletRequest request,
            @PathVariable Long id,
            @Valid @RequestBody ContributionRequest req) {
        Long userId = getUserId(request);
        SavingsGoal updatedGoal = savingsService.contribute(id, userId, req);
        return ResponseEntity.ok(updatedGoal);
    }

    @GetMapping("/{id}/contributions")
    public ResponseEntity<List<SavingsContribution>> getContributions(HttpServletRequest request, @PathVariable Long id) {
        Long userId = getUserId(request);
        List<SavingsContribution> contributions = savingsService.getContributions(id, userId);
        return ResponseEntity.ok(contributions);
    }
}
