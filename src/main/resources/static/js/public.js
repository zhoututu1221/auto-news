$(function(){

    //获取分类参数
    var classify = GetQueryString("classify");
    //分页
    var start = 0;
    var count = 10;
    //新闻总数量
    var newsCount = 0;

    //获取所有分类
    $.ajax({
        url: "/api/getAllClassify",
        type: 'POST',
        data: {

        },
        success: function(result){

            var data = "";

            for (var i = 0;i < result.length;i++){
                data += '<li><a href="index.html?classify='+encodeURI(result[i].classify_name)+'" class="">'+result[i].classify_name+'</a></li>';
            }

            $(".header-board-nav").eq(0).html(data);

            if(classify == null || classify == ""){
                classify = result[0].classify_name;
                $(".header-board-nav li a").eq(0).addClass("select-header-board-nav");
            }else {
                for (var i = 0;i < $(".header-board-nav li a").length;i++){
                    if(classify == $(".header-board-nav li a").eq(i).html()){
                        $(".header-board-nav li a").eq(i).addClass("select-header-board-nav");
                    }else {
                        continue;
                    }
                }
            }

            $('.news-hint font').eq(0).html(classify);

        //    获取该分类下新闻的数量
            $.ajax({
                url: "/api/getClassifyNewsCount",
                type: 'POST',
                data: {
                    newsClassify: classify,
                },
                success: function(result){
                    newsCount = result;
                    $(".news-hint label").eq(0).html("共计"+result+"篇文章");

                    //    获取文章
                    getNews(newsCount,classify,start,count);

                },
                error:function(e){
                    console.log(e.status);
                }
            });



        },
        error:function(e){
            console.log(e.status);
        }
    });

    var searchContent = "";
    var searchStart = 0;
    var searchCount = 10;

//    搜索新闻
    $(".search-button").eq(0).click(function () {
        if($(".search-input").eq(0).val() == ""){
            alert("请输入查询内容");
        }else {
            searchStart = 0;
            searchContent = $(".search-input").eq(0).val();
            for(var i = $(".list li").length;i >= 0;i--){
                $(".list li").eq(i).remove();
            }
            getSearchNews(searchContent,searchStart,searchCount);
        }
    });


//    判断是否滑动到底部
    $(window).scroll(function(){
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            if(searchContent == ""){
                start += count;
                getNews(newsCount,classify,start,count);
            }else {
                searchStart += searchCount;
                getSearchNews(searchContent,searchStart,searchCount);
            }
        }
    });


//    通过新闻id获取新闻
    var newsId = GetQueryString("newsid");
    if(newsId == "" || newsId == null){

    }else {
        $.ajax({
            url: "/api/getIdNews",
            type: 'POST',
            data: {
                id: newsId,
            },
            success: function(result){

                $(".content-title").eq(0).html(result[0].news_title);
                $(".content-time").eq(0).html(result[0].news_time+" — 作者："+result[0].news_zuozhe+"<br />点击量："+result[0].news_click+"<br />来源："+result[0].news_laiyuan);
                $(".content-text").eq(0).html(result[0].news_content);

            },
            error:function(e){
                console.log(e.status);
            }
        });
    }


});

// 获取地址栏的get参数
//name是要查找的参数名
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

//获取文章
function getNews(newsCount,classify,start,count) {

    $.ajax({
        url: "/api/getClassifyNews",
        type: 'POST',
        data: {
            newsClassify: classify,
            start: start,
            count: count,
        },
        success: function(result){

            var data = "";
            for (var i = 0;i < result.length;i++){
                data += '<li>\n' +
                    '\t\t\t\t<a href="content.html?newsid='+result[i].news_id+'">\n' +
                    '\t\t\t\t\t<font class="list-title">'+result[i].news_title+'<label style="font-size: 12px;margin-left: 20px;color: rgba(0,0,0,0.4)">——'+result[i].news_time+'</label></font>\n' +
                    '\t\t\t\t\t<font class="list-content"></font>\n' +
                    '\t\t\t\t</a>\n' +
                    '\t\t\t</li>';

            }

            if(newsCount <= $(".list li").length){
                $(".footer-hint").eq(0).html("————已经全部加载完毕————");
            }else {
                $(".footer-hint").eq(0).html("————加载更多————");
            }

            $(".footer-hint").eq(0).before(data);


            for (var i = 0;i < result.length;i++){
                var index = start + i;
                $(".list-content").eq(index).text(result[i].news_content);
            }

        },
        error:function(e){
            console.log(e.status);
        }
    });

}

function getSearchNews(searchContent,searchStart,searchCount) {
    var searchNewsCount = 0;
    //    获取搜索到新闻的数量
    $.ajax({
        url: "/api/getSearchNewsCount",
        type: 'POST',
        data: {
            search: searchContent,
        },
        success: function(result){
            searchNewsCount = result;
            $(".news-hint font").eq(0).html("搜索结果");
            $(".news-hint label").eq(0).html("共计"+result+"篇文章");

            //    获取搜索到的新闻
            $.ajax({
                url: "/api/getSearchNews",
                type: 'POST',
                data: {
                    search: searchContent,
                    start: searchStart,
                    count: searchCount,
                },
                success: function(result){

                    var data = "";
                    for (var i = 0;i < result.length;i++){
                        data += '<li>\n' +
                            '\t\t\t\t<a href="content.html?newsid='+result[i].news_id+'">\n' +
                            '\t\t\t\t\t<font class="list-title">'+result[i].news_title+'<label style="font-size: 12px;margin-left: 20px;color: rgba(0,0,0,0.4)">——'+result[i].news_time+'</label></font>\n' +
                            '\t\t\t\t\t<font class="list-content"></font>\n' +
                            '\t\t\t\t</a>\n' +
                            '\t\t\t</li>';

                    }

                    if(searchCount <= $(".list li").length){
                        $(".footer-hint").eq(0).html("————已经全部加载完毕————");
                    }else {
                        $(".footer-hint").eq(0).html("————加载更多————");
                    }

                    $(".footer-hint").eq(0).before(data);


                    for (var i = 0;i < result.length;i++){
                        var index = searchStart + i;
                        $(".list-content").eq(index).text(result[i].news_content);
                    }

                },
                error:function(e){
                    console.log(e.status);
                }
            });

        },
        error:function(e){
            console.log(e.status);
        }
    });
}