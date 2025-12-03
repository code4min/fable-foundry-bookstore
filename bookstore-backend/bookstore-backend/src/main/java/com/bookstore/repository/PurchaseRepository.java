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
    
    List<Purchase> findByEmail(String email);
    List<Purchase> findByEmailContainingIgnoreCase(String email);
    List<Purchase> findByStatus(String status);
    List<Purchase> findByBookId(Long bookId);


    @Query("SELECT SUM(p.price) FROM Purchase p")
    Double getTotalRevenue(); 

    List<Purchase> findByPurchaseDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT p.bookId, p.title, COUNT(p) as cnt FROM Purchase p GROUP BY p.bookId, p.title ORDER BY cnt DESC")
    List<Object[]> findTopBooks(Pageable pageable);

    

    
    @Query("SELECT SUM(p.price) FROM Purchase p")
    Double getTotalSalesAmount();

   
    @Query("SELECT COUNT(p.id) FROM Purchase p")
    Long getTotalOrdersCount();

    
    @Query("SELECT AVG(p.price) FROM Purchase p")
    Double getAverageOrderValue();

    
    @Query("SELECT p.purchaseDate, SUM(p.price) FROM Purchase p " +
           "WHERE p.purchaseDate BETWEEN :start AND :end GROUP BY p.purchaseDate ORDER BY p.purchaseDate")
    List<Object[]> findDailySalesBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    
}
