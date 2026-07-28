package com.aurora.inventory.repository;

import com.aurora.inventory.domain.StockMovement;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByProductIdOrderByCreatedAtDesc(Long productId);
    List<StockMovement> findAllByOrderByCreatedAtDesc();
    List<StockMovement> findByCreatedAtBetweenOrderByCreatedAtDesc(Instant from, Instant to);
    long countByCreatedAtBetween(Instant from, Instant to);
    void deleteByProductId(Long productId);
}
