package com.pawject.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * 운동SNS 게시글 엔티티
 */

@Entity
@Getter @Setter
@Table(name = "SAVEWEATHER")
public class WeatherSearch {

    @Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "saveweather_seq")  //시퀀스 사용
	@SequenceGenerator(name = "saveweather_seq", sequenceName = "SAVEWEATHER_SEQ" , allocationSize = 1)    
    @Column(name = "WID")
    private Long wid;

    @Column(name = "WEATHER", nullable = false, length = 50)
    private String weather;
      
    @Lob
    @Column( nullable = false)
    private String weathercontent;
    
	
}
