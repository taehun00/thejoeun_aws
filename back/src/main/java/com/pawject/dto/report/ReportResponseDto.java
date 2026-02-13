package com.pawject.dto.report;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReportResponseDto {
    private Long reportId;
    private String message;
}
