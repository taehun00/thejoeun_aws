package com.pawject.dto.report;

import java.time.LocalDateTime;

import com.pawject.domain.Report;
import com.pawject.domain.ReportTargetType;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminReportResponseDto {
    private Long reportId;
    private Long reporterUserId;
    private ReportTargetType targetType;
    private Long targetId;
    private String reason;
    private String details;
    private LocalDateTime createdAt;
    private String status; // PENDING / RESOLVED / REJECTED
    
    public static AdminReportResponseDto from(Report report) {
        return AdminReportResponseDto.builder()
                .reportId(report.getReportId())
                .reporterUserId(report.getUser().getUserId())
                .targetType(report.getTargetType())
                .targetId(report.getTargetId())
                .reason(report.getReason())
                .details(report.getDetails())
                .createdAt(report.getCreatedAt())
                .status(
                        report.getStatus() != null 
                            ? report.getStatus().name() 
                            : null
                    ) 
                .build();
    }
}