package com.example.random_steam_game_recommender.config;

import com.example.random_steam_game_recommender.repository.CommentRepository;
import com.example.random_steam_game_recommender.repository.HistoryRepository;
import com.example.random_steam_game_recommender.repository.UserRepository;
import com.example.random_steam_game_recommender.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplateSteamApp(RestTemplateBuilder builder) {
        return builder.build();
    }

    private final UserRepository userRepository;
    private final HistoryRepository historyRepository;
    private final CommentRepository commentRepository;

    @Autowired
    public AppConfig(UserRepository userRepository, HistoryRepository historyRepository, CommentRepository commentRepository) {
        this.userRepository = userRepository;
        this.historyRepository = historyRepository;
        this.commentRepository = commentRepository;
    }

    @Bean
    @Qualifier("UserService")
    public UserService userService(){
        return new UserServiceImpl(userRepository);
    }

    @Bean
    @Qualifier("HistoryService")
    public HistoryService historyService(){
        return new HistoryServiceImpl(historyRepository);
    }

    @Bean
    @Qualifier("CommentService")
    public CommentService commentService(){
        return new CommentServiceImpl(commentRepository);
    }

}