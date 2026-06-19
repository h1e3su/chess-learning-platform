package com.chess.payment.service;

import com.chess.payment.entity.PaymentOrder;
import com.chess.payment.repository.PaymentOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import com.chess.payment.config.RabbitMQConfig;
import com.chess.payment.dto.PaymentSuccessEvent;
import com.chess.payment.entity.PaymentStatus;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@Service
public class PaymentService {

    private final PaymentOrderRepository paymentOrderRepository;
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public PaymentService(PaymentOrderRepository paymentOrderRepository, RabbitTemplate rabbitTemplate) {
        this.paymentOrderRepository = paymentOrderRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    public List<PaymentOrder> getAllOrders() {
        return paymentOrderRepository.findAll();
    }

    public PaymentOrder getOrderById(UUID id) {
        return paymentOrderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public PaymentOrder createOrder(PaymentOrder order) {
        return paymentOrderRepository.save(order);
    }

    public PaymentOrder processPaymentSuccess(UUID orderId, String momoTransId) {
        PaymentOrder order = getOrderById(orderId);
        if (order.getStatus() == PaymentStatus.SUCCESS) {
            return order; // Already processed
        }
        
        order.setStatus(PaymentStatus.SUCCESS);
        order.setMomoTransId(momoTransId);
        PaymentOrder savedOrder = paymentOrderRepository.save(order);

        // Publish Event
        PaymentSuccessEvent event = new PaymentSuccessEvent(
                savedOrder.getUserId(),
                savedOrder.getCourseId(),
                savedOrder.getAmount(),
                savedOrder.getMomoTransId()
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.ROUTING_KEY, event);

        return savedOrder;
    }
}
