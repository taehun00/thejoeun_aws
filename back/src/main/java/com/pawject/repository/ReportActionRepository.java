package com.pawject.repository;

import com.pawject.domain.ReportAction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReportActionRepository extends JpaRepository<ReportAction, Long> {

	/*
	✔ “신고 1건에 대해 관리자 처리 결과가 있는지?”
	✔ “이 신고는 PENDING / RESOLVED / REJECTED 중 뭐냐?” 
	 */
    Optional<ReportAction> findByReport_ReportId(Long reportId);
}
