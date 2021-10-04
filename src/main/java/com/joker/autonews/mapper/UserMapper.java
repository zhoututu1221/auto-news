package com.joker.autonews.mapper;

import com.joker.autonews.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.cache.annotation.EnableCaching;

import java.util.List;

@EnableCaching
@Mapper
public interface UserMapper {

//    登录功能
    @Select("select count(*) from user_ where user_name = #{userName} and user_password = #{userPassword}")
    Integer loginUser(String userName,String userPassword);

}
