package com.example.random_steam_game_recommender.repository;

import com.example.random_steam_game_recommender.model.Rating;
import com.example.random_steam_game_recommender.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByUser(User user);
    List<Rating> findBySteamAppId(@Param("steam_app_id") Long steamAppId);
}
