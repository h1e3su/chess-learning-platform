package com.chess.notification.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String NOTIFICATION_QUEUE = "notification.payment.queue";

    @Bean
    public Queue notificationPaymentQueue() {
        // Tự khai báo queue nếu nó chưa tồn tại trong RabbitMQ
        return new Queue(NOTIFICATION_QUEUE, true);
    }

    @Bean
    public MessageConverter converter() {
        return new Jackson2JsonMessageConverter();
    }
}
