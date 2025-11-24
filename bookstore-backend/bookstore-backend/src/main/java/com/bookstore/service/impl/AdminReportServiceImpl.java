package com.bookstore.service.impl;

import com.bookstore.dto.*;
import com.bookstore.model.Book;
import com.bookstore.model.Purchase;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CategoryRepository;
import com.bookstore.repository.PurchaseRepository;
import com.bookstore.repository.UserRepository;
import com.bookstore.service.AdminReportService;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminReportServiceImpl implements AdminReportService {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // ================== SUMMARY =====================

    @Override
    public ReportSummaryDTO getReportSummary(LocalDate start, LocalDate end) {

        Double totalRevenue = purchaseRepository.getTotalSalesAmount();
        Long totalOrders = purchaseRepository.getTotalOrdersCount();
        Double avgOrderValue = purchaseRepository.getAverageOrderValue();
        Long totalUsers = userRepository.count();

        return new ReportSummaryDTO(
                totalOrders != null ? totalOrders : 0L,
                totalRevenue != null ? totalRevenue : 0.0,
                totalUsers != null ? totalUsers : 0L,
                avgOrderValue != null ? avgOrderValue : 0.0
        );
    }

    // ================== DAILY SALES =====================

    @Override
    public List<DailySalesDTO> getDailySales(LocalDate start, LocalDate end) {
        List<Object[]> rows = purchaseRepository.findDailySalesBetween(start, end);

        return rows.stream()
                .map(r -> new DailySalesDTO(
                        (LocalDate) r[0],
                        r[1] != null ? (Double) r[1] : 0.0
                ))
                .collect(Collectors.toList());
    }

    // ================== SALES BY CATEGORY =====================

    @Override
    public List<SalesByCategoryDTO> getSalesByCategory(LocalDate start, LocalDate end) {

        List<Purchase> purchases = purchaseRepository.findByPurchaseDateBetween(start, end);
        Map<String, Double> revenueMap = new HashMap<>();

        for (Purchase purchase : purchases) {
            Book book = bookRepository.findById(purchase.getBookId()).orElse(null);
            if (book == null || book.getCategory() == null) continue;

            String categoryName = book.getCategory().getName();
            revenueMap.put(categoryName,
                    revenueMap.getOrDefault(categoryName, 0.0) + purchase.getPrice());
        }

        return revenueMap.entrySet()
                .stream()
                .map(entry -> new SalesByCategoryDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    // ================== BEST SELLERS =====================

    @Override
    public List<BestSellerDTO> getBestSellers(int limit) {

        List<Object[]> rows = purchaseRepository.findTopBooks(
                org.springframework.data.domain.PageRequest.of(0, limit)
        );

        return rows.stream()
                .map(r -> new BestSellerDTO(
                        (Long) r[0],
                        (String) r[1],
                        (Long) r[2]
                ))
                .collect(Collectors.toList());
    }

    // ================== INVENTORY =====================

    @Override
    public InventoryDTO getInventoryStatus() {

        List<Book> books = bookRepository.findAll();

        int totalStock = books.stream().mapToInt(Book::getStock).sum();
        long lowStock = books.stream().filter(b -> b.getStock() > 0 && b.getStock() <= 5).count();
        long outOfStock = books.stream().filter(b -> b.getStock() == 0).count();

        return new InventoryDTO(totalStock, lowStock, outOfStock);
    }
}
