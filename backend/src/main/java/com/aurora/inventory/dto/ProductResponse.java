package com.aurora.inventory.dto;

import com.aurora.inventory.domain.Product;
import java.math.BigDecimal;
import java.time.Instant;

public class ProductResponse {
    private Long id;
    private String name;
    private String sku;
    private String description;
    private Long categoryId;
    private String categoryName;
    private BigDecimal unitPrice;
    private String unit;
    private Integer stockQuantity;
    private Integer minStock;
    private boolean active;
    private boolean lowStock;
    private Instant createdAt;
    private Instant updatedAt;

    public static ProductResponse from(Product product) {
        ProductResponse response = new ProductResponse();
        response.id = product.getId();
        response.name = product.getName();
        response.sku = product.getSku();
        response.description = product.getDescription();
        response.categoryId = product.getCategory().getId();
        response.categoryName = product.getCategory().getName();
        response.unitPrice = product.getUnitPrice();
        response.unit = product.getUnit();
        response.stockQuantity = product.getStockQuantity();
        response.minStock = product.getMinStock();
        response.active = product.isActive();
        response.lowStock = product.isLowStock();
        response.createdAt = product.getCreatedAt();
        response.updatedAt = product.getUpdatedAt();
        return response;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSku() {
        return sku;
    }

    public String getDescription() {
        return description;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public String getUnit() {
        return unit;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public Integer getMinStock() {
        return minStock;
    }

    public boolean isActive() {
        return active;
    }

    public boolean isLowStock() {
        return lowStock;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
