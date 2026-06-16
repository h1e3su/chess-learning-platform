package com.chess.game.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "game_matches")
public class GameMatch {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "white_player_id")
    private UUID whitePlayerId;

    @Column(name = "black_player_id")
    private UUID blackPlayerId;

    @Column(columnDefinition = "TEXT")
    private String pgn; // Portable Game Notation

    private String fen; // Forsyth-Edwards Notation (Current state)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameStatus status = GameStatus.WAITING;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    public GameMatch() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getWhitePlayerId() { return whitePlayerId; }
    public void setWhitePlayerId(UUID whitePlayerId) { this.whitePlayerId = whitePlayerId; }
    public UUID getBlackPlayerId() { return blackPlayerId; }
    public void setBlackPlayerId(UUID blackPlayerId) { this.blackPlayerId = blackPlayerId; }
    public String getPgn() { return pgn; }
    public void setPgn(String pgn) { this.pgn = pgn; }
    public String getFen() { return fen; }
    public void setFen(String fen) { this.fen = fen; }
    public GameStatus getStatus() { return status; }
    public void setStatus(GameStatus status) { this.status = status; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
}
