package com.pawject.service.tester;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pawject.domain.Tester;
import com.pawject.domain.TesterComment;
import com.pawject.domain.User;
import com.pawject.dto.tester.TesterCommentRequestDto;
import com.pawject.dto.tester.TesterCommentResponseDto;
import com.pawject.repository.TesterCommentRepository;
import com.pawject.repository.TesterRepository;
import com.pawject.repository.UserRepository;
import com.pawject.service.user.AuthUserJwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TesterCommentServiceImpl implements TesterCommentService {

    private final TesterCommentRepository testerCommentRepository;
    private final TesterRepository testerRepository;
    private final UserRepository userRepository;
    private final AuthUserJwtService authUserJwtService;

    // 목록 조회
    @Override
    @Transactional(readOnly = true)
    public List<TesterCommentResponseDto> selectComments(Long testerid) {

        if (testerid == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "testerid 누락");

        return testerCommentRepository
                .findByTester_TesteridAndDeletedFalseOrderByCreatedatAsc(testerid)
                .stream()
                .map(TesterCommentResponseDto::from)
                .toList();
    }

    //댓글 작성
    @Override
    public TesterCommentResponseDto insertComment(TesterCommentRequestDto dto, Authentication authentication) {

        if (dto == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청값 없음");
        if (dto.getTesterid() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "testerid 누락");
        if (dto.getContent() == null || dto.getContent().trim().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "댓글 내용 누락");

        Long loginUserid = authUserJwtService.getCurrentUserId(authentication);
        if (loginUserid == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 정보 없음");

        Tester tester = testerRepository.findById(dto.getTesterid())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "글 없음"));

        User user = userRepository.findById(loginUserid)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "유저 정보 없음"));

        TesterComment comment = new TesterComment();
        comment.setTester(tester);
        comment.setUser(user);
        comment.setContent(dto.getContent().trim());
        comment.setDeleted(false);

        TesterComment saved = testerCommentRepository.save(comment);

        return TesterCommentResponseDto.from(saved);
    }

    // 댓글 수정 (본인만)
    @Override
    public TesterCommentResponseDto updateComment(Long testercommentid, TesterCommentRequestDto dto, Authentication authentication) {

        if (testercommentid == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "testercommentid 누락");
        if (dto == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청값 없음");
        if (dto.getContent() == null || dto.getContent().trim().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "댓글 내용 누락");

        Long loginUserid = authUserJwtService.getCurrentUserId(authentication);
        if (loginUserid == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 정보 없음");

        TesterComment comment = testerCommentRepository.findById(testercommentid)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "댓글 없음"));

        if (comment.isDeleted())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "댓글 없음");

        if (comment.getUser() == null || comment.getUser().getUserId() == null ||
                !comment.getUser().getUserId().equals(loginUserid)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인 댓글만 수정할 수 있습니다.");
        }

        comment.setContent(dto.getContent().trim());
     

        return TesterCommentResponseDto.from(comment);
    }

    // 댓글 삭제 (본인만 / soft delete)
    @Override
    public int deleteComment(Long testercommentid, Authentication authentication) {

        if (testercommentid == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "testercommentid 누락");

        Long loginUserid = authUserJwtService.getCurrentUserId(authentication);
        if (loginUserid == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 정보 없음");

        TesterComment comment = testerCommentRepository.findById(testercommentid)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "댓글 없음"));

        if (comment.isDeleted())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "댓글 없음");

        if (comment.getUser() == null || comment.getUser().getUserId() == null ||
                !comment.getUser().getUserId().equals(loginUserid)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인 댓글만 삭제할 수 있습니다.");
        }

        comment.setDeleted(true);
        return 1;
    }
}