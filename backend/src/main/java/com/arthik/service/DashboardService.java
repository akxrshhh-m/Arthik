package com.arthik.service;

import com.arthik.dto.CategorySpendingDto;
import com.arthik.dto.DashboardSummaryResponse;
import com.arthik.dto.MonthlySummaryDto;
import com.arthik.model.Transaction;
import com.arthik.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;

    public DashboardService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public DashboardSummaryResponse getSummary(Long userId) {
        String currentMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

        BigDecimal totalBalance = transactionRepository.getLifetimeBalance(userId);
        BigDecimal monthlyIncome = transactionRepository.getTotalIncomeForMonth(userId, currentMonth);
        BigDecimal monthlyExpenses = transactionRepository.getTotalExpenseForMonth(userId, currentMonth);
        BigDecimal monthlySavings = monthlyIncome.subtract(monthlyExpenses);

        List<Transaction> allTransactions = transactionRepository.findAll(userId, null, null, null, null);
        List<Transaction> recentTransactions = allTransactions.stream().limit(6).toList();

        List<CategorySpendingDto> categorySpending = transactionRepository.getCategorySpending(userId, currentMonth);
        List<MonthlySummaryDto> monthlyComparison = transactionRepository.getMonthlySummary(userId);

        DashboardSummaryResponse response = new DashboardSummaryResponse();
        response.setTotalBalance(totalBalance != null ? totalBalance : BigDecimal.ZERO);
        response.setMonthlyIncome(monthlyIncome != null ? monthlyIncome : BigDecimal.ZERO);
        response.setMonthlyExpenses(monthlyExpenses != null ? monthlyExpenses : BigDecimal.ZERO);
        response.setMonthlySavings(monthlySavings);
        response.setRecentTransactions(recentTransactions);
        response.setCategorySpending(categorySpending);
        response.setMonthlyComparison(monthlyComparison);

        return response;
    }
}
