package com.aurora.inventory.service;

import com.aurora.inventory.domain.MovementType;
import com.aurora.inventory.domain.Product;
import com.aurora.inventory.domain.StockMovement;
import com.aurora.inventory.dto.StockMovementRequest;
import com.aurora.inventory.dto.StockMovementResponse;
import com.aurora.inventory.exception.BusinessException;
import com.aurora.inventory.repository.ProductRepository;
import com.aurora.inventory.repository.StockMovementRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class StockService {

    private final StockMovementRepository movementRepository;
    private final ProductRepository productRepository;
    private final AlertService alertService;

    public StockService(
            StockMovementRepository movementRepository,
            ProductRepository productRepository,
            AlertService alertService) {
        this.movementRepository = movementRepository;
        this.productRepository = productRepository;
        this.alertService = alertService;
    }

    @Transactional(readOnly = true)
    public List<StockMovementResponse> findAll() {
        return movementRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(StockMovementResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<StockMovementResponse> findByProduct(Long productId) {
        return movementRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(StockMovementResponse::from)
                .toList();
    }

    public StockMovementResponse move(StockMovementRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new BusinessException("Producto no encontrado: " + request.getProductId()));

        int previous = product.getStockQuantity();
        int quantity = request.getQuantity();
        int next;

        switch (request.getType()) {
            case IN -> next = previous + quantity;
            case OUT -> {
                if (quantity > previous) {
                    throw new BusinessException("Stock insuficiente. Disponible: " + previous);
                }
                next = previous - quantity;
            }
            case ADJUSTMENT -> {
                if (request.getNewStock() == null) {
                    throw new BusinessException("Para ajuste debes indicar el stock resultante (newStock)");
                }
                next = request.getNewStock();
                quantity = Math.abs(next - previous);
            }
            default -> throw new BusinessException("Tipo de movimiento no soportado");
        }

        product.setStockQuantity(next);
        StockMovement movement = saveMovement(product, request.getType(), quantity, previous, next, request.getReason());
        alertService.syncForProduct(product);
        return StockMovementResponse.from(movement);
    }

    public void recordInitialStock(Product product) {
        saveMovement(
                product,
                MovementType.IN,
                product.getStockQuantity(),
                0,
                product.getStockQuantity(),
                "Stock inicial al crear producto");
    }

    public void recordAdjustment(Product product, int previous, int next, String reason) {
        saveMovement(product, MovementType.ADJUSTMENT, Math.abs(next - previous), previous, next, reason);
    }

    private StockMovement saveMovement(
            Product product,
            MovementType type,
            int quantity,
            int previous,
            int next,
            String reason) {
        StockMovement movement = new StockMovement();
        movement.setProduct(product);
        movement.setType(type);
        movement.setQuantity(quantity);
        movement.setPreviousStock(previous);
        movement.setNewStock(next);
        movement.setReason(reason == null || reason.isBlank() ? null : reason.trim());
        return movementRepository.save(movement);
    }
}
