package com.arthik.controller;

import com.arthik.algorithm.CategoryMaxHeap;
import com.arthik.dto.CategorySpendingDto;
import com.arthik.dto.MonthlySummaryDto;
import com.arthik.service.AnalyticsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    private Long getUserId(HttpServletRequest request) {
        return (Long) request.getAttribute("userId");
    }

    @GetMapping("/category-spending")
    public ResponseEntity<List<CategorySpendingDto>> getCategorySpending(
            HttpServletRequest request,
            @RequestParam(required = false) String month) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(analyticsService.getCategorySpending(userId, month));
    }

    @GetMapping("/monthly-summary")
    public ResponseEntity<List<MonthlySummaryDto>> getMonthlySummary(HttpServletRequest request) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(analyticsService.getMonthlySummary(userId));
    }

    @GetMapping("/top-categories")
    public ResponseEntity<List<CategoryMaxHeap.CategorySpendingItem>> getTopCategories(
            HttpServletRequest request,
            @RequestParam(required = false, defaultValue = "5") int limit) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(analyticsService.getTopCategories(userId, limit));
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics(HttpServletRequest request) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(analyticsService.getMetrics(userId));
    }
}
