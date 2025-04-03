package com.example.random_steam_game_recommender.repository;

import com.example.random_steam_game_recommender.model.History;
import com.example.random_steam_game_recommender.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoryRepository extends JpaRepository<History, Long> {
    List<History> findByUser(User user);
}
