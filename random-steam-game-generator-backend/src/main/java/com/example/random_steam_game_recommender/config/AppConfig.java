package com.example.random_steam_game_recommender.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplateSteamApp(RestTemplateBuilder builder) {
        return builder.build();
    }

    @Bean
    public RestTemplate restTemplateSteamAppDetails(RestTemplateBuilder builder) {
        return builder.build();
    }

}