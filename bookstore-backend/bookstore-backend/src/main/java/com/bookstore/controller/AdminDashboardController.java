package com.bookstore.controller;

import com.bookstore.dto.*;
import com.bookstore.model.Purchase;
import com.bookstore.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "*")
public class AdminDashboardController {

    @Autowired
    private AdminDashboardService dashboardService;

    @GetMapping("/summary")
    public DashboardSummaryDTO summary() {
        return dashboardService.getSummary();
    }

    @GetMapping("/sales-trend")
    public List<SalesPointDTO> salesTrend(@RequestParam(defaultValue = "7") int days) {
        return dashboardService.getSalesTrend(days);
    }

    @GetMapping("/top-books")
    public List<TopBookDTO> topBooks(@RequestParam(defaultValue = "5") int limit) {
        return dashboardService.getTopBooks(limit);
    }

    @GetMapping("/low-stock")
    public List<InventoryItemDTO> lowStock(@RequestParam(defaultValue = "5") int threshold,
                                           @RequestParam(defaultValue = "10") int limit) {
 
        return dashboardService.getLowStock(threshold, limit);
    }

    @GetMapping("/recent-purchases")
    public List<Purchase> recentPurchases(@RequestParam(defaultValue = "10") int limit) {
        return dashboardService.getRecentPurchases(limit);
    }
}
