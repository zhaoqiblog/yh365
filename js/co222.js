// var url_main = "http://ycloud-api-test.yh-test.com:8080/", //外网
    var url_main="http://ycloud-api.yonghui.cn:9999/",
    url_workList = url_main + "isp/api/v1/protected/workOrderList", //获取故障工单
    url_menu = url_main + "upm/api/v1/protected/user/grantMenu", //获取左侧菜单
    url_workListDetail = url_main + "isp/api/v1/protected/workOrderList/", //获取故障工单详情
    url_national_situation = url_main + "isp/api/v1/protected/workOrder/statistics/all", //获取全国概况
    url_office_map = url_main + "isp/api/v1/protected/officeMaps", //获取地图数据
    url_area = url_main + "isp/api/v1/protected/officeMap", //获取地图区域数据
    url_get_article = url_main + "isp/api/v1/protected/posts", //获取小知识列表
    url_creat_article = url_main + "isp/api/v1/protected/article", //创建小知识
    url_get_common_param = url_main + "isp/api/v1/protected/baseparam", //获取基础参数
    url_itcoach_manageshop = url_main + "isp/api/v1/protected/officeMap/it", //it教练负责门店
    url_workList_export = url_main + "isp/api/v1/protected/workOrderList/export", //导出故障工单
    url_itcoach_alertshop = url_main + "isp/api/v1/protected/officeMap/allotUser", //it教练分配门店
    url_get_allshop = url_main + "isp/api/v1/protected/officeMap/tree", //获取全部门店
    url_get_enumeration = url_main + "isp/api/v1/public/enumeration/enumAll/-1", //获取下拉框枚举值
    url_getarticle_category = url_main + "isp/api/v1/protected/categorys/tree",//获取知识分类
    url_option_category=url_main+"isp/api/v1/protected/categorys",//更删改知识分类
    url_get_banner=url_main+"isp/api/v1/protected/banners";//首页banner获取
var effective_day = 1;
var token = getCookie('token');
//console.log(window.location.pathname)


function relogin() {
    if (token == undefined) {
        window.location.href = '../login/login.html';
    }
}

$('.username').text(getCookie('username'));
headers = {
        'Authorization': "bearer " + token,
        'X-Requested-With': "XMLHttpRequest"
    }
    // 登录
var login = function() {
        $('#login').click(function() {
            var pwd = $.trim($('.password').val());
            var username = $.trim($('.username').val());
            var rememberMe = '';
            var param = {
                username: username,
                password: pwd,
                rememberMe: 'false'
            }
            if ($('.remember-pwd').prop("checked")) {
                effective_day = 30;
                setCookie('username', username, effective_day);
                setCookie('password', pwd, effective_day);
                param.rememberMe = 'true';
            } else {
                setCookie('username', username, effective_day);
                setCookie('password', pwd, effective_day);
                param.rememberMe = 'false';
            }

            if ('' === username) {
                $('.tip').html('<i class="error-tip inline-block">!</i>请输入账号');
            } else if ('' === pwd) {
                $('.tip').html('<i class="error-tip inline-block">!</i>请输入密码');
            } else {
                $.ajax({
                    url: url_main + "security/api/v1/public/auth/token",
                    type: 'post',
                    data: JSON.stringify(param),
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    success: function(data) {
                        if (data.success !== false) {
                            setCookie('token', data.data.access_token, effective_day);
                            window.location.href = '../index/index.html';
                            getMenu();
                        } else {
                            $('.tip').html('<i class="error-tip inline-block">!</i>' + data.message);

                        }

                    }
                })
            }
        });
        $('body').on('keydown', function() {
            if (event.keyCode === 13) {
                $('button').trigger('click');
            }
        });
    }
    // 登出
var logout = function() {
        $('#logout').click(function() {
            var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            if (keys) {
                for (var i = keys.length; i--;)
                    document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() + ';path=' + '/;';
                window.location.href = "../login/login.html";
            }
        });

    }
    // 获取菜单  id为当前页面的parentId
