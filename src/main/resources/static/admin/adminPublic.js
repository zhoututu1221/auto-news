var editor;
$(function(){

    if($("#editor").length > 0){
        var E = window.wangEditor;
        editor = new E('#editor');
        editor.customConfig.uploadImgShowBase64 = true; // 使用 base64 保存图片
        editor.create();
    }

    //登录
	$(".login-board-login").eq(0).click(function () {
        if($(".login-board-input").eq(0).val() == "" || $(".login-board-input").eq(1).val() == ""){
            alert("请先补全完整");
        }else {
            $.ajax({
                url: "/login",
                type: 'POST',
                data: {
                    username: $(".login-board-input").eq(0).val(),
                    userpassword: $(".login-board-input").eq(1).val(),
                },
                success: function(result){

                    if(result == 1){
                        window.open("/admin/adminIndex.html","_self");
                    }else {
                        alert("账号或密码错误");
                    }

                },
                error:function(e){
                    console.log(e.status);
                }
            });
        }
    });

//	退出登录
    $("#quit-login").click(function () {
        if(confirm("确定退出？")){
            $.ajax({
                url: "/quitLogin",
                type: 'POST',
                data: {
                },
                success: function(result){

                    if(result == 1){
                        window.open("/admin/adminLogin.html","_self");
                    }else {
                        alert("退出失败");
                    }

                },
                error:function(e){
                    console.log(e.status);
                }
            });
        }else {
            return false;
        }
    });


    $(".content-classify-input font").eq(0).click(function () {
        if($(".content-classify-input input").eq(0).val() == ""){
            alert("请输入您要添加的分类");
        }else {
            $.ajax({
                url: "/addClassify",
                type: 'POST',
                data: {
                    classifyName: $(".content-classify-input input").eq(0).val(),
                },
                success: function(result){

                    if(result > 0){
                        window.location.reload();
                    }else {
                        alert("添加失败");
                    }

                },
                error:function(e){
                    console.log(e.status);
                }
            });
        }
    });


//    分类选项改变后重新获取规则
    $(".content-select").eq(0).change(function () {
        getGather($(this).val())
    });


//    adminEdit页面
//    获取全部新闻
    var allStart = 0;
    var allCount = 20;
    var allPageCount = 0;
    var page = 0;
    $.ajax({
        url: "/getNewsCount",
        type: 'POST',
        data: {
        },
        success: function(result){

            allPageCount = result;

            page = Math.ceil(allPageCount / allCount);


        //    设置分页
            setPaging(page,allStart,allCount);


        //    分页获得所有新闻
            getAllNews(allStart,allCount);

        },
        error:function(e){
            console.log(e.status);
        }
    });


//    模糊搜索新闻
    $(".content-function-search font").eq(0).click(function (){
        if($(".content-function-search input").eq(0).val() == ""){
            alert("请输入搜索内容");
        }else {
            $.ajax({
                url: "/getSearchNewsCount",
                type: 'POST',
                data: {
                    search: $(".content-function-search input").eq(0).val(),
                },
                success: function(result){

                    allPageCount = result;

                    page = Math.ceil(allPageCount / allCount);


                    //    设置分页
                    setPaging(page,allStart,allCount);


                    //    分页获得搜索新闻
                    getSearchNews($(".content-function-search input").eq(0).val(),allStart,allCount);

                },
                error:function(e){
                    console.log(e.status);
                }
            });
        }
    });


//    切换页面
    $(".paging").on('click','.paging-select',function () {
        if($(".content-function-search input").eq(0).val() == ""){
            $("#list").html("");
            allStart = ($(this).html() - 1) * allCount;
            setPaging(page,allStart,allCount);
            getAllNews(allStart,allCount);
        }else {
            $("#list").html("");
            allStart = ($(this).html() - 1) * allCount;
            setPaging(page,allStart,allCount);
            getSearchNews($(".content-function-search input").eq(0).val(),allStart,allCount);
        }
    });
    $("#before").click(function () {
        if(((allStart / 10) + 1) <= page){
            if($(".content-function-search input").eq(0).val() == ""){
                $("#list").html("");
                allStart = ((allStart / 10) + 1)*allCount;
                setPaging(page,allStart,allCount);
                getAllNews(allStart,allCount);
            }else {
                $("#list").html("");
                allStart = ((allStart / 10) + 1)*allCount;
                setPaging(page,allStart,allCount);
                getSearchNews($(".content-function-search input").eq(0).val(),allStart,allCount);
            }
        }
    });
    $("#after").click(function () {
        if(((allStart / 10) - 1) >= 0){
            if($(".content-function-search input").eq(0).val() == ""){
                $("#list").html("");
                allStart = ((allStart / 10) - 1)*allCount;
                setPaging(page,allStart,allCount);
                getAllNews(allStart,allCount);
            }else {
                $("#list").html("");
                allStart = ((allStart / 10) - 1)*allCount;
                setPaging(page,allStart,allCount);
                getSearchNews($(".content-function-search input").eq(0).val(),allStart,allCount);
            }
        }
    });


//    添加新闻
    $(".content-function-add").eq(0).click(function () {
        $(".details").eq(0).fadeIn(500);
        $(".details").eq(0).css("display","flex");
        $("#function-title").eq(0).html("添加");
        $("#addNews").fadeIn(200);
        $("#update").fadeOut();
        $("#boardNewsTime").fadeOut();
    });

    $("#addNews").click(function () {
        if($(".content-select option:selected").text() == "" || $("#boardNewsTitle input").val() == "" || editor.txt.html() == "<p><br></p>" || editor.txt.html() == ""){
            alert("请输入完整");
        }else {
            $.ajax({
                url: "/addNews",
                type: 'POST',
                data: {
                    news_classify: $(".content-select option:selected").text(),
                    news_title: $("#boardNewsTitle input").val(),
                    news_content: editor.txt.html(),
                    news_time: setTime(new Date().getTime()),
                },
                success: function(result){

                    if(result > 0){
                        window.location.reload();
                    }else {
                        alert("添加失败");
                    }

                },
                error:function(e){
                    console.log(e.status);
                }
            });
        }
    });


//    更新新闻
    $("#update").click(function () {
        $.ajax({
            url: "/updateNews",
            type: 'POST',
            data: {
                news_id: $("#update").attr("newsid"),
                news_classify: $(".content-select option:selected").text(),
                news_title: $("#boardNewsTitle input").val(),
                news_content: editor.txt.html(),
                news_time: $("#boardNewsTime input").val(),
            },
            success: function(result){

                if(result > 0){
                    window.location.reload();
                }else {
                    alert("修改失败");
                }

            },
            error:function(e){
                console.log(e.status);
            }
        });
    });


//    点击手动采集一次按钮
    $("#manual").click(function () {
        $.ajax({
            url: "/getOnePage",
            type: 'POST',
            data: {
                gather_classify: $(".content-select option:selected").text(),
                gather_url: $(".content-inf label input").eq(0).val(),
                gather_content_e: $(".content-inf label input").eq(1).val(),
                gather_max_page: $(".content-inf label input").eq(2).val(),
                gather_page_e: $(".content-inf label input").eq(3).val(),
                gather_news_title_e: $(".content-inf label input").eq(4).val(),
                gather_news_content_e: $(".content-inf label input").eq(5).val(),
                gather_news_time_e: $(".content-inf label input").eq(6).val(),
                gather_news_auto_gap: $(".content-inf label input").eq(7).val(),
                gather_click: $(".content-inf label input").eq(8).val(),
            },
            success: function(result){
                if(result == 1){
                    alert("已提交");
                    window.location.reload();
                }else {
                    alert("提交失败");
                }
            },
            error:function(e){
                console.log(e.status);
            }
        });
    });

//    点击自动采集按钮
    $("#auto").click(function () {
        var isAuto = "";
        if($("#auto").html() == "自动采集(开)"){
            isAuto = "false";
        }else {
            isAuto = "true";
        }
        $.ajax({
            url: "/autoGather",
            type: 'POST',
            data: {
                gather_classify: $(".content-select option:selected").text(),
                gather_url: $(".content-inf label input").eq(0).val(),
                gather_content_e: $(".content-inf label input").eq(1).val(),
                gather_max_page: $(".content-inf label input").eq(2).val(),
                gather_page_e: $(".content-inf label input").eq(3).val(),
                gather_news_title_e: $(".content-inf label input").eq(4).val(),
                gather_news_content_e: $(".content-inf label input").eq(5).val(),
                gather_news_time_e: $(".content-inf label input").eq(6).val(),
                gather_news_auto_gap: $(".content-inf label input").eq(7).val(),
                gather_auto: isAuto,
                gather_click: $(".content-inf label input").eq(8).val(),
            },
            success: function(result){
                console.log(result);
                if(result == 1){
                    alert("已提交");
                    window.location.reload();
                }else {
                    alert("提交失败");
                }

            },
            error:function(e){
                console.log(e.status);
            }
        });
    });


});

