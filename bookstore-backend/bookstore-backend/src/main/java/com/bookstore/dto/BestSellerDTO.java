package com.bookstore.dto;

public class BestSellerDTO {

    private Long bookId;
    private String title;
    private Long count;

    public BestSellerDTO(Long bookId, String title, Long count) {
        this.bookId = bookId;
        this.title = title;
        this.count = count;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
