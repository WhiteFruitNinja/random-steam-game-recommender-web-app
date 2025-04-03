package com.example.random_steam_game_recommender.service;

import com.example.random_steam_game_recommender.model.History;
import com.example.random_steam_game_recommender.model.User;

import java.util.List;

public interface HistoryService {
    History createHistory(History history);
    History getHistoryById(Long id);
    List<History> getAllHistoriesByUser(User user);
    List<History> getAllHistories();
    History updateHistory(History history);
    void deleteHistory(Long id);
}
