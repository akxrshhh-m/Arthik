package com.arthik.dto;

import java.math.BigDecimal;

public class CategorySpendingDto {
    private String categoryName;
    private BigDecimal amount;
    private String color;
    private String icon;
    private double percentage;

    public CategorySpendingDto() {}

    public CategorySpendingDto(String categoryName, BigDecimal amount, String color, String icon, double percentage) {
        this.categoryName = categoryName;
        this.amount = amount;
        this.color = color;
        this.icon = icon;
        this.percentage = percentage;
    }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
}
