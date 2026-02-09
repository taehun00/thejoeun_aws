package com.pawject.service.food;

import java.io.File;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.pawject.dao.food.BrandDao;
import com.pawject.dao.food.FoodDao;
import com.pawject.dao.food.NutriDao;
import com.pawject.dto.food.BrandDto;
import com.pawject.dto.food.FoodDto;
import com.pawject.dto.food.FoodDtoForList;
import com.pawject.dto.food.NutriDto;
import com.pawject.util.UtilUpload;
@Service
public class FoodServiceImpl implements FoodService {
	@Autowired FoodDao fdao;
	@Autowired BrandDao bdao;
	@Autowired NutriDao ndao;
//	@Autowired	ServletContext context;  폐기, 설정파일로 경로 이동
	@Autowired private UtilUpload utilUpload;
	
    @Value("${file.upload-dir}")    
    private String uploadDir;



		@Override
		public int foodinsert(FoodDto dto, MultipartFile file) {
		    String fileName = "";
		
		    if (file != null && !file.isEmpty()) {
		        File dir = new File(uploadDir, "foodimg");
		        if (!dir.exists()) dir.mkdirs();
		
		        fileName = file.getOriginalFilename();
		        File img = new File(dir, fileName);
		
		        try {
		            file.transferTo(img);
		        } catch (Exception e) {
		            e.printStackTrace();
		        }
		    }
		
		    dto.setFoodimg(fileName);
		    return fdao.foodinsert(dto);
		}
	
	
		@Override
		public List<FoodDto> foodselectAll() {
			return fdao.foodselectAll();
		}

		@Override
		public FoodDto foodselect(int foodid) {
			return fdao.foodselect(foodid);
		}

		@Override
		public int foodupdate(FoodDto dto, MultipartFile file) {

		    // 기존 데이터 조회해서 기존 파일명 확보
		    FoodDto old = fdao.foodselect(dto.getFoodid());
		    String fileName = (old != null) ? old.getFoodimg() : "";

		    // 새 파일 들어온 경우에만 교체 (원본파일명 그대로 저장 + 덮어쓰기)
		    if (file != null && !file.isEmpty()) {
		        File dir = new File(uploadDir, "foodimg");
		        if (!dir.exists()) dir.mkdirs();

		        fileName = file.getOriginalFilename();
		        File img = new File(dir, fileName);

		        try {
		            file.transferTo(img);
		        } catch (Exception e) {
		            e.printStackTrace();
		        }
		    }

		    // DB 반영 (파일 없으면 기존 유지)
		    dto.setFoodimg(fileName);
		    return fdao.foodupdate(dto);
		}
		    

		@Override
		public int fooddelete(int foodid) {
			return fdao.fooddelete(foodid);
		}

		@Override
		public int nutriinsert(NutriDto dto) {
			return ndao.nutriinsert(dto);
		}

		@Override
		public List<NutriDto> nutriselectAll() {
			return ndao.nutriselectAll();
		}



		@Override
		public List<NutriDto> nutriselect(int foodid) {
			return ndao.nutriselect(foodid);
		}

		@Override
		public int nutriupdate(NutriDto dto) {
			return ndao.nutriupdate(dto);
		}

		@Override
		public int nutridelete(NutriDto dto) {
			return ndao.nutridelete(dto);
		}

		@Override
		public int nutrideleteAll(int foodid) {
			return ndao.nutrideleteAll(foodid);
		}

		

		@Override
		public List<FoodDtoForList> foodselectForList() {
			return fdao.foodselectForList();
		}

		@Override
		public NutriDto nutriselectForWrite(int foodid) {
			return ndao.nutriselectForWrite(foodid);
		}

		@Override
		public List<BrandDto> brandSelectAll() {
			return bdao.brandSelectAll();
		}

		@Override
		public List<NutriDto> nutrientSelectName() {

			return ndao.nutrientSelectName();
		}

		@Override
		public FoodDto foodselectwithBrand(int foodid) {
			return fdao.foodselectwithBrand(foodid);
		}

