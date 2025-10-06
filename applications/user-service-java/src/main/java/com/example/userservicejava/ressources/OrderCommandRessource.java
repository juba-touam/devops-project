package com.example.userservicejava.ressources;

import com.example.userservicejava.services.impl.OrderPublisher;
import com.example.userservicejava.models.dto.OrderCommand;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/v1/api/orders")
@RequiredArgsConstructor
@Validated
public class OrderCommandRessource {

    private final OrderPublisher publisher;

    @PostMapping("/publish")
    public ResponseEntity<String> publishOrder(@RequestBody @Validated CreateOrderPayload p) {
        OrderCommand cmd = OrderCommand.builder()
                .orderId(System.currentTimeMillis())
                .productName(p.productName)
                .price(p.price)
                .quantity(p.quantity)
                .userId(p.userId)
                .build();
        publisher.publish(cmd);
        return ResponseEntity.accepted().body("Order published: " + cmd.getOrderId());
    }

    @Data
    public static class CreateOrderPayload {
        @NotBlank String productName;
        @Min(0) double price;
        @Min(1) int quantity;
        Long userId;
    }
}
