package com.aurora.inventory.dto;

import com.aurora.inventory.domain.MovementType;
import com.aurora.inventory.domain.StockMovement;
import java.time.Instant;

public class StockMovementResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private MovementType type;
    private Integer quantity;
    private Integer previousStock;
    private Integer newStock;
    private String reason;
    private Instant createdAt;

    public static StockMovementResponse from(StockMovement movement) {
        StockMovementResponse response = new StockMovementResponse();
        response.id = movement.getId();
        response.productId = movement.getProduct().getId();
        response.productName = movement.getProduct().getName();
        response.productSku = movement.getProduct().getSku();
        response.type = movement.getType();
        response.quantity = movement.getQuantity();
        response.previousStock = movement.getPreviousStock();
        response.newStock = movement.getNewStock();
        response.reason = movement.getReason();
        response.createdAt = movement.getCreatedAt();
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

    public MovementType getType() {
        return type;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Integer getPreviousStock() {
        return previousStock;
    }

    public Integer getNewStock() {
        return newStock;
    }

    public String getReason() {
        return reason;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
