package com.example.random_steam_game_recommender.controller;

import com.example.random_steam_game_recommender.model.User;
import com.example.random_steam_game_recommender.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MainController {

    @Autowired
    private UserService userService;

    @GetMapping("/api/user")
    public String getUserAPI(){
        List<User> userList = userService.getAllUsers();

        return userList.toString();
    }

    @PostMapping("/api/user")
    public String setUserAPI(@ModelAttribute User user){
        userService.createUser(user);
        return "User saved: " + user.toString();
    }
}
