package com.chess.payment.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "payment.exchange";
    public static final String COURSE_QUEUE = "course.payment.queue";
    public static final String NOTIFICATION_QUEUE = "notification.payment.queue";
    public static final String ROUTING_KEY = "payment.success";

    @Bean
    public TopicExchange paymentExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue coursePaymentQueue() {
        return new Queue(COURSE_QUEUE);
    }

    @Bean
    public Queue notificationPaymentQueue() {
        return new Queue(NOTIFICATION_QUEUE);
    }

    @Bean
    public Binding courseBinding(Queue coursePaymentQueue, TopicExchange paymentExchange) {
        return BindingBuilder.bind(coursePaymentQueue).to(paymentExchange).with(ROUTING_KEY);
    }

    @Bean
    public Binding notificationBinding(Queue notificationPaymentQueue, TopicExchange paymentExchange) {
        return BindingBuilder.bind(notificationPaymentQueue).to(paymentExchange).with(ROUTING_KEY);
    }

    @Bean
    public MessageConverter converter() {
        return new Jackson2JsonMessageConverter();
    }
}
