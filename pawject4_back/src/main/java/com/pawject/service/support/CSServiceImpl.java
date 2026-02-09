package com.pawject.service.support;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pawject.dao.support.CSAnswerDao;
import com.pawject.dao.support.CSQuestionDao;
import com.pawject.dto.support.CSAnswerDto;
import com.pawject.dto.support.CSQuestionDto;

@Service
public class CSServiceImpl implements CSService {

    @Autowired CSQuestionDao qdao;
    @Autowired CSAnswerDao adao;

    @Override
    public List<CSQuestionDto> selectCSQAll() {
        List<CSQuestionDto> questions = qdao.selectCSQAll();
        for (CSQuestionDto q : questions) {
            q.setAnswers(adao.selectByQuestionid(q.getQuestionid()));
        }
        return questions;
    }

    @Override
    public CSQuestionDto selectCSQ(int questionid) {
        return qdao.selectCSQ(questionid);
    }

    @Override
    public int insertCSQ(CSQuestionDto dto) {
        return qdao.insertCSQ(dto);
    }

    @Override
    public int answerCSQ(CSQuestionDto dto) {
        return qdao.answerCSQ(dto);
    }

    @Override
    public int deleteCSQ(int questionid) {
        return qdao.deleteCSQ(questionid);
    }

    @Override
    public int insertCSA(CSAnswerDto dto) {
        return adao.insertCSA(dto);
    }

    // 질문+답변 매칭
    @Override
    public List<CSQuestionDto> selectCSQUser(CSQuestionDto dto) {
        List<CSQuestionDto> questions = qdao.selectCSQUser(dto);
        for (CSQuestionDto q : questions) {
            q.setAnswers(adao.selectByQuestionid(q.getQuestionid()));
        }
        return questions;
    }

    @Override
    public List<CSAnswerDto> selectByQuestionid(int questionid) {
        return adao.selectByQuestionid(questionid);
    }

    @Override
    public List<CSQuestionDto> select10CSQ(String condition, int pageNo) {
        HashMap<String, Object> para = new HashMap<>();
        int start = (pageNo - 1) * 10 + 1;
        int end = start + 9;
        para.put("start", start);
        para.put("end", end);

        if (condition != null) {
            switch (condition) {
                case "noanswer":
                    para.put("condition", "noanswer");
                    break;
                case "answerend":
                    para.put("condition", "answerend");
                    break;
            }
        }

        List<CSQuestionDto> questions = qdao.select10CSQ(para);
        for (CSQuestionDto q : questions) {
            q.setAnswers(adao.selectByQuestionid(q.getQuestionid()));
        }
        return questions;
    }

    @Override
    public int selectTotalCntCSQ() {
        return qdao.selectTotalCntCSQ();
    }

    // 페이징+서치
    @Override
    public List<CSQuestionDto> selectSearchCSQ(String keyword, String searchType, String condition, int pageNo) {

        if (keyword == null) keyword = "";
        keyword = keyword.toLowerCase();

        HashMap<String, Object> para = new HashMap<>();
        int start = (pageNo - 1) * 10 + 1;
        int end = start + 9;
        para.put("start", start);
        para.put("end", end);

        String searchLike = "%" + keyword + "%";
        switch (searchType) {
            case "title":
                para.put("searchType", "title");
                para.put("search", searchLike);
                break;
            case "content":
                para.put("searchType", "content");
                para.put("search", searchLike);
                break;
            case "nickname":
                para.put("searchType", "nickname");
                para.put("search", searchLike);
                break;
            default:
                para.put("searchType", "");
                para.put("search", searchLike);
                break;
        }

        if (condition != null) {
            switch (condition) {
                case "noanswer":
                    para.put("condition", "noanswer");
                    break;
                case "answerend":
                    para.put("condition", "answerend");
                    break;
            }
        }

        List<CSQuestionDto> questions = qdao.selectSearchCSQ(para);
        for (CSQuestionDto q : questions) {
            q.setAnswers(adao.selectByQuestionid(q.getQuestionid()));
        }
        return questions;
    }

    @Override
    public int selectSearchTotalCntCSQ(String keyword, String searchType, String condition) {

        if (keyword == null) keyword = "";
        keyword = keyword.toLowerCase();

        HashMap<String, Object> para = new HashMap<>();
        String searchLike = "%" + keyword + "%";

        switch (searchType) {
            case "title":
                para.put("searchType", "title");
                para.put("search", searchLike);
                break;
            case "content":
                para.put("searchType", "content");
                para.put("search", searchLike);
                break;
            case "nickname":
                para.put("searchType", "nickname");
                para.put("search", searchLike);
                break;
            default:
                para.put("searchType", "");
                para.put("search", searchLike);
                break;
        }

        if (condition != null) {
            switch (condition) {
                case "noanswer":
                    para.put("condition", "noanswer");
                    break;
                case "answerend":
                    para.put("condition", "answerend");
                    break;
            }
        }

        return qdao.selectSearchTotalCntCSQ(para);
    }

    //유저 인증 방식 교체 - 임시 메서드 폐기
    public List<CSQuestionDto> selectCSQByUserId(int userid) {
        CSQuestionDto dto = new CSQuestionDto();
        dto.setUserid(userid);

        List<CSQuestionDto> list = qdao.selectCSQUser(dto);

        for (CSQuestionDto q : list) {
            List<CSAnswerDto> answers = adao.selectByQuestionid(q.getQuestionid());
            q.setAnswers(answers);
        }
        return list;
    }

    //폐기
    @Override
    public List<CSQuestionDto> selectCSQByEmail(String email) {
        return List.of();
    }

    @Override
    public int selectUserIdByEmail(String email) {
        return 0;
    }
}
