package com.pawject.util;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UtilPaging { 
	private  int  listtotal;    //#1) 전체글 193
	private  int  onepagelist;  //#2) 한페이지에 보여줄 게시물의 수 10
	private  int  pagetotal;    //#3) 총페이지수  193/10     19페이지 + 3글 = 20개
	private  int  bottomlist;   //#4) 하단에 페이지수  이전  11 12 13 14 15  다음
	private  int  pstartno;     //#5) 페이지 시작번호  (1) 1,10  (2) 11,20
	private  int  current;      //#6) 하단에 페이지수  이전  11 12 [13] 14 15    다음  
	private  int  start;        //#7) 하단에 페이지수  이전  [11] 12 13 14 15    다음   
	private  int  end;          //#8) 하단에 페이지수  이전  [11] 12 ,,, 19 [20] 다음 
	
	//## 기본생성자 (10개씩, 하단네비블록10개)
	public UtilPaging(int listtotal, int pageNo) { 
		this(listtotal ,pageNo , 10,10 );
    }
	//## 오버로딩된 생성자 (페이지 크기와 하단네비크기를 직접지정)
    public UtilPaging(int listtotal, int pageNo , int onepagelist , int  bottomlist) {//(1) 1,10   (2) 11,20
		this.listtotal   = (listtotal<=0)? 1: listtotal;
		this.onepagelist = onepagelist;   //# 기본값 : 한페이지 10개  #####
		this.pagetotal   = (int) Math.ceil(this.listtotal/ (double)onepagelist);
		// 193/10  → 19.3  → 올림→ 20   / 256/10  → 25.6 → 26
		// 200/10  → 20    → 올림→ 20   / 
		this.bottomlist  = bottomlist;  //######
		// 하단페이지블록계산
		this.current     = pageNo;    // 23 → start=21 , end=30
		this.start       = ((current-1)/bottomlist)*bottomlist + 1;  
		// 21  → (21-1)/10 → 앞자리2로  *10 + 1
		// 30  → (30-1)/10 → 앞자리2로  *10 + 1
		this.end         = start + bottomlist -1;  //21+10-1 = 30
		if(end > pagetotal ) {  end = pagetotal; }   // 30>26   마지막은 26번으로 
		
        // DB 조회 시작 번호  ######
        this.pstartno = (pageNo - 1) * onepagelist + 1;
	}      
}
