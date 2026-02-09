package com.pawject.dto.petdisease;

import com.pawject.dto.tester.TesterAdminRequestDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetdiseaseRequestDto {

	private Long pettypeid;
	private String disname;
	private String definition;
	private String cause;
	private String symptom;
	private String treatment;
	private String tip;	
	
}
