package com.bookstore.dto;

import java.time.LocalDate;

public class DailySalesDTO {

    private LocalDate date;
    private double salesAmount;

    public DailySalesDTO(LocalDate date, double salesAmount) {
        this.date = date;
        this.salesAmount = salesAmount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getSalesAmount() {
        return salesAmount;
    }

    public void setSalesAmount(double salesAmount) {
        this.salesAmount = salesAmount;
    }
}
