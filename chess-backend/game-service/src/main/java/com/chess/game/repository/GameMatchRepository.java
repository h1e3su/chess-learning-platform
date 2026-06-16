package com.chess.game.repository;

import com.chess.game.entity.GameMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GameMatchRepository extends JpaRepository<GameMatch, UUID> {
}
