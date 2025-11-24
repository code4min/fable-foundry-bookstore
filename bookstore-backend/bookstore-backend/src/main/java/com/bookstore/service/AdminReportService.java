package com.bookstore.service;

import com.bookstore.dto.*;
import java.time.LocalDate;
import java.util.List;

public interface AdminReportService {

    ReportSummaryDTO getReportSummary(LocalDate start, LocalDate end);

    List<DailySalesDTO> getDailySales(LocalDate start, LocalDate end);

    List<SalesByCategoryDTO> getSalesByCategory(LocalDate start, LocalDate end);

    List<BestSellerDTO> getBestSellers(int limit);

    InventoryDTO getInventoryStatus();
}
