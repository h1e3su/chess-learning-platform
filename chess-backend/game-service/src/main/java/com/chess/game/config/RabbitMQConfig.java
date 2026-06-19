package com.chess.game.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "stockfish.exchange";
    public static final String QUEUE_NAME = "stockfish.jobs.queue";
    public static final String ROUTING_KEY = "stockfish.request";

    @Bean
    public DirectExchange stockfishExchange() {
        return new DirectExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue stockfishQueue() {
        return new Queue(QUEUE_NAME, true);
    }

    @Bean
    public Binding stockfishBinding(Queue stockfishQueue, DirectExchange stockfishExchange) {
        return BindingBuilder.bind(stockfishQueue).to(stockfishExchange).with(ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        // For RPC to work correctly, a reply timeout is recommended
        template.setReplyTimeout(60000); // 60 seconds
        return template;
    }
}
