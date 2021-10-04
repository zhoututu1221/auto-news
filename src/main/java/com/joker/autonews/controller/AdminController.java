package com.joker.autonews.controller;

import com.joker.autonews.mapper.ClassifyMapper;
import com.joker.autonews.mapper.GatherMapper;
import com.joker.autonews.mapper.NewsMapper;
import com.joker.autonews.mapper.UserMapper;
import com.joker.autonews.pojo.Gather;
import com.joker.autonews.pojo.News;
import com.joker.autonews.tool.GetPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Controller
public class AdminController {


//    Gather_表
    @Autowired
    GatherMapper gatherMapper;
//    添加规则
    @RequestMapping("/addGather")
    @ResponseBody
    public Object addGather(Gather gather){
        return gatherMapper.addGather(gather);
    }
//    根据分类查询规则
    @RequestMapping("/getGather")
    @ResponseBody
    public Object getGather(String gatherClassify){
        if(gatherClassify.equals("") || gatherClassify.equals(null)){
            return "Error-data";
        }else {
            return gatherMapper.getGather(gatherClassify);
        }
    }
//    删除规则
    @RequestMapping("/deleteGather")
    @ResponseBody
    public Object deleteGather(Integer gatherId){
        if(gatherId == null){
            return "Error-data";
        }else {
            return gatherMapper.deleteGather(gatherId);
        }
    }
//    通过分类删除规则
    @RequestMapping("/deleteClassifyGather")
    @ResponseBody
    public Object deleteClassifyGather(String gatherClassify){
        if(gatherClassify.equals("") || gatherClassify.equals(null)){
            return "Error-data";
        }else {
            return gatherMapper.deleteClassifyGather(gatherClassify);
        }
    }
//    修改规则
    @RequestMapping("/updateGather")
    @ResponseBody
    public Object updateGather(Gather gather){
        return gatherMapper.updateGather(gather);
    }



//    user_表
    @Autowired
    UserMapper userMapper;
//    登录
    @RequestMapping("/login")
    @ResponseBody
    public Integer login(HttpSession session, String username, String userpassword){

        if(userMapper.loginUser(username,userpassword) == 0){
            return 0;
        }else {
            session.setAttribute("username",username);
            session.setAttribute("userpassword",userpassword);
            return 1;
        }
    }
//    判断是否登陆,已登录返回1，未登录返回0
    @RequestMapping("/isLogin")
    @ResponseBody
    public Integer isLogin(HttpSession session){
        if(session.getAttribute("username") != null && session.getAttribute("userpassword") != null && !session.getAttribute("username").equals("") && !session.getAttribute("userpassword").equals("")){
            Integer status = login(session,session.getAttribute("username").toString(),session.getAttribute("userpassword").toString());
            return status;
        }else {
            return 0;
        }
    }
//      退出登录，退出成功返回1，失败返回0
    @RequestMapping("/quitLogin")
    @ResponseBody
    public Integer quitLogin(HttpSession session){
        session.removeAttribute("username");
        session.removeAttribute("userpassword");
        if(session.getAttribute("username") != null || session.getAttribute("userpassword") != null){
            return 0;
        }else {
            return 1;
        }
    }


//    News_表
    @Autowired
    NewsMapper newsMapper;
//    分页得到新闻
    @RequestMapping("/getNews")
    @ResponseBody
    public Object getNews(Integer start,Integer count){
        if(start == null || count == null){
            return "Error-data";
        }else {
            return newsMapper.getPageNews(start,count);
        }
    }
//    得到总共有几条新闻
    @RequestMapping("/getNewsCount")
    @ResponseBody
    public Object getNewsCount(){
        return newsMapper.getNewsCount();
    }
//     分页得到模糊搜索的新闻
    @RequestMapping("/getSearchNews")
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
    @RequestMapping("/getSearchNewsCount")
    @ResponseBody
    public Object getSearchNewsCount(String search){
        if(search.equals("")){
            return "error_data";
        }else {
            return newsMapper.getSearchNewsCount(search);
        }
    }
//    添加新闻
    @RequestMapping("/addNews")
    @ResponseBody
    public Object addNews(News news){
        return newsMapper.addNews(news);
    }
//    修改新闻
    @RequestMapping("/updateNews")
    @ResponseBody
    public Object updateNews(News news){
        return newsMapper.updateNews(news);
    }
//    删除新闻
    @RequestMapping("/deleteNews")
    @ResponseBody
    public Object deleteNews(Integer newsId){
        return newsMapper.deleteNews(newsId);
    }
//    通过分类删除新闻
    @RequestMapping("/deleteClassifyNews")
    @ResponseBody
    public Object deleteClassifyNews(String newsClassify){
        if(newsClassify.equals("") || newsClassify.equals(null)){
            return "Error-data";
        }else {
            return newsMapper.deleteClassifyNews(newsClassify);
        }
    }
//    通过id获取新闻
    @RequestMapping("/getIdNews")
    @ResponseBody
    public Object getIdNews(Integer newsId){
        if(newsId == null){
            return "Error-data";
        }else {
            return newsMapper.getIdNews(newsId);
        }
    }


//    Classify_表
    @Autowired
    ClassifyMapper classifyMapper;
//    得到所有分类
    @RequestMapping("/getClassify")
    @ResponseBody
    public Object getClassify(){
        return classifyMapper.getAllClassify();
    }
//    删除分类
    @RequestMapping("/deleteClassify")
    @ResponseBody
    public Object deleteClassify(String classifyName){
        if(classifyName.equals("") || classifyName.equals(null)){
            return "Error-data";
        }else {
            deleteClassifyNews(classifyName);
            deleteClassifyGather(classifyName);
            return classifyMapper.deleteClassify(classifyName);
        }
    }
//    添加分类
    @RequestMapping("/addClassify")
    @ResponseBody
    public Object addClassify(String classifyName){
        if(classifyName.equals("") || classifyName.equals(null)){
            return "Error-data";
        }else {
            Gather gather = new Gather();
            gather.setGather_classify(classifyName);
            addGather(gather);
            return classifyMapper.addClassify(classifyName);
        }
    }
//    修改分类
    @RequestMapping("/updateClassify")
    @ResponseBody
    public Object updateClassify(Integer classifyId,String classifyName){
        if(classifyName.equals("") || classifyName.equals(null) || classifyId == null){
            return "Error-data";
        }else {
            return classifyMapper.updateClassify(classifyId,classifyName);
        }
    }


//    抓取网页一次
    GetPage getPage = new GetPage();

