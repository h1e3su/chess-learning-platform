package com.chess.game.service;

import com.chess.game.config.RabbitMQConfig;
import com.chess.game.dto.StockfishRequestEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AiMatchmakingService {

    private static final Logger logger = LoggerFactory.getLogger(AiMatchmakingService.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void requestAiMove(String matchId, String currentFen) {
        StockfishRequestEvent request = new StockfishRequestEvent(matchId, currentFen, 15, 1000);

        logger.info("Sending RPC request to Stockfish for match: {}", matchId);

        // Gửi thông điệp và CHỜ kết quả trả về từ Worker
        Object response = rabbitTemplate.convertSendAndReceive(
                RabbitMQConfig.EXCHANGE_NAME, 
                RabbitMQConfig.ROUTING_KEY, 
                request
        );

        if (response != null) {
            String bestMove = response.toString(); // vd: "e7e5"
            logger.info("Stockfish calculated best move: {}", bestMove);
            // TODO: Gọi hàm broadcast qua WebSocket trả về cho Frontend
            // broadcastMoveToClient(matchId, bestMove);
        } else {
            logger.warn("No response received from Stockfish worker for match: {}", matchId);
        }
    }
}
