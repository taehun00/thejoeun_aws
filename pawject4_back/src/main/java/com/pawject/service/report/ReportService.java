package com.pawject.service.report;

import com.pawject.domain.Report;
import com.pawject.domain.ReportTargetType;
import com.pawject.domain.User;
import com.pawject.dto.report.AdminReportResponseDto;
import com.pawject.dto.report.ReportRequestDto;
import com.pawject.dto.report.ReportResponseDto;
import com.pawject.repository.ReportRepository;
import com.pawject.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public ReportResponseDto reportReview(Long userId, Long reviewId, ReportRequestDto dto) {

        validateDuplicate(userId, ReportTargetType.REVIEW, reviewId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        Report report = Report.builder()
                .user(user)
                .targetType(ReportTargetType.REVIEW)
                .targetId(reviewId)
                .reason(dto.getReason())
                .details(dto.getDetails())
                .build();

        Report saved = reportRepository.save(report);

        return ReportResponseDto.builder()
                .reportId(saved.getReportId())
                .message("리뷰 신고 완료")
                .build();
    }

    public ReportResponseDto reportTester(Long userId, Long testerId, ReportRequestDto dto) {

        validateDuplicate(userId, ReportTargetType.TESTER, testerId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        Report report = Report.builder()
                .user(user)
                .targetType(ReportTargetType.TESTER)
                .targetId(testerId)
                .reason(dto.getReason())
                .details(dto.getDetails())
                .build();

        Report saved = reportRepository.save(report);

        return ReportResponseDto.builder()
                .reportId(saved.getReportId())
                .message("체험단 신고 완료")
                .build();
    }

    private void validateDuplicate(Long userId, ReportTargetType type, Long targetId) {
        Integer exists = reportRepository.existsReport(
                userId,
                type.name(),   // 🔥 Enum → String
                targetId
        );

        if (exists != null) {
            throw new IllegalStateException("이미 신고한 대상입니다");
        }
    }
    


    private AdminReportResponseDto toAdminDto(Report report) {
        return AdminReportResponseDto.builder()
                .reportId(report.getReportId())
                .reporterUserId(report.getUser().getUserId())
                .targetType(report.getTargetType())
                .targetId(report.getTargetId())
                .reason(report.getReason())
                .details(report.getDetails())
                .createdAt(report.getCreatedAt())
                .status("PENDING") // 초기값
                .build();
    }
}
