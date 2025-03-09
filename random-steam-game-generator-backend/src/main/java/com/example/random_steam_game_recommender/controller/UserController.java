package com.example.random_steam_game_recommender.controller;

import com.example.random_steam_game_recommender.model.History;
import com.example.random_steam_game_recommender.model.User;
import com.example.random_steam_game_recommender.service.HistoryService;
import com.example.random_steam_game_recommender.service.UserService;
import com.example.random_steam_game_recommender.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@EnableAutoConfiguration
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    @Qualifier("UserService")
    private final UserService userService;

    @Autowired
    @Qualifier("HistoryService")
    private final HistoryService historyService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserController(@Qualifier("UserService") UserService userService,
                          @Qualifier("HistoryService") HistoryService historyService){
        this.userService = userService;
        this.historyService = historyService;
    }

    @GetMapping("/getlist")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/get/{id}")
    public User findUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user, HttpSession session, HttpServletResponse response) {
        User userFromDB = userService.findByUsername(user.getUsername());

        if (userFromDB != null && bCryptPasswordEncoder.matches(user.getPassword(), userFromDB.getPassword())) {
            session.setAttribute("username", userFromDB.getUsername());

            System.out.println(userFromDB);

            String token = jwtUtil.generateToken(userFromDB.getUsername()); // Generate JWT
            return ResponseEntity.ok(Map.of("token", token));
        } else if (!bCryptPasswordEncoder.matches(user.getPassword(), userFromDB.getPassword())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Incorrect password");
        } else {
            System.out.println("Attempted to log in with username: " + user.getUsername());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Incorrect username");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> createUser(@RequestBody User user,
                                             History history) {
        try {
            userService.registerUser(user);
            history.setUser(user);
            historyService.createHistory(history);
            return ResponseEntity.ok("User created: " + user.toString());
        } catch (ConstraintViolationException e) {
            // Handle validation errors
            StringBuilder errors = new StringBuilder("Validation errors: ");
            for (ConstraintViolation<?> violation : e.getConstraintViolations()) {
                errors.append(violation.getMessage()).append("; ");
            }
            return ResponseEntity.badRequest().body(errors.toString());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("userId", null);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok("Logout successful");
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
