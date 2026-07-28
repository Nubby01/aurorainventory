package com.aurora.inventory.controller;

import com.aurora.inventory.dto.StockMovementRequest;
import com.aurora.inventory.dto.StockMovementResponse;
import com.aurora.inventory.service.StockService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/movements")
    public List<StockMovementResponse> list() {
        return stockService.findAll();
    }

    @GetMapping("/movements/product/{productId}")
    public List<StockMovementResponse> byProduct(@PathVariable Long productId) {
        return stockService.findByProduct(productId);
    }

    @PostMapping("/movements")
    @ResponseStatus(HttpStatus.CREATED)
    public StockMovementResponse move(@Valid @RequestBody StockMovementRequest request) {
        return stockService.move(request);
    }
}
