package com.chess.game.dto;

public class MoveRequest {
    private String matchId;
    private String playerId;
    private String fromSquare;
    private String toSquare;
    private String promotion;

    public MoveRequest() {}

    public MoveRequest(String matchId, String playerId, String fromSquare, String toSquare, String promotion) {
        this.matchId = matchId;
        this.playerId = playerId;
        this.fromSquare = fromSquare;
        this.toSquare = toSquare;
        this.promotion = promotion;
    }

    public String getMatchId() { return matchId; }
    public void setMatchId(String matchId) { this.matchId = matchId; }

    public String getPlayerId() { return playerId; }
    public void setPlayerId(String playerId) { this.playerId = playerId; }

    public String getFromSquare() { return fromSquare; }
    public void setFromSquare(String fromSquare) { this.fromSquare = fromSquare; }

    public String getToSquare() { return toSquare; }
    public void setToSquare(String toSquare) { this.toSquare = toSquare; }

    public String getPromotion() { return promotion; }
    public void setPromotion(String promotion) { this.promotion = promotion; }
}
