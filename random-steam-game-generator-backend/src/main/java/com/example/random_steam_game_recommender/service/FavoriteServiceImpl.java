package com.example.random_steam_game_recommender.service;

import com.example.random_steam_game_recommender.model.*;
import com.example.random_steam_game_recommender.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteServiceImpl implements FavoriteService{
    private FavoriteRepository favoriteRepository;

    @Autowired
    public FavoriteServiceImpl(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    @Override
    public Favorite createFavorite(Favorite favorite) {
        return favoriteRepository.save(favorite);
    }

    @Override
    public Favorite getFavoriteById(Long id) {
        return favoriteRepository.findById(id).orElse(null); // Return null or throw an exception if not found
    }

    @Override
    public List<Favorite> getAllFavoritesByUser(User user) {
        return favoriteRepository.findByUser(user);
    }

    @Override
    public List<FavoriteDTO> getAllFavoritesBySteamAppId(Long steamAppId) {
        List<Favorite> favorites = favoriteRepository.findBySteamAppId(steamAppId);
        return favorites.stream()
                .map(FavoriteDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<FavoriteDTO> getAllFavorites() {
        List<Favorite> favorites = favoriteRepository.findAll();
        return favorites.stream()
                .map(FavoriteDTO::new) // Map each Favorite to FavoriteDTO
                .collect(Collectors.toList());
    }

    @Override
    public Favorite updateFavorite(Favorite favorite) {
        return favoriteRepository.save(favorite);
    }

    @Override
    public void deleteFavorite(Long id) {
        favoriteRepository.deleteById(id);
    }
}

