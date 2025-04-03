package com.example.random_steam_game_recommender.service;

import com.example.random_steam_game_recommender.model.Comment;
import com.example.random_steam_game_recommender.model.CommentDTO;
import com.example.random_steam_game_recommender.model.User;
import com.example.random_steam_game_recommender.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {
    private CommentRepository commentRepository;

    @Autowired
    public CommentServiceImpl(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Override
    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }

    @Override
    public Comment getCommentById(Long id) {
        return commentRepository.findById(id).orElse(null); // Return null or throw an exception if not found
    }

    @Override
    public List<Comment> getAllCommentsByUser(User user) {
        return commentRepository.findByUser(user);
    }

    @Override
    public List<CommentDTO> getAllCommentsBySteamAppId(Long steamAppId) {
        List<Comment> comments = commentRepository.findBySteamAppId(steamAppId);
        return comments.stream()
                .map(CommentDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentDTO> getAllComments() {
        List<Comment> comments = commentRepository.findAll();
        return comments.stream()
                .map(CommentDTO::new) // Map each Comment to CommentDTO
                .collect(Collectors.toList());
    }

    @Override
    public Comment updateComment(Comment comment) {
        return commentRepository.save(comment);
    }

    @Override
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}
