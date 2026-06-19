package com.chess.course.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String COURSE_QUEUE = "course.payment.queue";

    @Bean
    public Queue coursePaymentQueue() {
        // Tự khai báo queue nếu nó chưa tồn tại trong RabbitMQ
        return new Queue(COURSE_QUEUE, true);
    }

    @Bean
    public MessageConverter converter() {
        return new Jackson2JsonMessageConverter();
    }
}
