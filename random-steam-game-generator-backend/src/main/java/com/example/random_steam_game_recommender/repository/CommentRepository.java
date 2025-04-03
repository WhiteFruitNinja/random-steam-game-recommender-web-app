package com.example.random_steam_game_recommender.repository;

import com.example.random_steam_game_recommender.model.Comment;
import com.example.random_steam_game_recommender.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByUser(User user);
    List<Comment> findBySteamAppId(@Param("steam_app_id") Long steamAppId);

}
