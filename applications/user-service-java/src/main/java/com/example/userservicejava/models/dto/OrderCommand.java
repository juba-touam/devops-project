package com.example.userservicejava.models.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderCommand {
    private Long orderId;
    private String productName;
    private double price;
    private int quantity;

    private Long userId;
}
