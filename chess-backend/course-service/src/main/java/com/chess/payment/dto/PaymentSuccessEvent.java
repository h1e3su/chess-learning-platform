package com.chess.payment.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class PaymentSuccessEvent {
    private UUID userId;
    private UUID courseId;
    private BigDecimal amount;
    private String transactionId;

    public PaymentSuccessEvent() {}

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public UUID getCourseId() { return courseId; }
    public void setCourseId(UUID courseId) { this.courseId = courseId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
}