//删除分类
function deleteClassify(classifyName) {
    if (confirm("确认删除？")){
        $.ajax({
            url: "/deleteClassify",
            type: 'POST',
            data: {
                classifyName: classifyName,
            },
            success: function(result){

                if(result > 0){
                    window.location.reload();
                }else {
                    alert("删除失败");
                }

            },
            error:function(e){
                console.log(e.status);
            }
        });
    }else {
        return false;
    }
}


//获取该分类下的规则
function getGather(classify) {
    $.ajax({
        url: "/getGather",
        type: 'POST',
        data: {
            gatherClassify: classify,
        },
        success: function(result){

            $(".content-inf label input").eq(0).val(result[0].gather_url);
            $(".content-inf label input").eq(1).val(result[0].gather_content_e);
            $(".content-inf label input").eq(2).val(result[0].gather_max_page);
            $(".content-inf label input").eq(3).val(result[0].gather_page_e);
            $(".content-inf label input").eq(4).val(result[0].gather_news_title_e);
            $(".content-inf label input").eq(5).val(result[0].gather_news_content_e);
            $(".content-inf label input").eq(6).val(result[0].gather_news_time_e);
            $(".content-inf label input").eq(7).val(result[0].gather_news_auto_gap);
            $(".content-inf label input").eq(8).val(result[0].gather_click);

            if(result[0].gather_auto == null || result[0].gather_auto == "false"){
                $("#auto").html("自动采集(关)");
            }else if(result[0].gather_auto == "true"){
                $("#auto").html("自动采集(开)");
            }else {
                $("#auto").html("自动采集(状态异常)");
            }

        },
        error:function(e){
            console.log(e.status);
        }
    });
}

