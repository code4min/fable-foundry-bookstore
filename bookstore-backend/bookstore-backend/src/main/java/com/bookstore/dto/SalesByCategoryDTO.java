package com.bookstore.dto;

public class SalesByCategoryDTO {

    private String categoryName;
    private double revenue;

    public SalesByCategoryDTO(String categoryName, double revenue) {
        this.categoryName = categoryName;
        this.revenue = revenue;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public double getRevenue() {
        return revenue;
    }

    public void setRevenue(double revenue) {
        this.revenue = revenue;
    }
}
