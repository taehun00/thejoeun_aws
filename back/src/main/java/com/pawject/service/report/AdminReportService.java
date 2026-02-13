package com.pawject.service.report;

import com.pawject.dao.review.ReviewDao;
import com.pawject.domain.*;
import com.pawject.dto.report.AdminReportResponseDto;
import com.pawject.dto.review.ReviewDto;
import com.pawject.repository.LikeRepository;
import com.pawject.repository.ReportActionRepository;
import com.pawject.repository.ReportRepository;
import com.pawject.repository.TesterCommentsRepository;
import com.pawject.repository.TesterImgRepository;
import com.pawject.repository.TesterRepository;
import com.pawject.service.review.ReviewService;

import org.springframework.transaction.annotation.Transactional; 
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminReportService {

    private final ReportRepository reportRepository;
    private final ReportActionRepository reportActionRepository;
    private final ReviewDao reviewDao;
    private final TesterRepository testerRepository;
    private final ReviewService rservice;
    private final TesterImgRepository testerImgRepository;
    private final TesterCommentsRepository testerCommentsRepository;
    private final LikeRepository likeRepository;

    /** 전체 조회 */
    @Transactional(readOnly = true)
    public List<AdminReportResponseDto> getAllReports(int page, int size) {

        int start = page * size;
        int end = start + size;

        return reportRepository.findAllPaging(start, end)
                .stream()
                .map(AdminReportResponseDto::from)
                .toList();
    }


    /** 타입별 조회 */
    @Transactional(readOnly = true)
    public List<AdminReportResponseDto> getReportsByType(
            ReportTargetType type,
            int page,
            int size
    ) {
        int start = page * size;
        int end = start + size;

        return reportRepository.findByTargetTypePaging(
                        type.name(),   // 🔥 enum → String
                        start,
                        end
                )
                .stream()
                .map(AdminReportResponseDto::from)
                .toList();
    }


    /** 신고 처리 */
    @Transactional
    public void handleReport(
            Long reportId,
            Long adminId,
            ReportStatus status,
            ReportActionType action,
            String note
    ) {
        // 1️⃣ 신고 조회
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("신고 없음"));

        // 2️⃣ 신고 상태 변경
        report.changeStatus(status);

        // 3️⃣ 처리 이력 조회 (없으면 생성)
        ReportAction reportAction = reportActionRepository
                .findByReport_ReportId(reportId)
                .orElseGet(() ->
                    ReportAction.builder()
                        .report(report)
                        .status(status)
                        .build()
                );

        // 4️⃣ 처리 이력 업데이트
        reportAction.update(status, action, adminId, note);

        reportActionRepository.save(reportAction);

        // 5️⃣ 실제 대상 삭제 (마지막!)
        if (action == ReportActionType.DELETE) {
            deleteTarget(report);
        }
    }

    private void deleteTarget(Report report) {

        if (report.getTargetType() == ReportTargetType.REVIEW) {
            forceDeleteReview(report.getTargetId());
        }

        else if (report.getTargetType() == ReportTargetType.TESTER) {
        	forceDeleteTester(report.getTargetId());
        }
    }

    
    @Transactional(readOnly = true)
    public AdminReportResponseDto getReportDetail(Long reportId) {
        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new IllegalArgumentException("신고 없음"));

        return AdminReportResponseDto.from(report);
    }
    
    @Transactional
    private void forceDeleteReview(Long reviewId) {

        // 1️⃣ REVIEWIMG 먼저 삭제 (FK 끊기)
        rservice.reviewimgdeleteById(reviewId.intValue());

        // 2️⃣ REVIEW 관리자 강제 삭제
        rservice.reviewDeleteByAdmin(reviewId.intValue());
    }
    
    @Transactional
    private void forceDeleteTester(Long testerId) {
        // 1️⃣ 자식 테이블 삭제 (FK 끊기)
        testerImgRepository.deleteByTesterId(testerId);       // TESTERIMG
        testerCommentsRepository.deleteByTesterId(testerId);  // TESTERCOMMENTS
        likeRepository.deleteByTesterId(testerId);           // LIKES

        // 2️⃣ 부모 테이블 삭제
        testerRepository.deleteById(testerId);               // TESTER
    }
}
