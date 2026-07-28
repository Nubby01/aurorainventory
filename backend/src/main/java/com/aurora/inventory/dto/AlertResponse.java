package com.aurora.inventory.dto;

import com.aurora.inventory.domain.AlertStatus;
import com.aurora.inventory.domain.StockAlert;
import java.time.Instant;

public class AlertResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private String message;
    private AlertStatus status;
    private Integer stockAtAlert;
    private Integer minStockAtAlert;
    private Instant createdAt;
    private Instant resolvedAt;

    public static AlertResponse from(StockAlert alert) {
        AlertResponse response = new AlertResponse();
        response.id = alert.getId();
        response.productId = alert.getProduct().getId();
        response.productName = alert.getProduct().getName();
        response.productSku = alert.getProduct().getSku();
        response.message = alert.getMessage();
        response.status = alert.getStatus();
        response.stockAtAlert = alert.getStockAtAlert();
        response.minStockAtAlert = alert.getMinStockAtAlert();
        response.createdAt = alert.getCreatedAt();
        response.resolvedAt = alert.getResolvedAt();
        return response;
    }

    public Long getId() {
        return id;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public String getProductSku() {
        return productSku;
    }

    public String getMessage() {
        return message;
    }

    public AlertStatus getStatus() {
        return status;
    }

    public Integer getStockAtAlert() {
        return stockAtAlert;
    }

    public Integer getMinStockAtAlert() {
        return minStockAtAlert;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getResolvedAt() {
        return resolvedAt;
    }
}
