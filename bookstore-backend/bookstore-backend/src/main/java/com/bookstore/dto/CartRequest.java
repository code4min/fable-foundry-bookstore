package com.bookstore.dto;

public class CartRequest {
    private String email;
    private Long bookId;

    public CartRequest() {}

    public CartRequest(String email, Long bookId) {
        this.email = email;
        this.bookId = bookId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }
}
