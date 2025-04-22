package com.example.random_steam_game_recommender.controller;

import com.example.random_steam_game_recommender.model.*;
import com.example.random_steam_game_recommender.service.RatingService;
import com.example.random_steam_game_recommender.service.UserService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@EnableAutoConfiguration
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/v1")
public class RatingController {
    @Autowired
    @Qualifier("RatingService")
    private final RatingService ratingService;

    @Autowired
    @Qualifier("UserService")
    private final UserService userService;

    public RatingController(@Qualifier("RatingService") RatingService ratingService,
                              @Qualifier("UserService") UserService userService){
        this.ratingService = ratingService;
        this.userService = userService;
    }

    @GetMapping("/getratings")
    public ResponseEntity<List<RatingDTO>> getAllRatings() {
        List<RatingDTO> ratings = ratingService.getAllRatings();
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("getratingsbysteamappid/{steamAppId}")
    public ResponseEntity<List<RatingDTO>> getAllRatingsBySteamAppId(@PathVariable Long steamAppId) {
        List<RatingDTO> ratings = ratingService.getAllRatingsBySteamAppId(steamAppId);
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/getratings/{id}")
    public List<Rating> getRatingsByUser(@PathVariable long id) {
        User userFromDB = userService.getUserById(id);
        return ratingService.getAllRatingsByUser(userFromDB);
    }

    @GetMapping("/getrating/{id}")
    public Rating getRatingById(@PathVariable long id){
        return ratingService.getRatingById(id);
    }

    @PostMapping("/createrating")
    public ResponseEntity<String> createRating(@RequestBody Rating rating){
        try {
            User userFromDB = userService.getUserById(rating.getUserId());
            rating.setUser(userFromDB);
            ratingService.createRating(rating);
            return ResponseEntity.ok("Rating created: " + rating.toString());
        } catch (ConstraintViolationException e) {
            // Handle validation errors
            StringBuilder errors = new StringBuilder("Validation errors: ");
            for (ConstraintViolation<?> violation : e.getConstraintViolations()) {
                errors.append(violation.getMessage()).append("; ");
            }
            return ResponseEntity.badRequest().body(errors.toString());
        }
    }

    @PostMapping("/updaterating/{id}")
    public ResponseEntity<String> updateRating(@PathVariable Long id, @RequestBody Rating updatedRating){
        Rating rating = ratingService.getRatingById(id);

        if (rating == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rating not found");
        }

        rating.setRatingValue(updatedRating.getRatingValue());
        rating.setSteamAppId(updatedRating.getSteamAppId());

        ratingService.updateRating(rating);

        return ResponseEntity.ok("Rating updated successfully");
    }

    @DeleteMapping("/deleterating/{id}")
    public ResponseEntity<String> deleteRating(@PathVariable Long id){
        Rating rating = ratingService.getRatingById(id);

        ratingService.deleteRating(rating.getId());

        return ResponseEntity.ok("Rating has been deleted successfully");
    }
}
