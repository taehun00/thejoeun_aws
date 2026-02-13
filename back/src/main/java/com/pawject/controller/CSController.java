package com.pawject.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.pawject.dto.support.CSAnswerDto;
import com.pawject.dto.support.CSQuestionDto;
import com.pawject.service.support.CSService;
import com.pawject.service.user.AuthUserJwtService;
import com.pawject.util.UtilPaging;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "CS", description = "고객센터 CS")
@RestController
@RequestMapping("/api/csBoard")
@RequiredArgsConstructor
public class CSController {

    @Autowired private CSService service;
    @Autowired private AuthUserJwtService authUserJwtService;

    // 리스트 - 유저용
    @Operation(summary = "유저용 CS 조회")
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/cslistuser")
    public ResponseEntity<List<CSQuestionDto>> forUserList(Authentication authentication) {
        Long userid = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(service.selectCSQUser(makeDto(userid)));
    }

    // 리스트 - 관리자용
    @Operation(summary = "관리자용 CS 페이징 조회")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cspaged")
    @ResponseBody
    public Map<String, Object> cspaged(
            @RequestParam(name = "pstartno", defaultValue = "1") int pstartno,
            @RequestParam(name = "condition", required = false) String condition) {

        Map<String, Object> result = new HashMap<>();

        int total = service.selectTotalCntCSQ();
        List<CSQuestionDto> list = service.select10CSQ(condition, pstartno);

        UtilPaging paging = new UtilPaging(total, pstartno);

        result.put("paging", paging);
        result.put("total", total);
        result.put("list", list);

        return result;
    }

    // 관리자용 CS 페이징 + 검색
    @Operation(summary = "관리자용 CS 페이징 + 검색 조회")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cssearch")
    @ResponseBody
    public Map<String, Object> cssearch(
            @RequestParam("searchType") String searchType,
            @RequestParam(name = "pageNo", defaultValue = "1") int pageNo,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "condition", required = false) String condition) {

        Map<String, Object> result = new HashMap<>();

        int total = service.selectSearchTotalCntCSQ(keyword, searchType, condition);

        List<CSQuestionDto> list =
                service.selectSearchCSQ(keyword, searchType, condition, pageNo);

        UtilPaging paging = new UtilPaging(total, pageNo);

        result.put("total", total);
        result.put("list", list);
        result.put("paging", paging);
        result.put("search", keyword);

        return result;
    }

    // 글쓰기 - 카테고리
    @Operation(summary = "CS 카테고리")
    @GetMapping("/categories")
    public ResponseEntity<List<String>> categories() {
        return ResponseEntity.ok(
                List.of("계정", "서비스", "이벤트", "기타")
        );
    }

    // 1:1 질문 작성
    @Operation(summary = "1:1 질문 작성")
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<Void> write(Authentication authentication, @RequestBody CSQuestionDto dto) {

        Long userid = authUserJwtService.getCurrentUserId(authentication);
        dto.setUserid(userid.intValue());

        service.insertCSQ(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 단건 조회
    @Operation(summary = "1:1 질문 단건 조회")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cs/{questionid}")
    public ResponseEntity<CSQuestionDto> getCSQuestion(
            @PathVariable("questionid") int questionid) {

        return ResponseEntity.ok(service.selectCSQ(questionid));
    }

    // 답변 작성
    @Operation(summary = "1:1 답변 작성")
    @PostMapping("/cs/{questionid}/answer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> writeAnswer(
            @PathVariable("questionid") int questionid,
            @RequestBody CSAnswerDto dto
    ) {
        dto.setQuestionid(questionid);
        service.insertCSA(dto);

        CSQuestionDto qdto = new CSQuestionDto();
        qdto.setQuestionid(questionid);
        service.answerCSQ(qdto);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 답변완료 버튼
    @Operation(summary = "답변완료 버튼")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{questionid}/active")
    public ResponseEntity<Void> quickAnswer(
            @PathVariable("questionid") int questionid,
            @RequestBody CSQuestionDto dto
    ) {
        dto.setQuestionid(questionid);
        service.answerCSQ(dto);
        return ResponseEntity.ok().build();
    }

    // userid로 dto 만들어서 selectCSQUser에 그대로 반영
    private CSQuestionDto makeDto(Long userid) {
        CSQuestionDto dto = new CSQuestionDto();
        dto.setUserid(userid.intValue());
        return dto;
    }
}
