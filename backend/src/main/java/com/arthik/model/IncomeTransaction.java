package com.arthik.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Academic Integration - Java OOP:
 * Subclass representing an Income Transaction, overriding abstract methods.
 */
public class IncomeTransaction extends Transaction {

    public IncomeTransaction() {
        super();
        this.type = "INCOME";
    }

    public IncomeTransaction(Long id, Long userId, Long categoryId, String categoryName, String categoryColor,
                             String categoryIcon, String title, BigDecimal amount,
                             LocalDate transactionDate, String paymentMethod, String description,
                             LocalDateTime createdAt) {
        super(id, userId, categoryId, categoryName, categoryColor, categoryIcon, title, amount, "INCOME",
              transactionDate, paymentMethod, description, createdAt);
    }

    @Override
    public BigDecimal calculateNetImpact() {
        // Income adds positively to the cash flow
        return this.amount != null ? this.amount : BigDecimal.ZERO;
    }

    @Override
    public String getDisplayType() {
        return "+ Credit";
    }
}
