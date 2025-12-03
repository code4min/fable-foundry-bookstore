package com.bookstore.service;

import com.bookstore.dto.*;
import com.bookstore.model.Book;
import com.bookstore.model.Purchase;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.PurchaseRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private UserRepository userRepository;

    public DashboardSummaryDTO getSummary() {
        long totalBooks = bookRepository.count();
        long totalUsers = userRepository.count();
        long totalOrders = purchaseRepository.count();
        Double revenueObj = purchaseRepository.getTotalRevenue();
        double totalRevenue = revenueObj == null ? 0.0 : revenueObj;

        return new DashboardSummaryDTO(totalBooks, totalUsers, totalOrders, totalRevenue);
    }

    
    public List<SalesPointDTO> getSalesTrend(int days) {
        if (days <= 0) days = 7;
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(days - 1);

        List<Purchase> purchases = purchaseRepository.findByPurchaseDateBetween(start, end);

        
        Map<LocalDate, Double> map = new HashMap<>();
        for (int i = 0; i < days; i++) {
            map.put(start.plusDays(i), 0.0);
        }

        for (Purchase p : purchases) {
            LocalDate d = p.getPurchaseDate();
            if (d != null && !d.isBefore(start) && !d.isAfter(end)) {
                map.put(d, map.getOrDefault(d, 0.0) + p.getPrice());
            }
        }

        return map.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new SalesPointDTO(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }

    public List<TopBookDTO> getTopBooks(int limit) {
        List<Object[]> raw = purchaseRepository.findTopBooks(PageRequest.of(0, Math.max(1, limit)));
        List<TopBookDTO> out = new ArrayList<>();
        for (Object[] row : raw) {
            Long bookId = row[0] == null ? null : ((Number) row[0]).longValue();
            String title = (String) row[1];
            long cnt = row[2] == null ? 0L : ((Number) row[2]).longValue();
            out.add(new TopBookDTO(bookId, title, cnt));
        }
        return out;
    }

    public List<InventoryItemDTO> getLowStock(int threshold, int limit) {
        List<Book> low = bookRepository.findByStockLessThanOrderByStockAsc(threshold);
        if (limit > 0) {
            low = low.stream().limit(limit).collect(Collectors.toList());
        }
        return low.stream()
                .map(b -> new InventoryItemDTO(b.getId(), b.getTitle(), b.getStock()))
                .collect(Collectors.toList());
    }

    public List<Purchase> getRecentPurchases(int limit) {
        
        List<Purchase> all = purchaseRepository.findAll();
        return all.stream()
                .sorted(Comparator.comparing(Purchase::getPurchaseDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(limit)
                .collect(Collectors.toList());
    }
}
