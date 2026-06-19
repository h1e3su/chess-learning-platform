package com.chess.game.controller;

import com.chess.game.dto.MoveRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller
public class GameWebSocketController {

    private static final Logger log = LoggerFactory.getLogger(GameWebSocketController.class);
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public GameWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Lắng nghe nước đi từ client: /app/game.move
     */
    @MessageMapping("/game.move")
    public void handleGameMove(@Payload MoveRequest move) {
        log.info("Received move from player {} in match {}: {} -> {}", 
            move.getPlayerId(), move.getMatchId(), move.getFromSquare(), move.getToSquare());
            
        // TODO: Kiểm tra tính hợp lệ của nước đi, gọi Stockfish, cập nhật Redis...

        // Tạm thời Echo phát sóng lại tin nhắn này cho những ai đang subscribe kênh của match này
        String destination = "/topic/match/" + move.getMatchId();
        messagingTemplate.convertAndSend(destination, move);
        
        log.info("Broadcasted move to {}", destination);
    }
}
