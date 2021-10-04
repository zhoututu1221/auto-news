package com.joker.autonews.mapper;

import com.joker.autonews.pojo.Gather;
import org.apache.ibatis.annotations.*;
import org.springframework.cache.annotation.EnableCaching;

import java.util.List;

@EnableCaching
@Mapper
public interface GatherMapper {

//    添加规则
    @Insert("insert into gather_ (gather_id,gather_classify,gather_url,gather_content_e,gather_max_page,gather_page_e,gather_news_title_e,gather_news_content_e,gather_news_time_e,gather_news_auto_gap,gather_auto,gather_click) values(#{gather_id},#{gather_classify},#{gather_url},#{gather_content_e},#{gather_max_page},#{gather_page_e},#{gather_news_title_e},#{gather_news_content_e},#{gather_news_time_e},#{gather_news_auto_gap},#{gather_auto},#{gather_click})")
    Integer addGather(Gather gather);

//    根据分类查询规则
    @Select("select * from gather_ where gather_classify = #{gatherClassify}")
    List<Gather> getGather(String gatherClassify);

//    删除规则
    @Delete("delete from gather_ where gather_id = #{gatherId}")
    Integer deleteGather(Integer gatherId);

//    通过分类删除规则
    @Delete("delete from gather_ where gather_classify = #{gatherClassify}")
    Integer deleteClassifyGather(String gatherClassify);

//    修改规则
    @Update("update gather_ set gather_url=#{gather_url},gather_content_e=#{gather_content_e},gather_max_page=#{gather_max_page},gather_page_e=#{gather_page_e},gather_news_title_e=#{gather_news_title_e},gather_news_content_e=#{gather_news_content_e},gather_news_time_e=#{gather_news_time_e},gather_news_auto_gap=#{gather_news_auto_gap},gather_auto=#{gather_auto},gather_click=#{gather_click} where gather_classify = #{gather_classify}")
    Integer updateGather(Gather gather);

}
