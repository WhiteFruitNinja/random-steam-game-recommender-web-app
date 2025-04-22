package com.example.random_steam_game_recommender.service;

import com.example.random_steam_game_recommender.model.Favorite;
import com.example.random_steam_game_recommender.model.FavoriteDTO;
import com.example.random_steam_game_recommender.model.User;

import java.util.List;

public interface FavoriteService {
    Favorite createFavorite(Favorite favorite);
    Favorite getFavoriteById(Long id);
    List<Favorite> getAllFavoritesByUser(User user);
    List<FavoriteDTO> getAllFavoritesBySteamAppId(Long steamAppId);
    List<FavoriteDTO> getAllFavorites();
    Favorite updateFavorite(Favorite favorite);
    void deleteFavorite(Long id);
}
