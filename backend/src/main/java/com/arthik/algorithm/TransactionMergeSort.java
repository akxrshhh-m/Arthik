package com.arthik.algorithm;

import com.arthik.model.Transaction;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Academic Integration - ADSA (Advanced Data Structures and Algorithms):
 * Merge Sort Implementation for Transactions.
 *
 * Algorithm Analysis:
 * - Divide: Recursively split the transaction list into halves until subarrays have 0 or 1 element.
 * - Conquer: Subarrays of size 1 are trivially sorted.
 * - Combine (Merge): Interleave two sorted halves into one sorted list in linear time O(N).
 *
 * Complexity:
 * - Best Case Time Complexity:    O(N log N)
 * - Average Case Time Complexity: O(N log N)
 * - Worst Case Time Complexity:   O(N log N)
 * - Space Complexity:             O(N) for temporary auxiliary arrays
 * - Stability:                    Stable (preserves the original relative order of equal keys)
 */
public class TransactionMergeSort {

    public static List<Transaction> sort(List<Transaction> items, String sortBy, String order) {
        if (items == null || items.size() <= 1) {
            return items;
        }

        Comparator<Transaction> comparator = createComparator(sortBy, order);
        List<Transaction> result = new ArrayList<>(items);
        mergeSort(result, 0, result.size() - 1, comparator);
        return result;
    }

    private static void mergeSort(List<Transaction> list, int left, int right, Comparator<Transaction> comparator) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(list, left, mid, comparator);
            mergeSort(list, mid + 1, right, comparator);
            merge(list, left, mid, right, comparator);
        }
    }

    private static void merge(List<Transaction> list, int left, int mid, int right, Comparator<Transaction> comparator) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        List<Transaction> leftList = new ArrayList<>(n1);
        List<Transaction> rightList = new ArrayList<>(n2);

        for (int i = 0; i < n1; i++) {
            leftList.add(list.get(left + i));
        }
        for (int j = 0; j < n2; j++) {
            rightList.add(list.get(mid + 1 + j));
        }

        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            if (comparator.compare(leftList.get(i), rightList.get(j)) <= 0) {
                list.set(k, leftList.get(i));
                i++;
            } else {
                list.set(k, rightList.get(j));
                j++;
            }
            k++;
        }

        while (i < n1) {
            list.set(k, leftList.get(i));
            i++;
            k++;
        }

        while (j < n2) {
            list.set(k, rightList.get(j));
            j++;
            k++;
        }
    }

    private static Comparator<Transaction> createComparator(String sortBy, String order) {
        boolean ascending = !"desc".equalsIgnoreCase(order);

        Comparator<Transaction> comparator;
        if ("amount".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(
                Transaction::getAmount,
                Comparator.nullsLast(Comparator.naturalOrder())
            );
        } else {
            // Default sort by transaction date, then by id
            comparator = Comparator.comparing(
                Transaction::getTransactionDate,
                Comparator.nullsLast(Comparator.naturalOrder())
            ).thenComparing(Transaction::getId, Comparator.nullsLast(Comparator.naturalOrder()));
        }

        return ascending ? comparator : comparator.reversed();
    }
}