//分页获得所有新闻
function getAllNews(allStart,allCount) {
    $.ajax({
        url: "/getNews",
        type: 'POST',
        data: {
            start: allStart,
            count: allCount,
        },
        success: function(result){

            var data = "";

            for (var i = 0;i < result.length;i++){
                data += '<tr>\n' +
                    '\t\t\t\t\t<td>'+result[i].news_id+'</td>\n' +
                    '\t\t\t\t\t<td>'+result[i].news_classify+'</td>\n' +
                    '\t\t\t\t\t<td>'+result[i].news_title+'</td>\n' +
                    '\t\t\t\t\t<td>'+result[i].news_zuozhe+'</td>\n' +
                    '\t\t\t\t\t<td><input value="'+result[i].news_laiyuan+'" style="width: 100%;height: 100%;outline: none;border: none;" /></td>\n' +
                    '\t\t\t\t\t<td>'+result[i].news_click+'</td>\n' +
                    '\t\t\t\t\t<td class="list-content"></td>\n' +
                    '\t\t\t\t\t<td>'+result[i].news_time+'</td>\n' +
                    '\t\t\t\t\t<td>'+result[i].news_gTime+'</td>\n' +
                    '\t\t\t\t\t<td>\n' +
                    '\t\t\t\t\t\t<button class="content-list-control" class="edit" type="button" onclick="updateNews(\''+result[i].news_id+'\')">编辑</button>\n' +
                    '\t\t\t\t\t\t<button class="content-list-control" class="delete" type="button" onclick="deleteNews(\''+result[i].news_id+'\')">删除</button>\n' +
                    '\t\t\t\t\t</td>\n' +
                    '\t\t\t\t</tr>';
            }

            $("#list").html(data);

            for(var i = 0;i < $(".list-content").length;i++){
                $(".list-content").eq(i).text(result[i].news_content);
            }

        },
        error:function(e){
            console.log(e.status);
        }
    });
}

