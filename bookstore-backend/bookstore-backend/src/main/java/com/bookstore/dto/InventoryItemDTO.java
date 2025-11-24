package com.bookstore.dto;

public class InventoryItemDTO {
    private Long bookId;
    private String title;
    private int stock;

    public InventoryItemDTO() {}
    public InventoryItemDTO(Long bookId, String title, int stock) {
        this.bookId = bookId;
        this.title = title;
        this.stock = stock;
    }

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
}
