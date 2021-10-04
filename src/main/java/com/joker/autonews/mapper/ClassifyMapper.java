package com.joker.autonews.mapper;


import com.joker.autonews.pojo.Classify;
import org.apache.ibatis.annotations.*;
import org.springframework.cache.annotation.EnableCaching;

import java.util.List;

@EnableCaching
@Mapper
public interface ClassifyMapper {

//    得到所有分类
    @Select("select * from classify_")
    List<Classify> getAllClassify();

//    删除分类
    @Delete("delete from classify_ where classify_name = #{classifyName}")
    Integer deleteClassify(String classifyName);

//    添加分类
    @Insert("insert into classify_ (classify_name) values(#{classifyName})")
    Integer addClassify(String classifyName);

//    修改分类
    @Update("update classify_ set classify_name = #{classifyName} where classify_id = #{classifyId}")
    Integer updateClassify(Integer classifyId,String classifyName);

}