//分页获得搜索新闻
function getSearchNews(search,allStart,allCount) {
    $.ajax({
        url: "/getSearchNews",
        type: 'POST',
        data: {
            search: search,
            start: allStart,
            count: allCount,
        },
        success: function(result){

            var data = "";

            for (var i = 0;i < result.length;i++){
                data += '<tr>\n' +
                    '\t\t\t\t\t<td>'+result[i].news_id+'</td>\n' +
                    '\t\t\t\t\t<td>'+result[i].news_classify+'</td>\n' +
                    '\t\t\t\t\t<td>'+result[i].news_title+'</td>\n' +
                    '\t\t\t\t\t<td>'+result[i].news_zuozhe+'</td>\n' +
                    '\t\t\t\t\t<td><input value="'+result[i].news_laiyuan+'" style="width: 100%;height: 100%;outline: none;border: none;" /></td>\n' +
                    '\t\t\t\t\t<td>'+result[i].news_click+'</td>\n' +
                    '\t\t\t\t\t<td class="list-content"></td>\n' +
                    '\t\t\t\t\t<td>'+result[i].news_time+'</td>\n' +
                    '\t\t\t\t\t<td>'+result[i].news_gTime+'</td>\n' +
                    '\t\t\t\t\t<td>\n' +
                    '\t\t\t\t\t\t<button class="content-list-control" class="edit" type="button" onclick="updateNews(\''+result[i].news_id+'\')">编辑</button>\n' +
                    '\t\t\t\t\t\t<button class="content-list-control" class="delete" type="button" onclick="deleteNews(\''+result[i].news_id+'\')">删除</button>\n' +
                    '\t\t\t\t\t</td>\n' +
                    '\t\t\t\t</tr>';
            }

            $("#list").html(data);

            for(var i = 0;i < $(".list-content").length;i++){
                $(".list-content").eq(i).text(result[i].news_content);
            }

        },
        error:function(e){
            console.log(e.status);
        }
    });
}


//    设置分页
function setPaging(page,allStart,allCount) {
    var pageData = "";
    $("#paging-count-select").html("");
    for (var i = 0;i < page;i++){
        if(i == (allStart / allCount)){
            pageData += '<li class="paging-select select-paging">'+(i+1)+'</li>';
        }else {
            pageData += '<li class="paging-select">'+(i+1)+'</li>';
        }
    }
    $("#paging-count-select").html(pageData);
}


//格式化时间
function setTime(time){
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
}


//删除新闻
function deleteNews(newsid) {
    if(confirm("是否删除？")){
        $.ajax({
            url: "/deleteNews",
            type: 'POST',
            data: {
                newsId: newsid,
            },
            success: function(result){

                if(result > 0){
                    window.location.reload();
                }else {
                    alert("删除失败");
                }

            },
            error:function(e){
                console.log(e.status);
            }
        });
    }else {
        return false;
    }
}

//编辑新闻
function updateNews(newsid) {
    $(".details").eq(0).fadeIn(500);
    $(".details").eq(0).css("display","flex");
    $("#function-title").eq(0).html("编辑");
    $("#update").fadeIn(200);
    $("#addNews").fadeOut();
    $.ajax({
        url: "/getIdNews",
        type: 'POST',
        data: {
            newsId: newsid,
        },
        success: function(result){

            for (var i = 0;i < $(".content-select option").length;i++){
                if($(".content-select option").eq(i).text() == result[0].news_classify){
                    $(".content-select option").eq(i).attr("selected","selected");
                }
            }
            $("#boardNewsTitle input").val(result[0].news_title);
            $("#boardNewsTime input").val(result[0].news_time);
            editor.txt.html(result[0].news_content);

            $("#update").attr("newsid",newsid);

        },
        error:function(e){
            console.log(e.status);
        }
    });
}