package com.example.random_steam_game_recommender.controller;

import com.example.random_steam_game_recommender.model.User;
import com.example.random_steam_game_recommender.repository.UserRepository;
import com.example.random_steam_game_recommender.service.UserService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/v1")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Autowired
    private UserService userService;

    @GetMapping("/getlist")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/get/{id}")
    public User findUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/register")
    public ResponseEntity<String> createUser(@RequestBody User user) {
        try {
            userService.createUser(user);
            userService.registerUser(user);
            return ResponseEntity.ok("User saved: " + user.toString());
        } catch (ConstraintViolationException e) {
            // Handle validation errors
            StringBuilder errors = new StringBuilder("Validation errors: ");
            for (ConstraintViolation<?> violation : e.getConstraintViolations()) {
                errors.append(violation.getMessage()).append("; ");
            }
            return ResponseEntity.badRequest().body(errors.toString());
        }
    }

    @PostMapping("/update/{id}")
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

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
        User user = userService.getUserById(id);

        if (user == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        userService.deleteUser(id);

        return ResponseEntity.ok("User has been deleted successfully");
    }
}
