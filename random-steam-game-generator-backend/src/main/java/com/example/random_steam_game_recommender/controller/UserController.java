package com.example.random_steam_game_recommender.controller;

import com.example.random_steam_game_recommender.model.User;
import com.example.random_steam_game_recommender.repository.UserRepository;
import com.example.random_steam_game_recommender.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@EnableAutoConfiguration
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    @Qualifier("UserService")
    private final UserService userService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserController(@Qualifier("UserService") UserService userService){
        this.userService = userService;
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
    public ResponseEntity<String> loginUser(@ModelAttribute("user") User user, HttpSession session, Model model, BindingResult result) {

        User userFromDB = userService.findByUsername(user.getUsername());

        if (userFromDB != null && bCryptPasswordEncoder.matches(user.getPassword(), userFromDB.getPassword())){
            session.setAttribute("username", userFromDB.getUsername());
            return ResponseEntity.ok("Logged in as " + user.getUsername());
        } else {
            System.out.println(user.toString());
            System.out.println(user.getPassword());
            System.out.println(userFromDB.toString());
            System.out.println(userFromDB.getPassword());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Something went wrong. Try again.");
        }

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
