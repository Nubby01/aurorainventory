package com.aurora.inventory.dto;

import java.math.BigDecimal;
import java.util.List;

public class ReportSummaryResponse {
    private long totalProducts;
    private long activeProducts;
    private long totalCategories;
    private long lowStockCount;
    private long openAlerts;
    private long movementsLast7Days;
    private BigDecimal inventoryValue;
    private List<CategoryStockReport> byCategory;
    private List<ProductResponse> topLowStock;

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getActiveProducts() {
        return activeProducts;
    }

    public void setActiveProducts(long activeProducts) {
        this.activeProducts = activeProducts;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public long getLowStockCount() {
        return lowStockCount;
    }

    public void setLowStockCount(long lowStockCount) {
        this.lowStockCount = lowStockCount;
    }

    public long getOpenAlerts() {
        return openAlerts;
    }

    public void setOpenAlerts(long openAlerts) {
        this.openAlerts = openAlerts;
    }

    public long getMovementsLast7Days() {
        return movementsLast7Days;
    }

    public void setMovementsLast7Days(long movementsLast7Days) {
        this.movementsLast7Days = movementsLast7Days;
    }

    public BigDecimal getInventoryValue() {
        return inventoryValue;
    }

    public void setInventoryValue(BigDecimal inventoryValue) {
        this.inventoryValue = inventoryValue;
    }

    public List<CategoryStockReport> getByCategory() {
        return byCategory;
    }

    public void setByCategory(List<CategoryStockReport> byCategory) {
        this.byCategory = byCategory;
    }

    public List<ProductResponse> getTopLowStock() {
        return topLowStock;
    }

    public void setTopLowStock(List<ProductResponse> topLowStock) {
        this.topLowStock = topLowStock;
    }
}
