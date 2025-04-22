package com.example.random_steam_game_recommender.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteDTO {
    private Long id;
    private Long steamAppId;
    private Long userId;

    // Constructor
    public FavoriteDTO(Favorite favorite) {
        this.id = favorite.getId();
        this.steamAppId = favorite.getSteamAppId();
        this.userId = favorite.getUser() != null ? favorite.getUser().getId() : null; // Safely handle null
    }
}
