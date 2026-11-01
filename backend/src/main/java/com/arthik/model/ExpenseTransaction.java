package com.arthik.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Academic Integration - Java OOP:
 * Subclass representing an Expense Transaction, overriding abstract methods.
 */
public class ExpenseTransaction extends Transaction {

    public ExpenseTransaction() {
        super();
        this.type = "EXPENSE";
    }

    public ExpenseTransaction(Long id, Long userId, Long categoryId, String categoryName, String categoryColor,
                              String categoryIcon, String title, BigDecimal amount,
                              LocalDate transactionDate, String paymentMethod, String description,
                              LocalDateTime createdAt) {
        super(id, userId, categoryId, categoryName, categoryColor, categoryIcon, title, amount, "EXPENSE",
              transactionDate, paymentMethod, description, createdAt);
    }

    @Override
    public BigDecimal calculateNetImpact() {
        // Expense subtracts from the cash flow
        return this.amount != null ? this.amount.negate() : BigDecimal.ZERO;
    }

    @Override
    public String getDisplayType() {
        return "- Debit";
    }
}
