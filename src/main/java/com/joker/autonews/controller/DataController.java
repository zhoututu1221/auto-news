package com.joker.autonews.controller;

import com.joker.autonews.mapper.ClassifyMapper;
import com.joker.autonews.mapper.NewsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class DataController {

//    news_表
    @Autowired
    NewsMapper newsMapper;
//    分页得到该分类下的新闻
    @RequestMapping("/api/getClassifyNews")
    @ResponseBody
    public Object getClassifyNews(String newsClassify,Integer start,Integer count){
        if(newsClassify.equals("")){
            return "error_data";
        }else if (start < 0 || count < 0 || start == null || count == null){
            return "error-data";
        }else {
            return newsMapper.getPageClassifyNews(newsClassify,start,count);
        }
    }
//    得到该分类有几条记录
    @RequestMapping("/api/getClassifyNewsCount")
    @ResponseBody
    public Object getClassifyNewsCount(String newsClassify){
        if(newsClassify.equals("")){
            return "error_data";
        }else {
            return newsMapper.getNewsClassifyCount(newsClassify);
        }
    }
//  分页得到模糊搜索的新闻
    @RequestMapping("/api/getSearchNews")
    @ResponseBody
    public Object getSearchNews(String search,Integer start,Integer count){
        if(search.equals("")){
            return "error_data";
        }else if (start < 0 || count < 0 || start == null || count == null){
            return "error-data";
        }else {
            return newsMapper.getSearchNews(search,start,count);
        }
    }
//    分页得到模糊搜索的新闻数量
    @RequestMapping("/api/getSearchNewsCount")
    @ResponseBody
    public Object getSearchNewsCount(String search){
        if(search.equals("")){
            return "error_data";
        }else {
            return newsMapper.getSearchNewsCount(search);
        }
    }
//    根据新闻id获取其信息
    @RequestMapping("/api/getIdNews")
    @ResponseBody
    public Object getIdNews(Integer id){
        if(id == null){
            return "error_data";
        }else {
            return newsMapper.getIdNews(id);
        }
    }


//    classify_表
    @Autowired
    ClassifyMapper classifyMapper;
//    得到所有分类
    @RequestMapping("/api/getAllClassify")
    @ResponseBody
    public Object getAllClassify(){
        return classifyMapper.getAllClassify();
    }

}
