package com.arthik.dto;

import com.arthik.model.Transaction;
import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryResponse {
    private BigDecimal totalBalance;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpenses;
    private BigDecimal monthlySavings;
    private List<Transaction> recentTransactions;
    private List<CategorySpendingDto> categorySpending;
    private List<MonthlySummaryDto> monthlyComparison;

    public DashboardSummaryResponse() {}

    public BigDecimal getTotalBalance() { return totalBalance; }
    public void setTotalBalance(BigDecimal totalBalance) { this.totalBalance = totalBalance; }

    public BigDecimal getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public BigDecimal getMonthlyExpenses() { return monthlyExpenses; }
    public void setMonthlyExpenses(BigDecimal monthlyExpenses) { this.monthlyExpenses = monthlyExpenses; }

    public BigDecimal getMonthlySavings() { return monthlySavings; }
    public void setMonthlySavings(BigDecimal monthlySavings) { this.monthlySavings = monthlySavings; }

    public List<Transaction> getRecentTransactions() { return recentTransactions; }
    public void setRecentTransactions(List<Transaction> recentTransactions) { this.recentTransactions = recentTransactions; }

    public List<CategorySpendingDto> getCategorySpending() { return categorySpending; }
    public void setCategorySpending(List<CategorySpendingDto> categorySpending) { this.categorySpending = categorySpending; }

    public List<MonthlySummaryDto> getMonthlyComparison() { return monthlyComparison; }
    public void setMonthlyComparison(List<MonthlySummaryDto> monthlyComparison) { this.monthlyComparison = monthlyComparison; }
}
