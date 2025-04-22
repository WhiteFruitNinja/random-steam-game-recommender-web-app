package com.example.random_steam_game_recommender.service;

import com.example.random_steam_game_recommender.model.Rating;
import com.example.random_steam_game_recommender.model.RatingDTO;
import com.example.random_steam_game_recommender.model.User;

import java.util.List;

public interface RatingService {
    Rating createRating(Rating rating);
    Rating getRatingById(Long id);
    List<Rating> getAllRatingsByUser(User user);
    List<RatingDTO> getAllRatingsBySteamAppId(Long steamAppId);
    List<RatingDTO> getAllRatings();
    Rating updateRating(Rating rating);
    void deleteRating(Long id);
}
