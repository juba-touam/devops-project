package com.example.userservicejava.services.impl;

import com.example.userservicejava.models.dto.OrderCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderPublisher {

    private final KafkaTemplate<String, OrderCommand> kafkaTemplate;

    @Value("${app.kafka.topic.orders}")
    private String ordersTopic;

    public void publish(OrderCommand cmd) {
        String key = String.valueOf(cmd.getOrderId());
        kafkaTemplate.send(ordersTopic, key, cmd);
    }
}
