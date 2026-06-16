package com.chess.payment.controller;

import com.chess.payment.entity.PaymentOrder;
import com.chess.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payment API", description = "API for handling orders and transactions")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @Operation(summary = "Get all payment orders", description = "Retrieves a list of all orders.")
    @GetMapping
    public ResponseEntity<List<PaymentOrder>> getAllOrders() {
        return ResponseEntity.ok(paymentService.getAllOrders());
    }

    @Operation(summary = "Get order by ID", description = "Retrieves a specific order by its UUID.")
    @GetMapping("/{id}")
    public ResponseEntity<PaymentOrder> getOrderById(@PathVariable UUID id) {
        return ResponseEntity.ok(paymentService.getOrderById(id));
    }

    @Operation(summary = "Create a new order", description = "Creates a new payment order.")
    @PostMapping
    public ResponseEntity<PaymentOrder> createOrder(@RequestBody PaymentOrder order) {
        PaymentOrder createdOrder = paymentService.createOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }
}
