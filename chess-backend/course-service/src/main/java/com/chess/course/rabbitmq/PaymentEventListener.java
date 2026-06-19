package com.chess.course.rabbitmq;

import com.chess.course.entity.Enrollment;
import com.chess.course.entity.EnrollmentStatus;
import com.chess.course.repository.EnrollmentRepository;
import com.chess.payment.dto.PaymentSuccessEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class PaymentEventListener {

    private static final Logger log = LoggerFactory.getLogger(PaymentEventListener.class);
    private final EnrollmentRepository enrollmentRepository;

    @Autowired
    public PaymentEventListener(EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    @RabbitListener(queues = "course.payment.queue")
    public void handlePaymentSuccess(PaymentSuccessEvent event) {
        log.info("Received PaymentSuccessEvent for User: {} and Course: {}", event.getUserId(), event.getCourseId());
        
        try {
            Enrollment enrollment = new Enrollment();
            enrollment.setUserId(event.getUserId());
            enrollment.setCourseId(event.getCourseId());
            enrollment.setStatus(EnrollmentStatus.ACTIVE);
            
            enrollmentRepository.save(enrollment);
            log.info("Successfully enrolled user {} in course {}", event.getUserId(), event.getCourseId());
        } catch (Exception e) {
            log.error("Error creating enrollment: {}", e.getMessage());
            // Normally we would have dead-letter queue or retry mechanism
        }
    }
}
