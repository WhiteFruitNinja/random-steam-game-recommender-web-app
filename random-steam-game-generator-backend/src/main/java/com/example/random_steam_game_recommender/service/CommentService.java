package com.example.random_steam_game_recommender.service;

import com.example.random_steam_game_recommender.model.Comment;
import com.example.random_steam_game_recommender.model.CommentDTO;
import com.example.random_steam_game_recommender.model.User;

import java.util.List;

public interface CommentService {
    Comment createComment(Comment comment);
    Comment getCommentById(Long id);
    List<Comment> getAllCommentsByUser(User user);
    List<CommentDTO> getAllCommentsBySteamAppId(Long steamAppId);
    List<CommentDTO> getAllComments();
    Comment updateComment(Comment comment);
    void deleteComment(Long id);
}
