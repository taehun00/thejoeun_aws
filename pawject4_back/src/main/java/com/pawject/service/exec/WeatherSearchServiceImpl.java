package com.pawject.service.exec;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pawject.dao.exec.WeatherSearchDao;
import com.pawject.dto.exec.WeatherSearchDto;


@Service
public class WeatherSearchServiceImpl implements WeatherSearchService {
	@Autowired WeatherSearchDao wdao;
	
	@Override public int insertweather(WeatherSearchDto wdto) { return wdao.insertweather(wdto); }
//	@Override public int updateweather(WeatherSearchDto wdto) { return wdao.updateweather(wdto); }
//	@Override public int deleteweather(int wid) { return wdao.deleteweather(wid); }
//	@Override public List<WeatherSearchDto> selectAllweather() { return wdao.selectAllweather(); }
	@Override public WeatherSearchDto selectweather(int wid) { return wdao.selectweather(wid); }
//	@Override public WeatherSearchDto selectweatherUpdateForm(int wid) { return wdao.selectweather(wid); }

	/* PAGING */
	@Override public List<WeatherSearchDto> selectweather10(int pageNo) { 
		HashMap<String,Integer>   para = new HashMap<>();
		int start = (pageNo-1)*10 + 1;  //(1)1    (2)11  (2)21
		int end   = start + 9;
		
		para.put("start", start);
		para.put("end"  , end);

		return wdao.selectweather10(para); 
	}
	@Override public int selectweatherTotalCnt() { return wdao.selectweatherTotalCnt(); }

	/* SEARCH + PAGING */
	@Override public List<WeatherSearchDto> selectweather3(String keyword, int pageNo) { 
		HashMap<String, Object> para = new HashMap<>();
		//  11-1 (10/10 = 1) 20-1(19/10 = 1)
		int pageSize=3; //3개씩의 페이지
		// 1: start→1, end→3   2: start→4, end→6   3: start→7, end→9 
		para.put("search", keyword);
		int start = (pageNo-1)*pageSize+1;
		para.put("start", start);   // 1→1    2→4 (2-1)*3+1   3→7 (3-1)*3+1
		para.put("end"  , start + pageSize-1);   //4→6 (4+3-1)   , 7→9  (7+3-1)
		return wdao.selectweather3(para); 
	}
	@Override public int selectweatherSearchTotalCnt(String keyword) { return wdao.selectweatherSearchTotalCnt(keyword); }
	
	/* 스케쥴링 - 매일 오전 6시에 자동으로 날씨 갱신 */
//	@Override
//	public void saveWeatherFromApi() {
//	       // 1. 외부 API 호출 (RestTemplate/WebClient 사용)
//        RestTemplate restTemplate = new RestTemplate();
//        String url = "https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=YOUR_API_KEY&units=metric";
//        WeatherScheduled response = restTemplate.getForObject(url, WeatherApiResponse.class);
//
//        // 2. DTO 변환
//        SaveweatherDto wdto = new SaveweatherDto();
//        wdto.setWeather(response.getWeather()[0].getDescription());
//        wdto.setMaxtemp(response.getMain().getTempMax());
//        wdto.setMintemp(response.getMain().getTempMin());
//        wdto.setMoistpercent(response.getMain().getHumidity());
//        wdto.setRainpercent(response.getRain() != null ? response.getRain().getOneHour() : 0);
//
//        // 3. DB 저장
//        SaveweatherDao.insert	
//	}

}
