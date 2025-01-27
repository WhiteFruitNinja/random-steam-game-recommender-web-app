package com.example.random_steam_game_recommender.service;

import com.example.random_steam_game_recommender.model.User;

import java.util.List;

public interface UserService {
    void registerUser(User user);
    User createUser(User user);
    User getUserById(Long id);
    List<User> getAllUsers();
    User updateUser(User user);
    void deleteUser(Long id);
}
