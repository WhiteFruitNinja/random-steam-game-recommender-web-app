package com.example.random_steam_game_recommender.service;

import com.example.random_steam_game_recommender.model.History;
import com.example.random_steam_game_recommender.repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistoryServiceImpl implements HistoryService{
    private HistoryRepository historyRepository;

    @Autowired
    public HistoryServiceImpl(HistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    @Override
    public History createHistory(History history) {
        return historyRepository.save(history);
    }

    @Override
    public History getHistoryById(Long id) {
        return historyRepository.findById(id).orElse(null); // Return null or throw an exception if not found
    }

    @Override
    public List<History> getAllHistories() {
        return historyRepository.findAll();
    }

    @Override
    public History updatehistory(History history) {
        return historyRepository.save(history);
    }

    @Override
    public void deleteHistory(Long id) {
        historyRepository.deleteById(id);
    }
}
