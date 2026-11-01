package com.arthik.controller;

import com.arthik.dto.TransactionRequest;
import com.arthik.model.Category;
import com.arthik.model.Transaction;
import com.arthik.service.TransactionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    private Long getUserId(HttpServletRequest request) {
        return (Long) request.getAttribute("userId");
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions(
            HttpServletRequest request,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String order) {

        Long userId = getUserId(request);
        List<Transaction> list = transactionService.getTransactions(userId, categoryId, startDate, endDate, search, sortBy, order);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(HttpServletRequest request, @PathVariable Long id) {
        Long userId = getUserId(request);
        Transaction tx = transactionService.getTransactionById(id, userId);
        return ResponseEntity.ok(tx);
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(HttpServletRequest request, @Valid @RequestBody TransactionRequest req) {
        Long userId = getUserId(request);
        Transaction created = transactionService.createTransaction(userId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            HttpServletRequest request,
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest req) {
        Long userId = getUserId(request);
        Transaction updated = transactionService.updateTransaction(id, userId, req);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTransaction(HttpServletRequest request, @PathVariable Long id) {
        Long userId = getUserId(request);
        transactionService.deleteTransaction(id, userId);
        return ResponseEntity.ok(Map.of("message", "Transaction deleted successfully"));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories(HttpServletRequest request) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(transactionService.getCategories(userId));
    }
}
