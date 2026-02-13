package com.pawject.controller;

import com.pawject.domain.HandleReportRequestDto;
import com.pawject.domain.Report;
import com.pawject.domain.ReportActionType;
import com.pawject.domain.ReportStatus;
import com.pawject.domain.ReportTargetType;
import com.pawject.dto.report.AdminReportResponseDto;
import com.pawject.service.report.AdminReportService;
import com.pawject.service.user.AuthUserJwtService;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminReportController {

    private final AdminReportService adminReportService;
    private final AuthUserJwtService authUserJwtService;
    
    /** 1. 전체 신고 조회 */
    @GetMapping
    public List<AdminReportResponseDto> getAllReports(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
            return adminReportService.getAllReports(page, size);
    }

    /** 2. 리뷰 신고만 조회 */
    @GetMapping("/review")
    public List<AdminReportResponseDto> getReviewReports(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        return adminReportService.getReportsByType(
                ReportTargetType.REVIEW,
                page,
                size
        );
    }

    /** 3. 체험단 신고만 조회 */
    @GetMapping("/tester")
    public List<AdminReportResponseDto> getTesterReports(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        return adminReportService.getReportsByType(
                ReportTargetType.TESTER,
                page,
                size
        );
    }

    /** 4. 신고 처리 */
//    {
//    	  "status": "RESOLVED",
//    	  "action": "DELETE",
//    	  "note": "처리"
//    	}
	@PostMapping("/{reportId}/handle")
	public void handleReport(
	        Authentication authentication,
	        @Parameter(description = "신고 ID", required = true)
	        @PathVariable("reportId") Long reportId,
	        @RequestBody HandleReportRequestDto dto
	) {
	    Long adminId = authUserJwtService.getCurrentUserId(authentication);
	
	    adminReportService.handleReport(
	            reportId,
	            adminId,
	            dto.getStatus(),
	            dto.getAction(),
	            dto.getNote()
	    );
	}
	
	@GetMapping("/{reportId}")
	public AdminReportResponseDto getReportDetail(
			@Parameter(description = "신고 ID", required = true)
	        @PathVariable("reportId") Long reportId
	) {
	    return adminReportService.getReportDetail(reportId);
	}
}
