package com.pawject.dto.exec;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
//@Getter @Setter 
//@AllArgsConstructor
//@NoArgsConstructor

public class ExecSearchDto {
	private Integer execid;			//EXECID
	private String  exectype;		//EXECTYPE
	private String  description;	//DESCRIPTION
	private float   avgkcal30min;	//AVGKCAL30MIN
	private int    exectargetmin;	//EXECTARGETMIN
	private String  suitablefor; 	//SUITABLEFOR
	private String  intensitylevel;	//INTENSITYLEVEL
	private String  createdAt;		//CREATEDAT
	private String  updatedAt;		//UPDATEDAT
}
/*
Name                                      Null?    Type
----------------------------------------- -------- ----------------------------
EXECID                                    NOT NULL NUMBER(38)
EXECTYPE                                           VARCHAR2(50)
DESCRIPTION
AVGKCAL30MIN                                       FLOAT(126)
EXECTARGETMIN                                      NUMBER(38)
SUITABLEFOR                                        VARCHAR2(100)
INTENSITYLEVEL                                     VARCHAR2(100)
CREATEDAT                                          DATE
UPDATEDAT                                          DATE
*/