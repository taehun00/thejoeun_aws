package com.pawject.controller;

import com.pawject.dto.report.ReportRequestDto;
import com.pawject.dto.report.ReportResponseDto;
import com.pawject.service.report.ReportService;
import com.pawject.service.user.AuthUserJwtService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final AuthUserJwtService authUserJwtService;

    @Operation(summary = "리뷰 게시글 신고 (JWT)")
    @PostMapping("/review")
    public ResponseEntity<ReportResponseDto> reportReview(
            Authentication authentication,
            @RequestParam("reviewId") Long reviewId,
            @RequestBody ReportRequestDto dto
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(
                reportService.reportReview(userId, reviewId, dto)
        );
    }


    @Operation(summary = "체험단 게시글 신고 (JWT)")
    @PostMapping("/tester")
    public ResponseEntity<ReportResponseDto> reportTester(
            Authentication authentication,
            @RequestParam("testerId") Long testerId,
            @RequestBody ReportRequestDto dto
    ) {
        Long userId = authUserJwtService.getCurrentUserId(authentication);
        return ResponseEntity.ok(
                reportService.reportTester(userId, testerId, dto)
        );
    }

}
