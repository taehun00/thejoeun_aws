package com.pawject.dao.exec;

import java.util.HashMap;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;

import com.pawject.dto.exec.WeatherSearchDto;


@Mapper
public interface WeatherSearchDao {
	public int insertweather(  WeatherSearchDto wdto);
//	public int updateweather(  WeatherSearchDto wdto);
//	public int deleteweather(  int wid);
//	public List<WeatherSearchDto> selectAllweather();
	public WeatherSearchDto       selectweather(int wid);
	
	/* PAGING */
	public List<WeatherSearchDto> selectweather10(HashMap<String,Integer> para);
	public int			  selectweatherTotalCnt();
	
	/* SEARCH + PAGING */
	public List<WeatherSearchDto> selectweather3(HashMap<String, Object> para); //##
	public int				      selectweatherSearchTotalCnt(String search); //##
}
