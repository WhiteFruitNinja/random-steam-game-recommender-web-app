package com.example.random_steam_game_recommender.controller;

import com.example.random_steam_game_recommender.service.SteamService;
import com.example.random_steam_game_recommender.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SteamController {

    private final SteamService steamService;

    public SteamController(SteamService steamService) {
        this.steamService = steamService;
    }

    @GetMapping("/api/steam/randomApp")
    public SteamService.App getRandomApp() {
        return steamService.getRandomApp();
    }
}
