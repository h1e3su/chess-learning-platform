package com.chess.notification.rabbitmq;

import com.chess.notification.entity.Notification;
import com.chess.notification.entity.NotificationType;
import com.chess.notification.repository.NotificationRepository;
import com.chess.payment.dto.PaymentSuccessEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class PaymentNotificationListener {

    private static final Logger log = LoggerFactory.getLogger(PaymentNotificationListener.class);
    private final NotificationRepository notificationRepository;

    @Autowired
    public PaymentNotificationListener(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @RabbitListener(queues = "notification.payment.queue")
    public void handlePaymentSuccess(PaymentSuccessEvent event) {
        log.info("Received PaymentSuccessEvent for User: {} and Transaction: {}", event.getUserId(), event.getTransactionId());
        
        try {
            Notification notification = new Notification();
            notification.setUserId(event.getUserId());
            notification.setType(NotificationType.PAYMENT);
            notification.setTitle("Thanh toán thành công");
            notification.setMessage("Giao dịch " + event.getTransactionId() + " trị giá " + event.getAmount() + " VND đã thành công. Khóa học " + event.getCourseId() + " đã được thêm vào tài khoản của bạn.");
            notification.setRead(false);
            
            notificationRepository.save(notification);
            log.info("Saved payment success notification for user {}", event.getUserId());
        } catch (Exception e) {
            log.error("Error creating notification: {}", e.getMessage());
        }
    }
}
