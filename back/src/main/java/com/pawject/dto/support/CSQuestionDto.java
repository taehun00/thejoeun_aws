package com.pawject.dto.support;

import java.util.List;

import lombok.Data;

@Data
public class CSQuestionDto {
	private int questionid;
	private int userid;
	private String category;
	private String title;
	private String content;
	public int status;
	private String createdat;
	private List<CSAnswerDto> answers;
	private String nickname;
	
	
	
    public List<CSAnswerDto> getAnswers() {
        return answers;
    }

    public void setAnswers(List<CSAnswerDto> answers) {
        this.answers = answers;
    }
	
}

/*
QUESTIONID NOT NULL NUMBER        
USERID     NOT NULL NUMBER        
CATEGORY            VARCHAR2(50)  
TITLE      NOT NULL VARCHAR2(200) 
CONTENT    NOT NULL CLOB          
STATUS              NUMBER(1)     
CREATEDAT           DATE    
 */