package com.bookstore.dto;

public class TopBookDTO {
    private Long bookId;
    private String title;
    private long salesCount;

    public TopBookDTO() {}
    public TopBookDTO(Long bookId, String title, long salesCount) {
        this.bookId = bookId;
        this.title = title;
        this.salesCount = salesCount;
    }

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public long getSalesCount() { return salesCount; }
    public void setSalesCount(long salesCount) { this.salesCount = salesCount; }
}