		@Override
		public List<NutriDto> nutriselectWithInfo(int foodid) {
			// TODO Auto-generated method stub
			return ndao.nutriselectWithInfo(foodid);
		}

		@Override
		public List<FoodDtoForList> foodselect10(int pstartno, String condition) {
		    HashMap<String, Object> para = new HashMap<>();
		    int start = (pstartno - 1) * 10 + 1;
		    int end = start + 9;

		    para.put("start", start);
		    para.put("end", end);
		    
		    if (condition != null) {
		        switch (condition) {
		            case "foodnameAsc":
		            	para.put("condition", "foodnameAsc");
		                break;
		            case "foodnameDesc":
		            	para.put("condition", "foodnameDesc");
		                break;
		            case "brandnameAsc":
		            	para.put("condition", "brandnameAsc");
		                break;
		            case "brandnameDesc":
		            	para.put("condition", "brandnameDesc");
		                break;
		                
		        }
		    }	

		    return fdao.foodselect10(para); 
		}

		@Override
		public int foodselectcnt() {
			return fdao.foodselectcnt();
		}

		@Override
		public List<FoodDtoForList> foodsearch(String keyword, String searchType, String condition, int pstartno) {

			HashMap<String, Object> para = new HashMap<>();
		    int start = (pstartno - 1) * 10 + 1;
		    int end = start + 9;

		    para.put("start", start);
		    para.put("end", end);
			
			
			keyword = keyword.toLowerCase(); //대소문자 구분 x
			String searchLike = "%" + keyword + "%";
			
			switch(searchType) {
			//분기1. 펫타입
	        case "pettypeid":
	            para.put("searchType", "pettypeid");

	            if ("고양이".equals(keyword)) {
	                para.put("search", "1");
	            } else if ("강아지".equals(keyword)) {
	                para.put("search", "2");
	            } else {
	                para.put("search", "-1");
	            }
	            break;
			//분기2. 브랜드
			case "brandname" : para.put("searchType", "brandname");
			 				   para.put("search", searchLike);	break;

			//분기3. 사료이름
			case "foodname" : para.put("searchType", "foodname"); 
							  para.put("search", searchLike);	break;
	
			//분기4. 제목+내용+브랜드
			case "all" : para.put("searchType", "all");
						para.put("search", searchLike);	break;
			
	
			}//switch
			
		    if (condition != null) {
		        switch (condition) {
		            case "foodnameAsc":
		            	para.put("condition", "foodnameAsc");
		                break;
		            case "foodnameDesc":
		            	para.put("condition", "foodnameDesc");
		                break;
		            case "brandnameAsc":
		            	para.put("condition", "brandnameAsc");
		                break;
		            case "brandnameDesc":
		            	para.put("condition", "brandnameDesc");
		                break;
		                
		        }
		    }	
			
			
			return fdao.foodsearch(para);
		}

		@Override
		public int foodsearchcnt(String keyword, String searchType) {
			HashMap<String, Object> para = new HashMap<>();
			String searchLike = "%" + keyword + "%";
			
			switch(searchType) {
			//분기1. 펫타입
	        case "pettypeid":
	            para.put("searchType", "pettypeid");

	            if ("고양이".equals(keyword)) {
	                para.put("search", "1");
	            } else if ("강아지".equals(keyword)) {
	                para.put("search", "2");
	            } else {
	                para.put("search", "-1");
	            }
	            break;
			//분기2. 브랜드
			case "brandname" : para.put("searchType", "brandname");
			 				   para.put("search", searchLike);	break;

			//분기3. 사료이름
			case "foodname" : para.put("searchType", "foodname"); 
							  para.put("search", searchLike);	break;
	
			//분기4. 제목+내용
			case "all" : para.put("searchType", "all");
						para.put("search", searchLike);	break;
			
	
			}//switch
			
			
			return fdao.foodsearchcnt(para);
		}


		@Override
		public List<FoodDto> foodselectName() {
			return fdao.foodselectName();
		}

		
	}

