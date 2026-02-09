package com.pawject.service.food;

import java.io.File;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


 
@Service
public class NaverOcrService { 

	@Value("${naver.ocr.key}") 
	private String secretKey;

    @Value("${naver.ocr.url}") 
    private String apiUrl;
    
    public String callOcrApi(File imageFile) {
        if (apiUrl == null || apiUrl.isBlank()) {
            throw new IllegalStateException("naver.ocr.url 설정이 비어있음");
        }
        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException("naver.ocr.key 설정이 비어있음");
        }
        
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.add("X-OCR-SECRET", secretKey);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        
        body.add("file", new FileSystemResource(imageFile));
        body.add("message", String.format(
        		
        	    "{"
        	  + "\"version\":\"V1\","
        	  + "\"requestId\":\"%s\","
        	  + "\"timestamp\":%d,"
        	  + "\"images\":[{\"name\":\"sample\",\"format\":\"png\"}]"
        	  + "}",
        	    java.util.UUID.randomUUID().toString(),
        	    System.currentTimeMillis()
        	));

        
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        System.out.println("OCR apiUrl = [" + apiUrl + "]");
        
        ResponseEntity<String> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                requestEntity,
                String.class
        ); 
        
        
        //변환 - {"x":150.0,"y":267.0}]},"inferText":"RENAL",    // [inferText]만 추출
        //[images[배열0] -> fields[배열i] ->inferText(문자열text)]
        
        //이 둘은 그냥 외우기
        ObjectMapper mapper = new ObjectMapper();
        StringBuilder result = new StringBuilder();
        
        JsonNode root;
		try {
			root = mapper.readTree(response.getBody());
	        JsonNode fields = root.path("images").get(0).path("fields");
		
	        for(JsonNode field :  fields) {
	        	result.append(field.path("inferText").asText()).append("\n");
	        }
	        
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}

        return result.toString().trim();
    }
}

//curl --location --request POST 'https://*****.apigw.ntruss.com/custom/v1/33675/8f694ccb00dbd8001e9b0fcbac**********************/general' \
//--header 'Content-Type: multipart/form-data' \
//--header 'X-OCR-SECRET: {앱 등록 시 발급받은 Secret Key}' \
//--form 'file=@"{file}.pdf"' \
//--form 'message="{\"version\": \"v1\", \"requestId\": \"1234\", \"timestamp\": 1722225600000, \"lang\": \"ko\", \"images\": [{\"format\": \"pdf\", \"name\": \"covid_sample\"}]}"'


/*
 version	String	-	버전 정보
V1 | V2
V1: V1 엔진 호출
V2: V2 엔진 호출
requestId	String	-	API 호출 UUID
timestamp	Integer	-	API 호출 시각(Timestamp)
images	Array	-	images 세부 정보


 */

/*
[images[배열] -> fields[배열] ->inferText(문자열)]
{
    "version": "v1",
    "requestId": "1234",
    "timestamp": 1724821610657,
    "images": [
        {
            "uid": "{uid}",
            "name": "covid_demo",
            "inferResult": "SUCCESS",
            "message": "SUCCESS",
            "validationResult": {
                "result": "NO_REQUESTED"
            },
            "fields": [
                {
                    "valueType": "ALL",
                    "boundingPoly": {
                        "vertices": [
                            {
                                "x": 581.0,
                                "y": 123.0
                            },
                            {
                                "x": 650.0,
                                "y": 123.0
                            },
                            {
                                "x": 650.0,
                                "y": 149.0
                            },
                            {
                                "x": 581.0,
                                "y": 149.0
                            }
                        ]
                    },
                    "inferText": "가꾸는",
                    "inferConfidence": 0.9985
                },
                {
                    "valueType": "ALL",
                    "boundingPoly": {
                        "vertices": [
                            {
                                "x": 399.0,
                                "y": 1168.0
                            },
                            {
                                "x": 790.0,
                                "y": 1168.0
                            },
                            {
                                "x": 790.0,
                                "y": 1215.0
                            },
                            {
                                "x": 399.0,
                                "y": 1215.0
                            }
                        ]
                    },
                    "inferText": "서울특별시초등학교장",
                    "inferConfidence": 0.9997
                }
            ]
        }
    ]
}

*/

 