package com.bookstore.dto;

public class DashboardSummaryDTO {
    private long totalBooks;
    private long totalUsers;
    private long totalOrders;
    private double totalRevenue;

    // constructors
    public DashboardSummaryDTO() {}

    public DashboardSummaryDTO(long totalBooks, long totalUsers, long totalOrders, double totalRevenue) {
        this.totalBooks = totalBooks;
        this.totalUsers = totalUsers;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
    }

    // getters / setters
    public long getTotalBooks() { return totalBooks; }
    public void setTotalBooks(long totalBooks) { this.totalBooks = totalBooks; }
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }
}
