package com.pawject.service.food;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pawject.dto.food.SearchPetfoodDto;
@Service
public class FoodApi {	
	@Value("${openai.api.key.hj}")
	private String apikey;
	@Autowired SearchPetfoodService service;
	
	private static final String API_URL="https://api.openai.com/v1/chat/completions";
	private final ObjectMapper objectMapper = new ObjectMapper();
	RestTemplate  restTemplate = new RestTemplate();
	
    public Map<String, Object> aiChangeFilter(String userMessage) {
    	
    	//0. 입력값 소환
        List<SearchPetfoodDto> filterlist = service.aiRecommend();
        StringBuilder prompt = new StringBuilder();  //얘는 그냥 외워야됨..

        // 1. 프롬프트 만들기
    	prompt.append("너는 사용자의 요구에 따라 반려동물 사료 검색 필터를 자동으로 조정하는 시스템이다.\n");
    	prompt.append("사용자 입력을 분석해 필터를 내부적으로 변경한다.\n");
    	prompt.append("필터 목록을 나열하거나 선택을 요구하지 않는다.\n");
    	prompt.append("브랜드 필터는 사용자가 명시적으로 요청한 경우에만 filters에 포함할 수 있다.\n");
    	prompt.append("사용자가 브랜드를 언급하지 않은 경우 브랜드 필터는 자동으로 설정하지 않는다.\n");
    	prompt.append("특정 사료나 재료를 찾는 경우, 사용자가 검색창에 직접 입력하여 검색하도록 안내한다.\n");
    	prompt.append("사료 단일 상품(foodId 또는 foodName)은 어떤 경우에도 추천하거나 설정하지 않는다.\n\n");

    	//형식
    	prompt.append("응답은 반드시 JSON 객체 하나로만 출력한다.\n");
    	prompt.append("- filters: 변경된 필터만 포함한다.\n");
    	prompt.append("- message: 필터를 조정했음을 설명하는 자연어 문장이다.\n");
    	prompt.append("- 자연어 설명은 반드시 message 필드 안에서만 작성한다.\n");
    	prompt.append("- JSON 객체 외의 텍스트는 출력하지 않는다.\n");
    	prompt.append("- isgrainfree 필터 값은 'Y' 또는 'N' 문자열로 표현한다.\n");
    	prompt.append("- filters에 해당되는 항목이 없을 경우 빈 객체 {}를 반환한다.\n\n");
    		
    	//외부 출력
    	prompt.append("message 필드 자연어 설명은 다음 조건을 따른다.\n");
    	prompt.append("- 필터를 자동으로 변경했음을 알린다\n");
    	prompt.append("- 필터 변경 이유를 자연어로 설명한다\n");
    	prompt.append("- 결과는 간결하고 친절하게 작성한다\n");
    	prompt.append("- 불필요한 설명, 인사말, 추천 문장은 하지 않는다\n\n");

    	//복수 출력 방지
    	prompt.append("filters의 각 항목은 반드시 하나의 값만 포함한다.\n");
    	prompt.append("filters 객체에서는 배열(Array)을 절대 반환하지 않는다.\n");
    	prompt.append("복수 조건이 있는 경우 가장 우선순위가 높은 값 하나만 filters에 포함한다.\n");
    	prompt.append("복수 조건이 있는 경우 선택된 값이 왜 우선 적용되었는지를 message 필드에서 한 문장으로 간단히 설명한다.\n");
    	prompt.append("선택되지 않은 조건은 배열이 아닌 자연어 설명으로 message 필드에 참고용으로 요약하여 포함한다.\n\n");	
    	
    	
    	prompt.append("아래 정보는 필터 선택 참고용 데이터다.\n\n");
    	prompt.append("[사료 데이터 요약]\n");

    	//문자열만 - 아이디 해석x
    	for (SearchPetfoodDto filter : filterlist) {
    	    prompt.append("- ")
    	          .append(filter.getPettypename()).append(" / ")
     	          .append(filter.getBrandname()).append(" / ")
     	          .append(filter.getCountry()).append(" / ")
     	          .append(filter.getBrandtype()).append(" / ")
     	          .append(filter.getOrigin()).append(" / ")
    	          .append(filter.getCategory()).append(" / ")
    	          .append(filter.getPetagegroup()).append(" / ")
    	          .append(filter.getIsgrainfree()).append(" / ")    	          
    	          .append(filter.getFoodtype()).append(" / ")    	          
    	          .append(filter.getRangelabel())
    	          .append("\n\n");
    	}
    	
    	//컬럼명 변경 방지
    	prompt.append("filters의 키 이름에 age, brand, type 등의 축약 키는 사용하지 않는다.\n");
    	prompt.append("filters의 키 이름은 반드시 다음 컬럼명과 동일하게 사용한다.\n");
    	prompt.append("- petagegroup\n");
    	prompt.append("- pettype\n");
    	prompt.append("- brandname\n");
    	prompt.append("- foodtype\n");
    	prompt.append("- category\n");
    	prompt.append("- isgrainfree\n");
    	prompt.append("- rangelabel\n");
    	prompt.append("- origin\n\n");
 
    	//퍼피인데 고양이 사료 던져주기 방지...... 
    	prompt.append("펫타입 결정 규칙:\n");
    	prompt.append("- 사용자 입력에 '강아지', '퍼피', '개', 'puppy'가 포함되면 펫타입은 반드시 '강아지'로 설정한다.\n");
    	prompt.append("- 사용자 입력에 '고양이', '냥', '캣', 'cat'이 포함되면 펫타입은 반드시 '고양이'로 설정한다.\n");
    	prompt.append("- 펫타입이 명확한 경우, 사료 데이터 요약이나 다른 조건보다 이를 최우선으로 적용한다.\n");
    	prompt.append("- 펫타입이 명확한 경우, 사료 라벨도 반드시 동일한 조건을 따른다\n");
    	prompt.append("- 펫타입이 불명확한 경우에만 다른 조건을 종합해 추론한다.\n\n");
    	

    	

    	String finalPrompt = prompt.toString();

  
    	
    	 // 2. GPT 호출
		HttpHeaders headers = new HttpHeaders();
		headers.set("Content-Type", "application/json");
		headers.set("Authorization", "Bearer " + apikey); 
		
		Map<String, Object> body = new HashMap<>();
		body.put("model", "gpt-4"); 
		body.put("messages", List.of(
			    Map.of(
			        "role", "system",
			        "content", finalPrompt + "\n이 정보를 기반으로 사용자의 요구에 적합한 검색 필터를 설정해줘."
			    ),
			    Map.of("role", "user", 
			    		"content", userMessage)
			));
				
		// 3. JSON 파싱
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        String response = restTemplate.postForObject(API_URL, request, String.class);

        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode choices = root.path("choices");

            if (!choices.isArray() || choices.size() == 0) {
                return defaultResult();
            }

            String content = choices.get(0).path("message").path("content").asText("");

            if (content.isBlank()) {
                return defaultResult();
            }

            return parseAiContent(content);

        } catch (Exception e) {
            e.printStackTrace();
            return defaultResult();
        }
    }

    // 위치 조심!!
    private Map<String, Object> parseAiContent(String content)
            throws JsonProcessingException {

        Map<String, Object> result = new HashMap<>();

        JsonNode contentNode = objectMapper.readTree(content);
        JsonNode filtersNode = contentNode.path("filters");
        JsonNode messageNode = contentNode.path("message");

        Map<String, Object> filters = new HashMap<>();
        if (filtersNode.isObject()) {
            filters = objectMapper.convertValue(filtersNode, Map.class);
        }

        result.put("filters", filters);
        result.put("message", messageNode.asText(""));

        return result;
    }

    private Map<String, Object> defaultResult() {
        return Map.of(
            "filters", new HashMap<>(),
            "message", "입력한 내용을 반영하여 필터를 조정했습니다."
        );
    }
}


/*
{
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "필터를 조정했습니다."
      }
    }
  ]
}
 	*/
