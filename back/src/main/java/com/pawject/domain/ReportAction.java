package com.pawject.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "REPORT_ACTIONS")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ReportAction {

    @Id
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "report_action_seq_gen"
    )
    @SequenceGenerator(
        name = "report_action_seq_gen",
        sequenceName = "REPORT_ACTION_SEQ",
        allocationSize = 1
    )
    @Column(name = "ACTIONID")
    private Long actionId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "REPORTID", nullable = false)
    private Report report;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false)
    private ReportStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTION")
    private ReportActionType action;

    @Column(name = "ADMINID")
    private Long adminId;

    @Column(name = "NOTE", length = 200)
    private String note;

    @Column(name = "UPDATEDAT")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    public void update(
            ReportStatus status,
            ReportActionType action,
            Long adminId,
            String note
    ) {
        this.status = status;
        this.action = action;
        this.adminId = adminId;
        this.note = note;
    }
}
