package com.arthik.algorithm;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Academic Integration - ADSA (Advanced Data Structures and Algorithms):
 * Max Heap (Binary Heap) Implementation to find the Top N Spending Categories.
 *
 * Data Structure Analysis:
 * - A complete binary tree represented as a dynamic array.
 * - Max Heap Property: value of each parent node >= values of its children.
 * - Root element always contains the category with the highest expenditure.
 *
 * Complexity:
 * - Heapify / Sift-Down:  O(log K) where K is number of categories
 * - Build Heap:          O(K) linear-time bottom-up construction
 * - Extract Max:         O(log K)
 * - Top M Extraction:    O(K + M log K) -> Optimal for finding top M elements
 */
public class CategoryMaxHeap {

    public static class CategorySpendingItem {
        private String categoryName;
        private BigDecimal totalAmount;
        private String color;
        private String icon;
        private int transactionCount;

        public CategorySpendingItem(String categoryName, BigDecimal totalAmount, String color, String icon, int transactionCount) {
            this.categoryName = categoryName;
            this.totalAmount = totalAmount != null ? totalAmount : BigDecimal.ZERO;
            this.color = color;
            this.icon = icon;
            this.transactionCount = transactionCount;
        }

        public String getCategoryName() { return categoryName; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public String getColor() { return color; }
        public String getIcon() { return icon; }
        public int getTransactionCount() { return transactionCount; }
    }

    private final List<CategorySpendingItem> heap;

    public CategoryMaxHeap() {
        this.heap = new ArrayList<>();
    }

    public CategoryMaxHeap(List<CategorySpendingItem> items) {
        this.heap = new ArrayList<>(items);
        buildMaxHeap();
    }

    public int size() {
        return heap.size();
    }

    public boolean isEmpty() {
        return heap.isEmpty();
    }

    public void insert(CategorySpendingItem item) {
        heap.add(item);
        siftUp(heap.size() - 1);
    }

    public CategorySpendingItem extractMax() {
        if (isEmpty()) {
            return null;
        }
        CategorySpendingItem maxItem = heap.get(0);
        CategorySpendingItem lastItem = heap.remove(heap.size() - 1);
        if (!isEmpty()) {
            heap.set(0, lastItem);
            siftDown(0);
        }
        return maxItem;
    }

    private void buildMaxHeap() {
        int n = heap.size();
        for (int i = (n / 2) - 1; i >= 0; i--) {
            siftDown(i);
        }
    }

    private void siftUp(int index) {
        while (index > 0) {
            int parentIndex = (index - 1) / 2;
            if (heap.get(index).getTotalAmount().compareTo(heap.get(parentIndex).getTotalAmount()) > 0) {
                swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    private void siftDown(int index) {
        int n = heap.size();
        while (true) {
            int largest = index;
            int left = 2 * index + 1;
            int right = 2 * index + 2;

            if (left < n && heap.get(left).getTotalAmount().compareTo(heap.get(largest).getTotalAmount()) > 0) {
                largest = left;
            }
            if (right < n && heap.get(right).getTotalAmount().compareTo(heap.get(largest).getTotalAmount()) > 0) {
                largest = right;
            }

            if (largest != index) {
                swap(index, largest);
                index = largest;
            } else {
                break;
            }
        }
    }

    private void swap(int i, int j) {
        CategorySpendingItem temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    /**
     * Extracts the top N categories using the Max Heap.
     */
    public static List<CategorySpendingItem> getTopCategories(List<CategorySpendingItem> allCategories, int limit) {
        if (allCategories == null || allCategories.isEmpty()) {
            return new ArrayList<>();
        }
        CategoryMaxHeap maxHeap = new CategoryMaxHeap(allCategories);
        List<CategorySpendingItem> topList = new ArrayList<>();
        int count = Math.min(limit, maxHeap.size());
        for (int i = 0; i < count; i++) {
            CategorySpendingItem max = maxHeap.extractMax();
            if (max != null) {
                topList.add(max);
            }
        }
        return topList;
    }
}
