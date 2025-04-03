package com.example.random_steam_game_recommender.controller;

import com.example.random_steam_game_recommender.model.Comment;
import com.example.random_steam_game_recommender.model.CommentDTO;
import com.example.random_steam_game_recommender.model.History;
import com.example.random_steam_game_recommender.model.User;
import com.example.random_steam_game_recommender.service.CommentService;
import com.example.random_steam_game_recommender.service.UserService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@EnableAutoConfiguration
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/v1")
public class CommentController {

    @Autowired
    @Qualifier("CommentService")
    private final CommentService commentService;

    @Autowired
    @Qualifier("UserService")
    private final UserService userService;

    public CommentController(@Qualifier("CommentService") CommentService commentService,
                             @Qualifier("UserService") UserService userService){
        this.commentService = commentService;
        this.userService = userService;
    }

    @GetMapping("/getcomments")
    public ResponseEntity<List<CommentDTO>> getAllComments() {
        List<CommentDTO> comments = commentService.getAllComments();
        return ResponseEntity.ok(comments);
    }

    @GetMapping("getcommentsbysteamappid/{steamAppId}")
    public ResponseEntity<List<CommentDTO>> getAllCommentsBySteamAppId(@PathVariable Long steamAppId) {
        List<CommentDTO> comments = commentService.getAllCommentsBySteamAppId(steamAppId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/getcomments/{id}")
    public List<Comment> getCommentsByUser(@PathVariable long id) {
        User userFromDB = userService.getUserById(id);
        return commentService.getAllCommentsByUser(userFromDB);
    }

    @GetMapping("/getcomment/{id}")
    public Comment getCommentById(@PathVariable long id){
        return commentService.getCommentById(id);
    }

    @PostMapping("/createcomment")
    public ResponseEntity<String> createComment(@RequestBody Comment comment){
        try {
            User userFromDB = userService.getUserById(comment.getUserId());
            comment.setUser(userFromDB);

            // Save Date
            LocalDateTime currentLocalDate = LocalDateTime.now();
            DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String formattedCurrentLocalDate = currentLocalDate.format(dateFormat);

            comment.setDate(formattedCurrentLocalDate);
            commentService.createComment(comment);
            return ResponseEntity.ok("Comment created: " + comment.toString());
        } catch (ConstraintViolationException e) {
            // Handle validation errors
            StringBuilder errors = new StringBuilder("Validation errors: ");
            for (ConstraintViolation<?> violation : e.getConstraintViolations()) {
                errors.append(violation.getMessage()).append("; ");
            }
            return ResponseEntity.badRequest().body(errors.toString());
        }
    }
    
}
