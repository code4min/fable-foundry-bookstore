package com.bookstore.controller;

import com.bookstore.dto.*;
import com.bookstore.service.AdminReportService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "*")
public class AdminReportController {

    @Autowired
    private AdminReportService adminReportService;

    @GetMapping("/summary")
    public ReportSummaryDTO getSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return adminReportService.getReportSummary(start, end);
    }

    @GetMapping("/daily-sales")
    public List<DailySalesDTO> getDailySales(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return adminReportService.getDailySales(start, end);
    }

    @GetMapping("/sales-by-category")
    public List<SalesByCategoryDTO> getSalesByCategory(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return adminReportService.getSalesByCategory(start, end);
    }

    @GetMapping("/best-sellers")
    public List<BestSellerDTO> getBestSellers(
            @RequestParam(defaultValue = "5") int limit
    ) {
        return adminReportService.getBestSellers(limit);
    }

    @GetMapping("/inventory")
    public InventoryDTO getInventoryStatus() {
        return adminReportService.getInventoryStatus();
    }
}
