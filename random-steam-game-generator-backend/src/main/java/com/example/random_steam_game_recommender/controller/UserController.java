package com.example.random_steam_game_recommender.controller;

import com.example.random_steam_game_recommender.model.User;
import com.example.random_steam_game_recommender.repository.UserRepository;
import com.example.random_steam_game_recommender.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/api/users/{id}")
    public User findUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/api/users")
    public String createUser(@ModelAttribute User user){
        userService.createUser(user);
        userService.registerUser(user);
        return "User saved: " + user.toString();
    }

    @PostMapping("/api/users/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody User updatedUser){
        User user = userService.getUserById(id);

        if (user == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());

        userService.updateUser(user);

        return ResponseEntity.ok("User updated successfully");
    }

    @DeleteMapping("/api/users/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id){
        User user = userService.getUserById(id);

        if (user == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        userService.deleteUser(id);

        return ResponseEntity.ok("User has been deleted successfully");
    }
}
