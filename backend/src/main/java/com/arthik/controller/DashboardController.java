package com.arthik.controller;

import com.arthik.dto.DashboardSummaryResponse;
import com.arthik.service.DashboardService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        DashboardSummaryResponse summary = dashboardService.getSummary(userId);
        return ResponseEntity.ok(summary);
    }
}
