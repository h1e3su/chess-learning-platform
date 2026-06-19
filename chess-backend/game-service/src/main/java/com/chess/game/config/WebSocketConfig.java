package com.chess.game.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 1. Điểm kết nối (Handshake Endpoint)
        // Client (React) sẽ gọi tới ws://localhost:8080/ws/game để mở luồng
        registry.addEndpoint("/ws/game")
                .setAllowedOriginPatterns("*") // Mở CORS cho React (Vite port 5173) gọi vào
                .withSockJS(); // Cung cấp fallback an toàn nếu trình duyệt không hỗ trợ WebSocket thuần
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 2. Kênh phát sóng (Broker) - Server gửi về Client
        // Bất kỳ luồng tin nhắn nào bắt đầu bằng /topic (ví dụ: /topic/match/123) 
        // sẽ được đẩy thẳng về cho tất cả những ai đang subscribe kênh đó.
        registry.enableSimpleBroker("/topic", "/queue");

        // 3. Kênh tiếp nhận (Application Destination) - Client gửi lên Server
        // Khi người chơi di chuyển quân cờ, họ sẽ gửi message tới đích bắt đầu bằng /app (ví dụ: /app/game.move)
        registry.setApplicationDestinationPrefixes("/app");
    }
}
