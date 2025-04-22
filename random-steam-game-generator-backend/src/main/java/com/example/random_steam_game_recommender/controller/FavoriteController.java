package com.example.random_steam_game_recommender.controller;

import com.example.random_steam_game_recommender.model.*;
import com.example.random_steam_game_recommender.service.FavoriteService;
import com.example.random_steam_game_recommender.service.UserService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@EnableAutoConfiguration
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/v1")
public class FavoriteController {
    @Autowired
    @Qualifier("FavoriteService")
    private final FavoriteService favoriteService;

    @Autowired
    @Qualifier("UserService")
    private final UserService userService;

    public FavoriteController(@Qualifier("FavoriteService") FavoriteService favoriteService,
                             @Qualifier("UserService") UserService userService){
        this.favoriteService = favoriteService;
        this.userService = userService;
    }

    @GetMapping("/getfavorites")
    public ResponseEntity<List<FavoriteDTO>> getAllFavorites() {
        List<FavoriteDTO> favorites = favoriteService.getAllFavorites();
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("getfavoritesbysteamappid/{steamAppId}")
    public ResponseEntity<List<FavoriteDTO>> getAllFavoritesBySteamAppId(@PathVariable Long steamAppId) {
        List<FavoriteDTO> favorites = favoriteService.getAllFavoritesBySteamAppId(steamAppId);
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/getfavorites/{id}")
    public List<Favorite> getFavoritesByUser(@PathVariable long id) {
        User userFromDB = userService.getUserById(id);
        return favoriteService.getAllFavoritesByUser(userFromDB);
    }

    @GetMapping("/getfavorite/{id}")
    public Favorite getFavoriteById(@PathVariable long id){
        return favoriteService.getFavoriteById(id);
    }

    @PostMapping("/createfavorite")
    public ResponseEntity<String> createFavorite(@RequestBody Favorite favorite){
        try {
            User userFromDB = userService.getUserById(favorite.getUserId());
            favorite.setUser(userFromDB);
            favoriteService.createFavorite(favorite);
            return ResponseEntity.ok("Favorite created: " + favorite.toString());
        } catch (ConstraintViolationException e) {
            // Handle validation errors
            StringBuilder errors = new StringBuilder("Validation errors: ");
            for (ConstraintViolation<?> violation : e.getConstraintViolations()) {
                errors.append(violation.getMessage()).append("; ");
            }
            return ResponseEntity.badRequest().body(errors.toString());
        }
    }

    @DeleteMapping("/deletefavorite/{id}")
    public ResponseEntity<String> deleteFavorite(@PathVariable Long id){
        Favorite favorite = favoriteService.getFavoriteById(id);

        favoriteService.deleteFavorite(favorite.getId());

        return ResponseEntity.ok("Favorite has been deleted successfully");
    }
}
