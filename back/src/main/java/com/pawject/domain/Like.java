package com.pawject.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "LIKES",
       uniqueConstraints = @UniqueConstraint(columnNames = {"USER_ID", "REVIEW_ID", "TESTER_ID"}))
@Getter
@Setter
@NoArgsConstructor
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "like_seq")
    @SequenceGenerator(name = "like_seq", sequenceName = "LIKE_SEQ", allocationSize = 1)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @Column(name = "REVIEW_ID")
    private Long reviewId; // 리뷰 게시글 ID, MyBatis 사용

    @ManyToOne
    @JoinColumn(name = "TESTER_ID")
    private Tester tester; // 체험단 게시글 JPA

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // 생성자
    public Like(User user, Long reviewId) {
        this.user = user;
        this.reviewId = reviewId;
    }

    public Like(User user, Tester tester) {
        this.user = user;
        this.tester = tester;
    }
}

