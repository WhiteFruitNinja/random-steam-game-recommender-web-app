package com.example.random_steam_game_recommender.controller;

import com.example.random_steam_game_recommender.model.History;
import com.example.random_steam_game_recommender.model.User;
import com.example.random_steam_game_recommender.service.HistoryService;
import com.example.random_steam_game_recommender.service.UserService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

    @Autowired
    @Qualifier("UserService")
    private final UserService userService;

    public HistoryController(@Qualifier("HistoryService") HistoryService historyService,
                             @Qualifier("UserService") UserService userService){
        this.historyService = historyService;
        this.userService = userService;
    }

    @GetMapping("/gethistories")
    public ResponseEntity<List<History>> getHistories() {
        List<History> histories = historyService.getAllHistories();
        return ResponseEntity.ok(histories);
    }

    @GetMapping("/gethistories/{id}")
    public List<History> getHistoriesByUser(@PathVariable long id) {
        User userFromDB = userService.getUserById(id);
        return historyService.getAllHistoriesByUser(userFromDB);
    }

    @GetMapping("/gethistory/{id}")
    public History getHistoryById(@PathVariable long id){
        return historyService.getHistoryById(id);
    }

    @PostMapping("/createhistory")
    public ResponseEntity<String> createHistory(@RequestBody History history){
        try {
            User userFromDB = userService.getUserById(history.getUserId());
            history.setUser(userFromDB);
            historyService.createHistory(history);
            return ResponseEntity.ok(userFromDB.getUsername() + "History created: " + history.toString());
        } catch (ConstraintViolationException e) {
            // Handle validation errors
            StringBuilder errors = new StringBuilder("Validation errors: ");
            for (ConstraintViolation<?> violation : e.getConstraintViolations()) {
                errors.append(violation.getMessage()).append("; ");
            }
            return ResponseEntity.badRequest().body(errors.toString());
        }
    }
}
