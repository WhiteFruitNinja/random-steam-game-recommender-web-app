package com.example.random_steam_game_recommender.config;

import com.example.random_steam_game_recommender.repository.UserRepository;
import com.example.random_steam_game_recommender.service.UserService;
import com.example.random_steam_game_recommender.service.UserServiceImpl;
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

    @Autowired
    public AppConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    @Qualifier("UserService")
    public UserService userService(){
        return new UserServiceImpl(userRepository);
    }
}