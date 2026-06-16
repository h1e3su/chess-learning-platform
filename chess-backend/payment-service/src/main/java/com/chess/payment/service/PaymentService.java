package com.chess.payment.service;

import com.chess.payment.entity.PaymentOrder;
import com.chess.payment.repository.PaymentOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentOrderRepository paymentOrderRepository;

    @Autowired
    public PaymentService(PaymentOrderRepository paymentOrderRepository) {
        this.paymentOrderRepository = paymentOrderRepository;
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
}
