package com.pawject.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pawject.domain.Report;
import com.pawject.domain.ReportTargetType;

public interface ReportRepository extends JpaRepository<Report, Long> {

    /**
     * 이미 신고했는지 여부 확인 (Oracle 대응)
     */
    @Query(
        value = """
            SELECT 1
            FROM REPORTS
            WHERE USERID = :userId
              AND TARGETTYPE = :targetType
              AND TARGETID = :targetId
              AND ROWNUM = 1
        """,
        nativeQuery = true
    )
    Integer existsReport(
            @Param("userId") Long userId,
            @Param("targetType") String targetType,
            @Param("targetId") Long targetId
    );
    
// 전체 신고 조회
    @Query(
    	    value = """
    	        SELECT *
    	        FROM (
    	            SELECT r.*, ROWNUM rn
    	            FROM (
    	                SELECT *
    	                FROM REPORTS
    	                ORDER BY CREATEDAT DESC
    	            ) r
    	            WHERE ROWNUM <= :end
    	        )
    	        WHERE rn > :start
    	    """,
    	    nativeQuery = true
    	)
    	List<Report> findAllPaging(
    	        @Param("start") int start,
    	        @Param("end") int end
    	);

    // 타겟 타입별 신고 조회 (REVIEW / TESTER)
    @Query(
    	    value = """
    	        SELECT *
    	        FROM (
    	            SELECT r.*, ROWNUM rn
    	            FROM (
    	                SELECT *
    	                FROM REPORTS
    	                WHERE TARGETTYPE = :targetType
    	                ORDER BY CREATEDAT DESC
    	            ) r
    	            WHERE ROWNUM <= :end
    	        )
    	        WHERE rn > :start
    	    """,
    	    nativeQuery = true
    	)
    	List<Report> findByTargetTypePaging(
    	        @Param("targetType") String targetType,
    	        @Param("start") int start,
    	        @Param("end") int end
    	);

}
