package com.chess.game.controller;

import com.chess.game.entity.GameMatch;
import com.chess.game.service.GameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/games")
@Tag(name = "Game Match API", description = "API for managing chess games and matchmaking")
public class GameMatchController {

    private final GameService gameService;

    @Autowired
    public GameMatchController(GameService gameService) {
        this.gameService = gameService;
    }

    @Operation(summary = "Get all game matches", description = "Retrieves a list of all game matches.")
    @GetMapping
    public ResponseEntity<List<GameMatch>> getAllMatches() {
        return ResponseEntity.ok(gameService.getAllMatches());
    }

    @Operation(summary = "Get game match by ID", description = "Retrieves a specific game match by its UUID.")
    @GetMapping("/{id}")
    public ResponseEntity<GameMatch> getMatchById(@PathVariable UUID id) {
        return ResponseEntity.ok(gameService.getMatchById(id));
    }

    @Operation(summary = "Create a new game match", description = "Creates a new game match.")
    @PostMapping
    public ResponseEntity<GameMatch> createMatch(@RequestBody GameMatch match) {
        GameMatch createdMatch = gameService.createMatch(match);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMatch);
    }
}
