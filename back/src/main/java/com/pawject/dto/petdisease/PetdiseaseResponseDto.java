package com.pawject.dto.petdisease;

import com.pawject.domain.Petdisease;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PetdiseaseResponseDto {

	private Long disno;
	private Long adminid;
	private Long pettypeid;
	private String disname;
	private String definition;
	private String cause;
	private String symptom;
	private String treatment;
	private String tip;	
	private String createdat;
	private String updatedat;
	
	public static PetdiseaseResponseDto from(Petdisease p){
	    return PetdiseaseResponseDto.builder()
	            .disno(p.getDisno() == null ? null : p.getDisno().longValue())
	            .adminid(p.getAdmin() == null ? null : p.getAdmin().getUserId())
	            .pettypeid(p.getPettype() == null ? null : p.getPettype().getPetTypeId())
	            .disname(p.getDisname())
	            .definition(p.getDefinition())
	            .cause(p.getCause())
	            .symptom(p.getSymptom())
	            .treatment(p.getTreatment())
	            .tip(p.getTip())
	            .createdat(p.getCreatedat() == null ? null : p.getCreatedat().toString())
	            .updatedat(p.getUpdatedat() == null ? null : p.getUpdatedat().toString())
	            .build();
	}
}


