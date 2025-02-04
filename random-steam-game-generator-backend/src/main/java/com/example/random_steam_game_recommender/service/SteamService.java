package com.example.random_steam_game_recommender.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class SteamService {
    private static final String BASE_URL = "http://api.steampowered.com/";
    private static final String BASE_DETAIL_URL = "https://store.steampowered.com/";
    private final RestTemplate restTemplateSteamApp;
    private final RestTemplate restTemplateSteamAppDetails;
    private List<App> appList;
    private GameResponse gameResponse;
    private final Random random = new Random();

    public SteamService(RestTemplate restTemplateSteamApp,
                        RestTemplate restTemplateSteamAppDetails) {
        this.restTemplateSteamApp = restTemplateSteamApp;
        this.restTemplateSteamAppDetails = restTemplateSteamAppDetails;
        fetchAppList();
    }

    private void fetchAppList() {
        String url = BASE_URL + "ISteamApps/GetAppList/v2/";
        AppListResponse appListResponse = restTemplateSteamApp.getForObject(url, AppListResponse.class);
        appList = appListResponse.getApplist().getApps();
    }

    public GameResponse fetchAppDetailList(int appId) {
        String url = BASE_DETAIL_URL + "api/appdetails?appids=" + appId;

        // Use exchange method to handle parameterized response
        ResponseEntity<Map<Integer, GameResponse>> responseEntity = restTemplateSteamApp.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<Integer, GameResponse>>() {}
        );

        // Check if we got a valid response
        Map<Integer, GameResponse> responseMap = responseEntity.getBody();
        if (responseMap != null && responseMap.containsKey(appId)) {
            return responseMap.get(appId);
        }

        return null; // Or handle as needed
    }

    public App getRandomApp() {
        if (appList == null || appList.isEmpty()) {
            return null;
        }
        int randomIndex = random.nextInt(appList.size());
        return appList.get(randomIndex);
    }


    @Getter
    private static class AppListResponse {
        private Applist applist;

        // Inner class for AppList
        @Getter
        private static class Applist {
            private List<App> apps;

        }
    }

    @Getter
    public static class App {
        private int appid;
        private String name;

    }

    @Getter
    public static class GameResponse {
        private boolean success;
        private GameData data;

        @Getter
        public static class GameData {
            private String type;
            private String name;
            private int steam_appid;
            private int required_age;
            private boolean is_free;
            private String detailed_description;
            private String about_the_game;
            private String short_description;
            private String supported_languages;
            private String header_image;
            private String capsule_image;
            private String capsule_imagev5;
            private String website;
            private JsonNode pc_requirements; // Change to JsonNode
            private JsonNode mac_requirements; // Change to JsonNode
            private JsonNode linux_requirements; // Change to JsonNode
            private List<String> developers;
            private List<String> publishers;
            private PriceOverview price_overview;
            private List<Integer> packages;
            private List<PackageGroup> package_groups;
            private Platforms platforms;
            private Metacritic metacritic;
            private List<Category> categories;
            private List<Genre> genres;
            private List<Screenshot> screenshots;
            private Recommendations recommendations;
            private ReleaseDate release_date;
            private SupportInfo support_info;
            private String background;
            private String background_raw;
            private ContentDescriptors content_descriptors;
            private Ratings ratings;
        }

        @Getter
        public static class Requirements {
            private List<String> minimum;
            private List<String> recommended;
        }

        @Getter
        public static class PriceOverview {
            private String currency;
            private int initial;
            private int finalPrice;
            private int discount_percent;
            private String initial_formatted;
            private String final_formatted;

            // You'll need to rename 'final' to another name like 'finalPrice'
            // to avoid conflict with Java's reserved keywords.
        }

        @Getter
        public static class PackageGroup {
            private String name;
            private String title;
            private String description;
            private String selection_text;
            private String save_text;
            private int display_type;
            private String is_recurring_subscription;
            private List<Subscription> subs;

            @Getter
            public static class Subscription {
                private int packageid;
                private String percent_savings_text;
                private int percent_savings;
                private String option_text;
                private String option_description;
                private String can_get_free_license;
                private boolean is_free_license;
                private int price_in_cents_with_discount;
            }
        }

        @Getter
        public static class Platforms {
            private boolean windows;
            private boolean mac;
            private boolean linux;
        }

        @Getter
        public static class Metacritic {
            private int score;
            private String url;
        }

        @Getter
        public static class Category {
            private int id;
            private String description;
        }

        @Getter
        public static class Genre {
            private String id;
            private String description;
        }

        @Getter
        public static class Screenshot {
            private int id;
            private String path_thumbnail;
            private String path_full;
        }

        @Getter
        public static class Recommendations {
            private int total;
        }

        @Getter
        public static class ReleaseDate {
            private boolean coming_soon;
            private String date;
        }

        @Getter
        public static class SupportInfo {
            private String url;
            private String email;
        }

        @Getter
        public static class ContentDescriptors {
            private List<Integer> ids;
            private String notes;
        }

        @Getter
        public static class Ratings {
            private RatingDetails usk;
            private RatingDetails dejus;
            private RatingDetails steam_germany;

            @Getter
            public static class RatingDetails {
                private String rating;
                private int rating_generated;
                private String required_age;
                private int banned;
                private int use_age_gate;
                private String descriptors;
            }
        }
    }
}


