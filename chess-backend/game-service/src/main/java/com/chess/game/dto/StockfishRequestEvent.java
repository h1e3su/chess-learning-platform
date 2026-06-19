package com.chess.game.dto;

public class StockfishRequestEvent {
    private String matchId;
    private String fen;
    private int skillLevel;
    private int moveTimeMs;

    public StockfishRequestEvent() {
    }

    public StockfishRequestEvent(String matchId, String fen, int skillLevel, int moveTimeMs) {
        this.matchId = matchId;
        this.fen = fen;
        this.skillLevel = skillLevel;
        this.moveTimeMs = moveTimeMs;
    }

    public String getMatchId() {
        return matchId;
    }

    public void setMatchId(String matchId) {
        this.matchId = matchId;
    }

    public String getFen() {
        return fen;
    }

    public void setFen(String fen) {
        this.fen = fen;
    }

    public int getSkillLevel() {
        return skillLevel;
    }

    public void setSkillLevel(int skillLevel) {
        this.skillLevel = skillLevel;
    }

    public int getMoveTimeMs() {
        return moveTimeMs;
    }

    public void setMoveTimeMs(int moveTimeMs) {
        this.moveTimeMs = moveTimeMs;
    }
}
