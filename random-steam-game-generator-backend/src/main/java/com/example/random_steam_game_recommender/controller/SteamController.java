package com.example.random_steam_game_recommender.controller;

import com.example.random_steam_game_recommender.service.SteamService;
import com.example.random_steam_game_recommender.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/steam")
public class SteamController {

    private final SteamService steamService;

    @Autowired
    public SteamController(SteamService steamService) {
        this.steamService = steamService;
    }

    @RequestMapping("/randomapp")
    @ResponseBody
    public String readCookieValue(@CookieValue(value = "cookieName",
            defaultValue = "defaultCookieValue") String cookieValue)
    {
        // Your logic here using the cookie value
        return "Cookie Value: " + cookieValue;
    }

    @GetMapping("/randomapp")
    public ResponseEntity<SteamService.GameResponse> getRandomApp() {
        System.out.println("Received request for a random app"); // Log request
        SteamService.App randomApp = steamService.getRandomApp();
        if (randomApp == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        int appId = randomApp.getAppid();
        System.out.println("Fetched Random App ID: " + appId); // Log app ID
        SteamService.GameResponse randomAppDetails = steamService.fetchAppDetailList(appId);
        return ResponseEntity.ok(randomAppDetails);
    }

    @GetMapping("/getapp/{appId}")
    public ResponseEntity<SteamService.GameResponse> getSpecificApp(@PathVariable int appId) {
        SteamService.GameResponse specificAppDetails = steamService.fetchAppDetailList(appId);
        return ResponseEntity.ok(specificAppDetails);
    }
}
