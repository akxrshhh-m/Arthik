package com.arthik.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Academic Integration - Java OOP:
 * Abstract base class demonstrating Abstraction, Inheritance, and Encapsulation.
 */
public abstract class Transaction {
    protected Long id;
    protected Long userId;
    protected Long categoryId;
    protected String categoryName;
    protected String categoryColor;
    protected String categoryIcon;
    protected String title;
    protected BigDecimal amount;
    protected String type; // INCOME or EXPENSE
    protected LocalDate transactionDate;
    protected String paymentMethod;
    protected String description;
    protected LocalDateTime createdAt;

    public Transaction() {}

    public Transaction(Long id, Long userId, Long categoryId, String categoryName, String categoryColor,
                       String categoryIcon, String title, BigDecimal amount, String type,
                       LocalDate transactionDate, String paymentMethod, String description,
                       LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryColor = categoryColor;
        this.categoryIcon = categoryIcon;
        this.title = title;
        this.amount = amount;
        this.type = type;
        this.transactionDate = transactionDate;
        this.paymentMethod = paymentMethod;
        this.description = description;
        this.createdAt = createdAt;
    }

    // Abstract methods to be overridden by subclasses (Polymorphism)
    public abstract BigDecimal calculateNetImpact();
    public abstract String getDisplayType();

    // Getters and Setters
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

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
