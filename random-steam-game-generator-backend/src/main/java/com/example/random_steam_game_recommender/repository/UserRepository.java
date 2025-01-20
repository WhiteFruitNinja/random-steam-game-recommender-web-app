package com.example.random_steam_game_recommender.repository;

import com.example.random_steam_game_recommender.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
