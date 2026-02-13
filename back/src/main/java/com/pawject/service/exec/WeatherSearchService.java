package com.pawject.service.exec;

import java.util.List;
import com.pawject.dto.exec.WeatherSearchDto;

public interface WeatherSearchService {
	public int insertweather(  WeatherSearchDto wdto);
//	public int updateweather(  WeatherSearchDto wdto);
//	public int deleteweather(  int wid);
//	public List<WeatherSearchDto> selectAllweather();
	public WeatherSearchDto       selectweather(int wid);
//	public WeatherSearchDto       selectweatherUpdateForm(int wid);
	
	/* PAGING */
	public List<WeatherSearchDto> selectweather10(int pageNo);
	public int			  selectweatherTotalCnt();
	
	/* SEARCH + PAGING */
	public List<WeatherSearchDto> selectweather3( String keyword ,int pageNo); //##
	public int				      selectweatherSearchTotalCnt( String keyword ); //##
	
	/*스케쥴링*/
//	public void saveWeatherFromApi();

	

}