var getMenu = function() {
    $.ajax({
        url: url_menu,
        type: 'get',
        dataType: 'json',
        headers: headers,
        success: function(data) {
        	console.log(data[0].children)
        	setCookie("leftList",JSON.stringify(data[0].children),30);
        	
        }
    })
}
var getLeft =  function(parentId,id) {
	
	var Lefts =getCookie("leftList");console.log(Lefts);
	document.getElementById("menuTree").innerHTML = forTree(Lefts,parentId,id);
    menuTree();
}
var str = "";
var forTree = function(o,parentId,id) {
	if(o.length>0){
		console.log(parentId);
	        for (var i = 0; i < o.length; i++) {
	            var urlstr = "";
	            try {
	                if (typeof o[i]["id"] == "undefined") {
	                    urlstr = "<div><span>" + o[i]["text"] + "</span><ul>";
	                } else {
	                    urlstr = "<div><span class='"+(id==o[i].id?'menu-span active':'menu-span')+"' id='"+o[i].id+"'><a class='menu-a inline-block' href=" + o[i].data.url + ">" + o[i]["text"] + "</a>"+
	                    "</span><ul class='"+(parentId ==o[i].id ?'active':'')+"'>"
	                }
	                str += urlstr;
	                if (o[i]["children"].length>0) {
	                    forTree(o[i]["children"],parentId,id);
	                }
	                str += "</ul></div>";
	            } catch (e) {}
	        }
	        return str;
        }
    }
    //给有子对象的元素加[+-]
var menuTree = function() {
    $("#menuTree ul").each(function(index, element) {
        var ulContent = $(element).html();

        var spanContent = $(element).siblings("span").html();
        if (ulContent) {
            $(element).siblings("span").html("＋" + spanContent)
        }
    });
    $("#menuTree").find("div span").click(function() {
        var ul = $(this).siblings("ul");
        var spanStr = $(this).html();
        $(this).css({ 'background-color': '#42485b' });
        var spanContent = spanStr.substr(1, spanStr.length);
        if (ul.find("div").html() != null) {
            if (ul.css("display") == "none") {
                ul.show(300);
                $(this).html("&ndash;" + spanContent);
            } else {
                ul.hide(300);
                $(this).html("＋" + spanContent);
            }
        }
    })
};
var curMenu = function() {
    $('.nav-menu span').click(function() {
        alert(112);
        console.log($(this).html())
    });
}
function leftStatus (id) {
	
}
function stopPropagation(e) {
    if (e.stopPropagation)
        e.stopPropagation();
    else
        e.cancelBubble = true;
}
// 请求成功后提示框
function showOkPop(mesg) {
    $('.pop').show();
    $('.pop-cont').css({ 'background': '#0dcb9c', 'color': '#fff' });
    $('.pop-cont').html('<span class="i-ok inline-block"></span>' + mesg);
    setTimeout(function() {
        $(".pop").hide();
        location.reload();
    }, 1000)
}
// 请求成功后报错提示框
function showErrorPop(mesg) {
    $('#deleteModal').modal('hide');
    $('.pop').show();
    $('.pop-cont').css({ 'background': '#df6060', 'color': '#fff' });
    $('.pop-cont').html('<span class="i-no inline-block"></span>' + mesg);
    setTimeout(function() {
        $(".pop").hide();
    }, 1000)
}
//请求失败提示框
function showError() {
    $('.pop').show();
    $('.pop-cont').css({ 'background': '#df6060', 'color': '#fff' });
    $('.pop-cont').html('<span class="i-no inline-block"></span>不好意思，服务器开小差了，添加分类失败，请稍后再试');
    setTimeout(function() {
        $(".pop").hide();
    }, 1000)

}
/*start 读取cookie*/
function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ';path=' + '/;'
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

