package com.pawject.util;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID; 
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * 파일 저장 서비스
 * - 업로드된 파일을 로컬 uploads 폴더에 저장
 * */ 
@Service  //##
public class FileStorageService {
	
    private final Path root = Paths.get("uploads");  // 프로젝트 실행위치 기준으로 uploads 폴더 생성

    public String upload(MultipartFile file) {
        try {
            if (!Files.exists(root)) {  // 디렉트로 생성확인
                Files.createDirectories(root);  // 중간경로까지 모두 생성
            }
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename(); // 파일명 충돌방지
            Path target = root.resolve(filename);   // uploads디렉토리안에 filename 붙여서 최종 저장경로 생성
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);  // 파일복사
            return "uploads/" + filename;  //   uploads/ 파일
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 실패", e);
        }
    }
}
