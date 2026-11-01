package com.arthik.service;

import com.arthik.algorithm.TransactionMergeSort;
import com.arthik.dto.TransactionRequest;
import com.arthik.model.Category;
import com.arthik.model.ExpenseTransaction;
import com.arthik.model.IncomeTransaction;
import com.arthik.model.Transaction;
import com.arthik.repository.CategoryRepository;
import com.arthik.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public TransactionService(TransactionRepository transactionRepository, CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Transaction> getTransactions(Long userId, Long categoryId, LocalDate startDate,
                                            LocalDate endDate, String search, String sortBy, String order) {
        List<Transaction> list = transactionRepository.findAll(userId, categoryId, startDate, endDate, search);

        // Academic Integration: ADSA Merge Sort application
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            return TransactionMergeSort.sort(list, sortBy, order);
        }
        return list;
    }

    public Transaction getTransactionById(Long id, Long userId) {
        return transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found or access denied"));
    }

    public Transaction createTransaction(Long userId, TransactionRequest req) {
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category selected"));

        Transaction tx = "INCOME".equalsIgnoreCase(req.getType()) ? new IncomeTransaction() : new ExpenseTransaction();
        tx.setUserId(userId);
        tx.setCategoryId(req.getCategoryId());
        tx.setCategoryName(category.getName());
        tx.setCategoryColor(category.getColor());
        tx.setCategoryIcon(category.getIcon());
        tx.setTitle(req.getTitle().trim());
        tx.setAmount(req.getAmount());
        tx.setType(req.getType().toUpperCase());
        tx.setTransactionDate(req.getTransactionDate());
        tx.setPaymentMethod(req.getPaymentMethod().trim());
        tx.setDescription(req.getDescription() != null ? req.getDescription().trim() : null);

        return transactionRepository.save(tx);
    }

    public Transaction updateTransaction(Long id, Long userId, TransactionRequest req) {
        Transaction tx = getTransactionById(id, userId);
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category selected"));

        tx.setCategoryId(req.getCategoryId());
        tx.setCategoryName(category.getName());
        tx.setCategoryColor(category.getColor());
        tx.setCategoryIcon(category.getIcon());
        tx.setTitle(req.getTitle().trim());
        tx.setAmount(req.getAmount());
        tx.setType(req.getType().toUpperCase());
        tx.setTransactionDate(req.getTransactionDate());
        tx.setPaymentMethod(req.getPaymentMethod().trim());
        tx.setDescription(req.getDescription() != null ? req.getDescription().trim() : null);

        transactionRepository.update(tx);
        return tx;
    }

    public void deleteTransaction(Long id, Long userId) {
        boolean deleted = transactionRepository.deleteByIdAndUserId(id, userId);
        if (!deleted) {
            throw new IllegalArgumentException("Transaction not found or access denied");
        }
    }

    public List<Category> getCategories(Long userId) {
        return categoryRepository.findAllForUser(userId);
    }
}
