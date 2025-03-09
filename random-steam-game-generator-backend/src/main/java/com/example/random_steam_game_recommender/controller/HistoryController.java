package com.example.random_steam_game_recommender.controller;

import com.example.random_steam_game_recommender.model.History;
import com.example.random_steam_game_recommender.model.User;
import com.example.random_steam_game_recommender.service.HistoryService;
import com.example.random_steam_game_recommender.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@EnableAutoConfiguration
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/v1")
public class HistoryController {

    @Autowired
    @Qualifier("HistoryService")
    private final HistoryService historyService;

    public HistoryController(@Qualifier("HistoryService") HistoryService historyService){
        this.historyService = historyService;
    }

    @GetMapping("/gethistories")
    public List<History> getHistories() {
        return historyService.getAllHistories();
    }

    @GetMapping("/gethistory/{id}")
    public History getHistoryById(@PathVariable long id){
        return historyService.getHistoryById(id);
    }
}
