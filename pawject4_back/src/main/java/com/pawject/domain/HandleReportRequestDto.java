package com.pawject.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HandleReportRequestDto {
    private ReportStatus status;          // PENDING, RESOLVED, REJECTED
    private ReportActionType action;      // DELETE, IGNORE
    private String note;                  // optional
}