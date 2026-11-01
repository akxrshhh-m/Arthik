package com.arthik.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Budget {
    private Long id;
    private Long userId;
    private Long categoryId;
    private String categoryName;
    private String categoryColor;
    private String categoryIcon;
    private String monthYear; // YYYY-MM
    private BigDecimal amountLimit;
    private BigDecimal spentAmount; // calculated dynamically
    private LocalDateTime createdAt;

    public Budget() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCategoryColor() { return categoryColor; }
    public void setCategoryColor(String categoryColor) { this.categoryColor = categoryColor; }

    public String getCategoryIcon() { return categoryIcon; }
    public void setCategoryIcon(String categoryIcon) { this.categoryIcon = categoryIcon; }

    public String getMonthYear() { return monthYear; }
    public void setMonthYear(String monthYear) { this.monthYear = monthYear; }

    public BigDecimal getAmountLimit() { return amountLimit; }
    public void setAmountLimit(BigDecimal amountLimit) { this.amountLimit = amountLimit; }

    public BigDecimal getSpentAmount() { return spentAmount != null ? spentAmount : BigDecimal.ZERO; }
    public void setSpentAmount(BigDecimal spentAmount) { this.spentAmount = spentAmount; }

    public BigDecimal getRemainingAmount() {
        if (amountLimit == null) return BigDecimal.ZERO;
        return amountLimit.subtract(getSpentAmount());
    }

    public double getPercentageSpent() {
        if (amountLimit == null || amountLimit.compareTo(BigDecimal.ZERO) == 0) return 0.0;
        return getSpentAmount().doubleValue() / amountLimit.doubleValue() * 100.0;
    }

    public boolean isWarning() {
        return getPercentageSpent() >= 80.0;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
