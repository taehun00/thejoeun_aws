package com.pawject.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pawject.dto.tester.TesterCommentRequestDto;
import com.pawject.dto.tester.TesterCommentResponseDto;
import com.pawject.service.tester.TesterCommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tester/comments")
public class TesterCommentController {

    private final TesterCommentService testerCommentService;

    @GetMapping("/{testerid}")
    public ResponseEntity<List<TesterCommentResponseDto>> selectComments(@PathVariable("testerid") Long testerid) {
        return ResponseEntity.ok(testerCommentService.selectComments(testerid));
    }

    @PostMapping
    public ResponseEntity<TesterCommentResponseDto> insertComment(
            @RequestBody TesterCommentRequestDto dto,
            Authentication authentication
    ) {
        return ResponseEntity.ok(testerCommentService.insertComment(dto, authentication));
    }

    @PatchMapping("/{testercommentid}")
    public ResponseEntity<TesterCommentResponseDto> updateComment(
            @PathVariable("testercommentid") Long testercommentid,
            @RequestBody TesterCommentRequestDto dto,
            Authentication authentication
    ) {
        return ResponseEntity.ok(testerCommentService.updateComment(testercommentid, dto, authentication));
    }

    @DeleteMapping("/{testercommentid}")
    public ResponseEntity<Integer> deleteComment(
            @PathVariable("testercommentid") Long testercommentid,
            Authentication authentication
    ) {
        return ResponseEntity.ok(testerCommentService.deleteComment(testercommentid, authentication));
    }
}