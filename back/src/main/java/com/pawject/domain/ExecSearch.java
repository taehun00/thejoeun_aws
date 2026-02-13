package com.pawject.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 운동SNS 게시글 엔티티
 */

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Table(name = "EXERCISEINFO")
public class ExecSearch {

    @Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "exerciseinfo_seq")  //시퀀스 사용
	@SequenceGenerator(name = "exerciseinfo_seq", sequenceName = "EXECINFO_SEQ" , allocationSize = 1)    
    @Column(name = "EXECID")
    private Long execid;

    @Column(name = "EXECTYPE", nullable = false, length = 50)
    private String exectype;
      
    @Lob
    @Column( nullable = false)
    private String description;
    
    @Column(name = "AVGKCAL30MIN")
    private float avgkcal30min;
    
    @Column(name = "EXECTARGETMIN")
    private int exectargetmin;
    
    @Column(name = "SUITABLEFOR", nullable = false, length = 100)
    private String suitablefor;

    @Column(name = "INTENSITYLEVEL", nullable = false, length = 30)
    private String intensitylevel;
    
	@Column(nullable = false , name="CREATEDAT")
	private LocalDateTime createdAt; // 생성일시
	
	@Column(nullable = false , name="UPDATEDAT")
	private LocalDateTime updatedAt; // 수정일시

	@PrePersist
	void onCreate() {
		this.createdAt = LocalDateTime.now();
		this.updatedAt = LocalDateTime.now();
	}
	
	@PreUpdate
	void onUpdate() { 
		this.updatedAt = LocalDateTime.now();
	}




	// 테스트생성자
	public ExecSearch(String exectype, String description, float avgkcal30min, int exectargetmin, String suitablefor,
			String intensitylevel) {
		super();
		this.exectype = exectype;
		this.description = description;
		this.avgkcal30min = avgkcal30min;
		this.exectargetmin = exectargetmin;
		this.suitablefor = suitablefor;
		this.intensitylevel = intensitylevel;
	}
	
}
