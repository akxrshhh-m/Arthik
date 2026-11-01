package com.arthik.controller;

import com.arthik.dto.BudgetRequest;
import com.arthik.model.Budget;
import com.arthik.service.BudgetService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    private Long getUserId(HttpServletRequest request) {
        return (Long) request.getAttribute("userId");
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getBudgets(HttpServletRequest request, @RequestParam(required = false) String month) {
        Long userId = getUserId(request);
        List<Budget> list = budgetService.getBudgets(userId, month);
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<Budget> createBudget(HttpServletRequest request, @Valid @RequestBody BudgetRequest req) {
        Long userId = getUserId(request);
        Budget created = budgetService.createBudget(userId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(
            HttpServletRequest request,
            @PathVariable Long id,
            @Valid @RequestBody BudgetRequest req) {
        Long userId = getUserId(request);
        Budget updated = budgetService.updateBudget(id, userId, req);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBudget(HttpServletRequest request, @PathVariable Long id) {
        Long userId = getUserId(request);
        budgetService.deleteBudget(id, userId);
        return ResponseEntity.ok(Map.of("message", "Budget limit deleted successfully"));
    }
}