    @RequestMapping("/getOnePage")
    @ResponseBody
    public Object getOnePage(Gather gather){



        startGather(gather.getGather_classify(),2);

        return updateGather(gather);

    }

//    自动抓取网页
    @RequestMapping("/autoGather")
    @ResponseBody
    public Object autoGather(Gather gather){



       startGather(gather.getGather_classify(),1);

        return updateGather(gather);

    }



//    数据采集 mode(0,1,2) 0为全部采集，1为自动采集，2为手动采集一次
    public void startGather(String classify,Integer mode){
        String classifyName = classify;


        if(mode == 0){

        }else if (mode == 1){
            new Thread(){
                @Override
                public void run() {
                    super.run();

                    while (true){
                        String classify = classifyName;

                        List<Gather> gatherList = (List<Gather>) getGather(classify);
                        Gather gather = gatherList.get(0);

                        String data = getPage.getText(gather.getGather_url());
                        String reg = gather.getGather_content_e();
                        Pattern pattern = Pattern.compile(reg);

                        Matcher matcher = pattern.matcher(data);

                        List<String> list = new ArrayList<String>();

                        while (matcher.find()){
                            list.add(matcher.group(1));
                        }

                        List<News> newsInf = new ArrayList<News>();
                        for (int i = 0;i < list.size();i++){
                            String content = getPage.getText(list.get(i));
                            String regTitle = gather.getGather_news_title_e();
                            String regTime = gather.getGather_news_time_e();
                            String regContent = gather.getGather_news_content_e();

                            News news1 = new News();

                            Pattern pattern1 = Pattern.compile(regTitle);
                            Matcher matcher1 = pattern1.matcher(content);
                            if(matcher1.find()){
                                news1.setNews_title(matcher1.group(1));
                            }

                            pattern1 = Pattern.compile(regTime);
                            matcher1 = pattern1.matcher(content);
                            if(matcher1.find()){
                                news1.setNews_time(matcher1.group(1));
                            }

                            pattern1 = Pattern.compile(regContent,Pattern.DOTALL);
                            matcher1 = pattern1.matcher(content);
                            if(matcher1.find()){
                                news1.setNews_content(matcher1.group(1));
                            }

                            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

                            news1.setNews_gTime(simpleDateFormat.format(new Date()));

                            news1.setNews_classify(classify);

                            news1.setNews_zuozhe("新浪官方");

                            news1.setNews_laiyuan(list.get(i));

                            Integer c = new Random().nextInt(999999)%(999999 - 1000 + 1) + 1000;

                            news1.setNews_click(c.toString());

                            System.out.println("采集信息："+news1.getNews_title());
                            if(news1.getNews_content() != null && Integer.parseInt(gather.getGather_click()) < c){
                                newsInf.add(news1);
                            }

                        }

                        for (News n : newsInf){
                            System.out.println("添加信息："+n.getNews_title());
                            if (newsMapper.newsIsExists(n.getNews_title()) == 1) {
                                continue;
                            } else {
                                newsMapper.addNews(n);
                            }

                            try {
                                sleep(500);
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }
                        }

                        try {
                            if(gather.getGather_auto().equals("true")){
                                continue;
                            }else {
                                stop();
                            }
                            Thread.sleep(Integer.parseInt(gather.getGather_news_auto_gap()) * 60000);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }

                }
            }.start();
        }else if(mode == 2){
            new Thread(){
                @Override
                public void run() {
                    super.run();

                    String classify = classifyName;

                    List<Gather> gatherList = (List<Gather>) getGather(classify);
                    Gather gather = gatherList.get(0);

                    String data = getPage.getText(gather.getGather_url());
                    String reg = gather.getGather_content_e();
                    Pattern pattern = Pattern.compile(reg);

                    Matcher matcher = pattern.matcher(data);

                    List<String> list = new ArrayList<String>();

                    while (matcher.find()){
                        list.add(matcher.group(1));
                    }

                    List<News> newsInf = new ArrayList<News>();
                    for (int i = 0;i < list.size();i++){
                        String content = getPage.getText(list.get(i));
                        String regTitle = gather.getGather_news_title_e();
                        String regTime = gather.getGather_news_time_e();
                        String regContent = gather.getGather_news_content_e();

                        News news1 = new News();

                        Pattern pattern1 = Pattern.compile(regTitle);
                        Matcher matcher1 = pattern1.matcher(content);
                        if(matcher1.find()){
                            news1.setNews_title(matcher1.group(1));
                        }

                        pattern1 = Pattern.compile(regTime);
                        matcher1 = pattern1.matcher(content);
                        if(matcher1.find()){
                            news1.setNews_time(matcher1.group(1));
                        }

                        pattern1 = Pattern.compile(regContent,Pattern.DOTALL);
                        matcher1 = pattern1.matcher(content);
                        if(matcher1.find()){
                            news1.setNews_content(matcher1.group(1));
                        }

                        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

                        news1.setNews_gTime(simpleDateFormat.format(new Date()));

                        news1.setNews_classify(classify);

                        news1.setNews_zuozhe("新浪官方");

                        news1.setNews_laiyuan(list.get(i));

                        Integer c = new Random().nextInt(999999)%(999999 - 1000 + 1) + 1000;

                        news1.setNews_click(c.toString());

                        System.out.println("采集信息："+news1.getNews_title());
                        if(news1.getNews_content() != null && Integer.parseInt(gather.getGather_click()) < c){
                            newsInf.add(news1);
                        }

                    }
                    for (News n : newsInf){
                        System.out.println("添加信息："+n.getNews_title());
                        if(newsMapper.newsIsExists(n.getNews_title()) == 1){
                            continue;
                        }else {
                            newsMapper.addNews(n);
                        }
                        try {
                            sleep(500);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }.start();
        }
    }


}
