package com.example.random_steam_game_recommender.service;

import com.example.random_steam_game_recommender.model.*;
import com.example.random_steam_game_recommender.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingServiceImpl implements RatingService{
    private RatingRepository ratingRepository;

    @Autowired
    public RatingServiceImpl(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    @Override
    public Rating createRating(Rating rating) {
        return ratingRepository.save(rating);
    }

    @Override
    public Rating getRatingById(Long id) {
        return ratingRepository.findById(id).orElse(null); // Return null or throw an exception if not found
    }

    @Override
    public List<Rating> getAllRatingsByUser(User user) {
        return ratingRepository.findByUser(user);
    }

    @Override
    public List<RatingDTO> getAllRatingsBySteamAppId(Long steamAppId) {
        List<Rating> ratings = ratingRepository.findBySteamAppId(steamAppId);
        return ratings.stream()
                .map(RatingDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<RatingDTO> getAllRatings() {
        List<Rating> ratings = ratingRepository.findAll();
        return ratings.stream()
                .map(RatingDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public Rating updateRating(Rating rating) {
        return ratingRepository.save(rating);
    }

    @Override
    public void deleteRating(Long id) {
        ratingRepository.deleteById(id);
    }
}
