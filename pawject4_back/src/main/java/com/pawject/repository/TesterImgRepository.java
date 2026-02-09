package com.pawject.repository;

import com.pawject.domain.Testerimg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface TesterImgRepository extends JpaRepository<Testerimg, Long> {

	@Modifying
	@Transactional
	@Query("DELETE FROM Testerimg t WHERE t.tester.testerid = :testerId")
	void deleteByTesterId(@Param("testerId") Long testerId);
}