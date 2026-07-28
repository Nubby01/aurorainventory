package com.aurora.inventory.dto;

import com.aurora.inventory.domain.Category;
import java.time.Instant;

public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private Instant createdAt;
    private long productCount;

    public static CategoryResponse from(Category category, long productCount) {
        CategoryResponse response = new CategoryResponse();
        response.id = category.getId();
        response.name = category.getName();
        response.description = category.getDescription();
        response.createdAt = category.getCreatedAt();
        response.productCount = productCount;
        return response;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public long getProductCount() {
        return productCount;
    }
}
