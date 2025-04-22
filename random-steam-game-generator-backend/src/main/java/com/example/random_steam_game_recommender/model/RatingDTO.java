package com.example.random_steam_game_recommender.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RatingDTO {
    private Long id;
    private Long steamAppId;
    private int ratingValue;
    private Long userId;

    // Constructor
    public RatingDTO(Rating rating) {
        this.id = rating.getId();
        this.steamAppId = rating.getSteamAppId();
        this.ratingValue = rating.getRatingValue();
        this.userId = rating.getUser() != null ? rating.getUser().getId() : null; // Safely handle null
    }
}
