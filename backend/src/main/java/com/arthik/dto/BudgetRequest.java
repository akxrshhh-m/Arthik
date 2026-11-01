package com.arthik.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;

public class BudgetRequest {
    @NotNull(message = "Category is required")
    private Long categoryId;

    @NotBlank(message = "Month and year is required")
    @Pattern(regexp = "^\\d{4}-\\d{2}$", message = "Format must be YYYY-MM")
    private String monthYear;

    @NotNull(message = "Amount limit is required")
    @DecimalMin(value = "0.01", message = "Budget limit must be greater than zero")
    private BigDecimal amountLimit;

    public BudgetRequest() {}

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getMonthYear() { return monthYear; }
    public void setMonthYear(String monthYear) { this.monthYear = monthYear; }

    public BigDecimal getAmountLimit() { return amountLimit; }
    public void setAmountLimit(BigDecimal amountLimit) { this.amountLimit = amountLimit; }
}
