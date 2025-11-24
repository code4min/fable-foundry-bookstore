package com.bookstore.dto;

public class InventoryDTO {

    private int totalStock;
    private long lowStock;
    private long outOfStock;

    public InventoryDTO(int totalStock, long lowStock, long outOfStock) {
        this.totalStock = totalStock;
        this.lowStock = lowStock;
        this.outOfStock = outOfStock;
    }

    public int getTotalStock() {
        return totalStock;
    }

    public void setTotalStock(int totalStock) {
        this.totalStock = totalStock;
    }

    public long getLowStock() {
        return lowStock;
    }

    public void setLowStock(long lowStock) {
        this.lowStock = lowStock;
    }

    public long getOutOfStock() {
        return outOfStock;
    }

    public void setOutOfStock(long outOfStock) {
        this.outOfStock = outOfStock;
    }
}
