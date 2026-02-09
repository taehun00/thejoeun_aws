package com.pawject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pawject.domain.Tester;
@Repository
public interface TesterRepository extends JpaRepository<Tester, Long> {


}

/**
 */
 