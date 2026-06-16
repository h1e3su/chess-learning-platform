package com.chess.game.service;

import com.chess.game.entity.GameMatch;
import com.chess.game.repository.GameMatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class GameService {

    private final GameMatchRepository gameMatchRepository;

    @Autowired
    public GameService(GameMatchRepository gameMatchRepository) {
        this.gameMatchRepository = gameMatchRepository;
    }

    public List<GameMatch> getAllMatches() {
        return gameMatchRepository.findAll();
    }

    public GameMatch getMatchById(UUID id) {
        return gameMatchRepository.findById(id).orElseThrow(() -> new RuntimeException("Match not found"));
    }

    public GameMatch createMatch(GameMatch match) {
        return gameMatchRepository.save(match);
    }
}
