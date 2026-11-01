package com.arthik.dto;

import java.math.BigDecimal;

public class MonthlySummaryDto {
    private String month;
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal savings;

    public MonthlySummaryDto() {}

    public MonthlySummaryDto(String month, BigDecimal income, BigDecimal expense, BigDecimal savings) {
        this.month = month;
        this.income = income != null ? income : BigDecimal.ZERO;
        this.expense = expense != null ? expense : BigDecimal.ZERO;
        this.savings = savings != null ? savings : BigDecimal.ZERO;
    }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public BigDecimal getIncome() { return income; }
    public void setIncome(BigDecimal income) { this.income = income; }

    public BigDecimal getExpense() { return expense; }
    public void setExpense(BigDecimal expense) { this.expense = expense; }

    public BigDecimal getSavings() { return savings; }
    public void setSavings(BigDecimal savings) { this.savings = savings; }
}
