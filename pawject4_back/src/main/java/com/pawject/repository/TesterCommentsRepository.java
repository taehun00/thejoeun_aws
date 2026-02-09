package com.pawject.repository;

import com.pawject.domain.TesterComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface TesterCommentsRepository extends JpaRepository<TesterComment, Long> {

	@Modifying
	@Transactional
	@Query("DELETE FROM TesterComment c WHERE c.tester.testerid = :testerId")
	void deleteByTesterId(@Param("testerId") Long testerId);
}