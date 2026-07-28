package com.aurora.inventory.dto;

import java.math.BigDecimal;

public class CategoryStockReport {
    private Long categoryId;
    private String categoryName;
    private long productCount;
    private long totalUnits;
    private BigDecimal stockValue;

    public CategoryStockReport(Long categoryId, String categoryName, long productCount, long totalUnits, BigDecimal stockValue) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.productCount = productCount;
        this.totalUnits = totalUnits;
        this.stockValue = stockValue;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public long getProductCount() {
        return productCount;
    }

    public long getTotalUnits() {
        return totalUnits;
    }

    public BigDecimal getStockValue() {
        return stockValue;
    }
}
