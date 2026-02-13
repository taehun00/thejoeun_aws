package com.pawject.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pawject.domain.Petdisease;

@Repository
public interface PetdiseaseReopsitory extends JpaRepository<Petdisease, Long> {

    // 전체 목록 페이징
    @Query(
        value = """
            SELECT
                DISNO, ADMINID, PETTYPEID, 
                DISNAME, DEFINITION, CAUSE, SYMPTOM, TREATMENT, TIP, 
                CREATEDAT, UPDATEDAT
            FROM (
                SELECT p.*, ROWNUM AS rnum
                FROM (
                    SELECT
                        DISNO,
                        ADMINID,
                        PETTYPEID,
                        DISNAME,
                        DEFINITION,
                        CAUSE,
                        SYMPTOM,
                        TREATMENT,
                        TIP,
                        CREATEDAT,
                        UPDATEDAT
                    FROM PETDISEASE
                    WHERE PETTYPEID = :pettypeid
                    ORDER BY
                        CASE WHEN :condition = 'disnameAsc' THEN DISNAME END ASC,
                        CASE WHEN :condition = 'disnameDesc' THEN DISNAME END DESC,
                        CASE WHEN :condition = 'old' THEN DISNO END ASC,
                        CASE WHEN :condition = 'new' THEN DISNO END DESC,
                        DISNO DESC
                ) p
                WHERE ROWNUM <= :end
            )
            WHERE rnum >= :start
            """,
        nativeQuery = true
    )
    List<Petdisease> findPetdiseaseWithPaging(
        @Param("pettypeid") Long pettypeid,
        @Param("condition") String condition,
        @Param("start") int start,
        @Param("end") int end
    );

    // 전체 목록 count
    @Query(
        value = """
            SELECT COUNT(*)
            FROM PETDISEASE
            WHERE PETTYPEID = :pettypeid
            """,
        nativeQuery = true
    )
    long countByPettypeid(@Param("pettypeid") Long pettypeid);

    // 검색 + 페이징
    @Query(
        value = """
            SELECT
                DISNO, ADMINID, PETTYPEID, 
                DISNAME, DEFINITION, CAUSE, SYMPTOM, TREATMENT, TIP, 
                CREATEDAT, UPDATEDAT
            FROM (
                SELECT p.*, ROWNUM AS rnum
                FROM (
                    SELECT
                        DISNO, ADMINID, PETTYPEID, 
                        DISNAME, DEFINITION, CAUSE, SYMPTOM, TREATMENT, TIP, 
                        CREATEDAT, UPDATEDAT
                    FROM PETDISEASE
                    WHERE PETTYPEID = :pettypeid
                      AND (
                        :keyword IS NULL
                        OR TRIM(:keyword) = ''
                        OR LOWER(DISNAME) LIKE LOWER('%' || :keyword || '%')
                      )
                    ORDER BY
                        CASE WHEN :condition = 'disnameAsc' THEN DISNAME END ASC,
                        CASE WHEN :condition = 'disnameDesc' THEN DISNAME END DESC,
                        CASE WHEN :condition = 'old' THEN DISNO END ASC,
                        CASE WHEN :condition = 'new' THEN DISNO END DESC,
                        DISNO DESC
                ) p
                WHERE ROWNUM <= :end
            )
            WHERE rnum >= :start
            """,
        nativeQuery = true
    )
    List<Petdisease> searchPetdiseaseWithPaging(
        @Param("pettypeid") Long pettypeid,
        @Param("keyword") String keyword,
        @Param("condition") String condition,
        @Param("start") int start,
        @Param("end") int end
    );

    // 검색 count
    @Query(
        value = """
            SELECT COUNT(*)
            FROM PETDISEASE
            WHERE PETTYPEID = :pettypeid
              AND (
                :keyword IS NULL
                OR TRIM(:keyword) = ''
                OR LOWER(DISNAME) LIKE LOWER('%' || :keyword || '%')
              )
            """,
        nativeQuery = true
    )
    long countSearch(
        @Param("pettypeid") Long pettypeid,
        @Param("keyword") String keyword
    );
}