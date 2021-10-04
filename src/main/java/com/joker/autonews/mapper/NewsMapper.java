package com.joker.autonews.mapper;

import com.joker.autonews.pojo.News;
import org.apache.ibatis.annotations.*;
import org.springframework.cache.annotation.EnableCaching;

import java.util.List;

@EnableCaching
@Mapper
public interface NewsMapper {

//    分页得到新闻
    @Select("select * from news_ order by news_id desc limit #{start},#{count}")
    List<News> getPageNews(Integer start, Integer count);

//    得到总共有几条新闻
    @Select("select count(*) from news_")
    Integer getNewsCount();

//    通过标题判断该记录是否存在
    @Select("select count(*) from news_ where news_title = #{newsTitle}")
    Integer newsIsExists(String newsTitle);

//    分页得到某分类下的新闻
    @Select("select * from news_ where news_classify = #{newsClassify} order by news_id desc limit #{start},#{count}")
    List<News> getPageClassifyNews(String newsClassify,Integer start, Integer count);

//    得到该分类有几条记录
    @Select("select count(*) from news_ where news_classify = #{newsClassify}")
    Integer getNewsClassifyCount(String newsClassify);

//    分页得到模糊搜索的新闻
    @Select("select * from news_ where news_title like concat('%',#{search},'%') or news_content like concat('%',#{search},'%') order by news_id desc limit #{start},#{count}")
    List<News> getSearchNews(String search,Integer start, Integer count);

//    得到模糊搜索的新闻数量
    @Select("select count(*) from news_ where news_title like concat('%',#{search},'%') or news_content like concat('%',#{search},'%')")
    Integer getSearchNewsCount(String search);

//    通过新闻id获取新闻
    @Select("select * from news_ where news_id = #{newsId}")
    List<News> getIdNews(Integer newsId);

//    添加新闻
    @Insert("insert into news_ (news_classify,news_title,news_zuozhe,news_laiyuan,news_click,news_content,news_time,news_gTime) values(#{news_classify},#{news_title},#{news_zuozhe},#{news_laiyuan},#{news_click},#{news_content},#{news_time},#{news_gTime})")
    Integer addNews(News news);

//    修改新闻
    @Update("update news_ set news_classify=#{news_classify},news_title=#{news_title},news_content=#{news_content},news_time=#{news_time},news_gTime=#{news_gTime} where news_id = #{news_id}")
    Integer updateNews(News news);

//    删除新闻
    @Delete("delete from news_ where news_id = #{newsId}")
    Integer deleteNews(Integer newsId);

//    通过分类删除新闻
    @Delete("delete from news_ where news_classify = #{newsClassify}")
    Integer deleteClassifyNews(String newsClassify);

}
