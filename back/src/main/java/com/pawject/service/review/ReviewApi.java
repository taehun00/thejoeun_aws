package com.pawject.service.review;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ReviewApi {

    @Value("${openai.api.key.hj}")
    private String apikey;

    // ✅ 최신 엔드포인트
    private static final String API_URL = "https://api.openai.com/v1/responses";

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String MODELS_URL = "https://api.openai.com/v1/models";

    public String testOpenAiKey() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apikey.trim());

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> res =
                    restTemplate.exchange(MODELS_URL, org.springframework.http.HttpMethod.GET, entity, String.class);
            return res.getBody();
        } catch (HttpStatusCodeException e) {
            throw new RuntimeException(
                    "OpenAI models 호출 실패: HTTP " + e.getStatusCode() + "\n" +
                    "Response Body: " + e.getResponseBodyAsString(),
                    e
            );
        }
    }
    
    // 리뷰 내용 다듬기
    public String helpReviewWriting(String title, String reviewcomment) {

        if (apikey == null || apikey.isBlank()) {
            throw new IllegalStateException("openai.api.key.hj 설정이 비어있음");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("Authorization", "Bearer " + apikey.trim());

        // ✅ Responses API body
        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4.1");

        String systemPrompt =
                "너는 사용자 리뷰를 정중하고 중립적인 표현으로 다듬는 도우미다. " +
                "의미는 유지하고 비속어, 과한 표현, 감정적인 표현만 순화한다. " +
                "주제는 사료 리뷰이며 섭취 대상은 강아지, 고양이다. " +
                "강아지, 고양이 여부가 명확하지 않으면 중립적인 표현을 쓴다. " +
                "출력은 반드시 아래 형식을 따른다:\n" +
                "제목: <다듬은 제목>\n" +
                "내용: <다듬은 내용>";

        String userPrompt =
                "제목: " + title + "\n" +
                "내용: " + reviewcomment;

        // ✅ responses api는 input에 text 넣는 구조
        body.put("input", List.of(
                Map.of(
                        "role", "system",
                        "content", List.of(Map.of("type", "input_text", "text", systemPrompt))
                ),
                Map.of(
                        "role", "user",
                        "content", List.of(Map.of("type", "input_text", "text", userPrompt))
                )
        ));

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> responseEntity =
                    restTemplate.postForEntity(API_URL, requestEntity, String.class);

            String responseBody = responseEntity.getBody();

            JsonNode root = objectMapper.readTree(responseBody);

            // ✅ Responses API 결과 텍스트 추출 (output_text)
            JsonNode output = root.path("output");
            if (output.isMissingNode() || !output.isArray()) {
                throw new RuntimeException("OpenAI 응답 형식이 예상과 다름: output 없음");
            }

            // output[0].content[0].text 형태로 오는 경우가 많음
            JsonNode first = output.get(0);
            JsonNode contentArr = first.path("content");

            if (!contentArr.isArray() || contentArr.size() == 0) {
                throw new RuntimeException("OpenAI 응답 형식이 예상과 다름: content 없음");
            }

            String result = contentArr.get(0).path("text").asText();
            return result;

        } catch (HttpStatusCodeException e) {
            // ✅ 401/403/429 등 정확한 원인을 body로 보여줌 (이거 없으면 삽질함)
            throw new RuntimeException(
                    "OpenAI API 호출 실패: HTTP " + e.getStatusCode() + "\n" +
                    "Response Body: " + e.getResponseBodyAsString(),
                    e
            );
        } catch (Exception e) {
            throw new RuntimeException("OpenAI 응답 파싱 오류", e);
        }
    }
}
