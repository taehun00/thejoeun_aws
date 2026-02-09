package com.pawject.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "REPORTS")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "report_seq")
    @SequenceGenerator(
        name = "report_seq",
        sequenceName = "REPORT_SEQ",
        allocationSize = 1
    )
    @Column(name = "REPORTID")
    private Long reportId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USERID", nullable = false)
    private User user;   // 신고한 사용자

    @Enumerated(EnumType.STRING)
    @Column(name = "TARGETTYPE", nullable = false, length = 20)
    private ReportTargetType targetType;

    @Column(name = "TARGETID", nullable = false)
    private Long targetId;

    @Column(name = "REASON", nullable = false, length = 100)
    private String reason;

    @Column(name = "DETAILS", length = 500)
    private String details;

    @Column(name = "CREATEDAT")
    private LocalDateTime createdAt;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    private ReportStatus status;

    @PrePersist
    void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = ReportStatus.PENDING;
        }
    }
    
    public void changeStatus(ReportStatus status) {
        this.status = status;
    }
}
