package com.example.random_steam_game_recommender.repository;

import com.example.random_steam_game_recommender.model.History;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoryRepository extends JpaRepository<History, Long> {
}
