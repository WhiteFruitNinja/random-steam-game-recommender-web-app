package com.example.random_steam_game_recommender.repository;

import com.example.random_steam_game_recommender.model.Favorite;
import com.example.random_steam_game_recommender.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);
    List<Favorite> findBySteamAppId(@Param("steam_app_id") Long steamAppId);

}
