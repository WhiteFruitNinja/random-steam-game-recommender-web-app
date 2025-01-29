package com.example.random_steam_game_recommender.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Random;

@Service
public class SteamService {
    private static final String BASE_URL = "http://api.steampowered.com/";
    private final RestTemplate restTemplate;
    private List<App> appList;
    private final Random random = new Random();

    public SteamService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        fetchAppList();
    }

    private void fetchAppList() {
        String url = BASE_URL + "ISteamApps/GetAppList/v2/";
        AppListResponse response = restTemplate.getForObject(url, AppListResponse.class);
        appList = response.getApplist().getApps();
    }

    public App getRandomApp() {
        if (appList == null || appList.isEmpty()) {
            throw new IllegalStateException("App list is empty or not initialized.");
        }
        int randomIndex = random.nextInt(appList.size());
        App randomApp = appList.get(randomIndex);
        return randomApp;
    }

    private static class AppListResponse {
        private Applist applist;

        public Applist getApplist() {
            return applist;
        }

        // Inner class for AppList
        private static class Applist {
            private List<App> apps;

            public List<App> getApps() {
                return apps;
            }
        }
    }

    public static class App {
        private int appid;
        private String name;

        public int getAppid() {
            return appid;
        }

        public String getName() {
            return name;
        }
    }
}


