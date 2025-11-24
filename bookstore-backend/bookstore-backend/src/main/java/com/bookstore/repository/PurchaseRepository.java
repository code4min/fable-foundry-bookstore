package com.bookstore.repository;

import com.bookstore.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    // Existing methods (unchanged)
    List<Purchase> findByEmail(String email);
    List<Purchase> findByEmailContainingIgnoreCase(String email);
    List<Purchase> findByStatus(String status);
    List<Purchase> findByBookId(Long bookId);


    @Query("SELECT SUM(p.price) FROM Purchase p")
    Double getTotalRevenue(); // you already have this; may return null if no purchases

    List<Purchase> findByPurchaseDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT p.bookId, p.title, COUNT(p) as cnt FROM Purchase p GROUP BY p.bookId, p.title ORDER BY cnt DESC")
    List<Object[]> findTopBooks(Pageable pageable);

    // ------------------ New additions for Reports ------------------

    // clearer alias for total sales (keeps compatibility)
    @Query("SELECT SUM(p.price) FROM Purchase p")
    Double getTotalSalesAmount();

    // total number of orders
    @Query("SELECT COUNT(p.id) FROM Purchase p")
    Long getTotalOrdersCount();

    // average order value (may return null if no records)
    @Query("SELECT AVG(p.price) FROM Purchase p")
    Double getAverageOrderValue();

    // Sales per day between two dates — useful for sales trend chart
    // Returns List of Object[] where [0] = LocalDate (purchaseDate), [1] = Double (sum)
    @Query("SELECT p.purchaseDate, SUM(p.price) FROM Purchase p " +
           "WHERE p.purchaseDate BETWEEN :start AND :end GROUP BY p.purchaseDate ORDER BY p.purchaseDate")
    List<Object[]> findDailySalesBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    // ----------------------------------------------------------------
}
