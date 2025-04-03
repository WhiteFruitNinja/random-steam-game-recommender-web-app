package com.example.random_steam_game_recommender.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {
    private Long id;
    private Long steamAppId;
    private String message;
    private String date;
    private Long userId;

    // Constructor
    public CommentDTO(Comment comment) {
        this.id = comment.getId();
        this.steamAppId = comment.getSteamAppId();
        this.message = comment.getMessage();
        this.date = comment.getDate();
        this.userId = comment.getUser() != null ? comment.getUser().getId() : null; // Safely handle null
    }

}