package com.pawject.service.tester;

import java.util.List;

import org.springframework.security.core.Authentication;

import com.pawject.dto.tester.TesterCommentRequestDto;
import com.pawject.dto.tester.TesterCommentResponseDto;

public interface TesterCommentService {

    List<TesterCommentResponseDto> selectComments(Long testerid);

    TesterCommentResponseDto insertComment(TesterCommentRequestDto dto, Authentication authentication);

    TesterCommentResponseDto updateComment(Long testercommentid, TesterCommentRequestDto dto, Authentication authentication);

    int deleteComment(Long testercommentid, Authentication authentication);
}