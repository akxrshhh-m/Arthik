package com.arthik.service;

import com.arthik.algorithm.CategoryMaxHeap;
import com.arthik.dto.CategorySpendingDto;
import com.arthik.dto.MonthlySummaryDto;
import com.arthik.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final TransactionRepository transactionRepository;

    public AnalyticsService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<CategorySpendingDto> getCategorySpending(Long userId, String monthYear) {
        String queryMonth = (monthYear != null && !monthYear.trim().isEmpty())
                ? monthYear
                : LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

        return transactionRepository.getCategorySpending(userId, queryMonth);
    }

    public List<MonthlySummaryDto> getMonthlySummary(Long userId) {
        return transactionRepository.getMonthlySummary(userId);
    }

    /**
     * Academic Integration - ADSA Max Heap Demonstration:
     * Builds a Max Heap of all category expenditures and extracts the Top 5.
     */
    public List<CategoryMaxHeap.CategorySpendingItem> getTopCategories(Long userId, int limit) {
        String currentMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        List<CategorySpendingDto> categoryList = transactionRepository.getCategorySpending(userId, currentMonth);

        // Convert to Max Heap items
        List<CategoryMaxHeap.CategorySpendingItem> heapItems = categoryList.stream()
                .map(c -> new CategoryMaxHeap.CategorySpendingItem(
                        c.getCategoryName(),
                        c.getAmount(),
                        c.getColor(),
                        c.getIcon(),
                        1 // count
                ))
                .collect(Collectors.toList());

        // Use custom Max Heap implementation
        return CategoryMaxHeap.getTopCategories(heapItems, limit);
    }

    public Map<String, Object> getMetrics(Long userId) {
        String currentMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        BigDecimal highestExpense = transactionRepository.getHighestIndividualExpense(userId);
        BigDecimal averageDaily = transactionRepository.getAverageDailySpending(userId, currentMonth);

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("highestIndividualExpense", highestExpense != null ? highestExpense : BigDecimal.ZERO);
        metrics.put("averageDailySpending", averageDaily != null ? averageDaily : BigDecimal.ZERO);
        return metrics;
    }
}
