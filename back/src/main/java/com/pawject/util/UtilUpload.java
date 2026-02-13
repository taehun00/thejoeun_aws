package com.pawject.util;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

@Component
public class UtilUpload {


    @Value("${file.upload-path}")
    private String uploadPath;
    
    @Value("${file.upload-dir}")
    private String uploadDir;
    //기존 메서드
    public String fileUpload(MultipartFile file) throws IOException {
        UUID uid = UUID.randomUUID();
        String save = uid + "_" + file.getOriginalFilename();

        File target = new File(uploadPath, save);
        FileCopyUtils.copy(file.getBytes(), target);

        return save;
    }
    //신규 - 경로 같이 저장
    public String fileUpload(MultipartFile file, String subDir) throws IOException {
        UUID uid = UUID.randomUUID();
        String save = uid + "_" + file.getOriginalFilename();

        File targetDir = new File(uploadDir, subDir);
        if (!targetDir.exists()) targetDir.mkdirs();

        File target = new File(targetDir, save);
        FileCopyUtils.copy(file.getBytes(), target);

        return subDir + "/" + save;   // DB 저장: "foodimg/xxx.png"
    }
}
