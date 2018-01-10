
// var url_main = "http://ycloud-api-test.yh-test.com:8080/", //外网
//  var url_login="http://ycloud-api.yonghui.cn:9999/";
//  var url_main="http://ycloud-api.yonghui.cn:9999/";

var host = window.location.host;
var proto = window.location.protocol;
    var url_login="http://ycloud-api-test.yh-test.com:8080/";
//  var url_login=proto+"//"+window.location.host+"/";  //正式或测试环境
//  var url_main=proto+"//"+window.location.host+"/",   //正式或测试环境
    var url_main="http://ycloud-api-test.yh-test.com:8080/", //本地环境

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
    url_get_stealRecord= url_main+ "isp/api/v1/protected/reportStealRecord"; // 获取内外盗记录
var effective_day = 1;
var storages = $(window)[0].localStorage;
var token = getCookie('token');
//console.log(window.location.pathname)
// relogin()
//logout()
function relogin() {

    if (!token) {
        window.location.href = '../login/login.html';
    }
}
$(function(){
	$('.username').text(getCookie('username'));
})

var headers = {
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
//              setCookie('password', pwd, effective_day);
                param.rememberMe = 'true';
            } else {
                setCookie('username', username, effective_day);
//              setCookie('password', pwd, effective_day);
                param.rememberMe = 'false';
            }

            if ('' === username) {
                $('.tip').html('<i class="error-tip inline-block">!</i>请输入账号');
            } else if ('' === pwd) {
                $('.tip').html('<i class="error-tip inline-block">!</i>请输入密码');
            } else {
            	
                $.ajax({
                    url: url_login + "security/api/v1/public/auth/token", 
                    type: 'post',
                    data: JSON.stringify(param),
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    dataType:'json',
                    success: function(data) {
        	console.log("ppp")
                    	
                        if (data.success==true) {
                            setCookie('token', data.data.access_token, effective_day);
                            getLeftList ();
                        } else {
                            $('.tip').html('<i class="error-tip inline-block">!</i>' + data.message);
                        }

                    },
                    error:function(re){
                    	console.log(re)
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
    function getLeftList () {
    	var token = getCookie('token');
    	var headers = {
	        'Authorization': "bearer " + token,
	        'X-Requested-With': "XMLHttpRequest"
	    }
    	$.ajax({
	        url: url_menu,
	        type: 'get',
	        dataType: 'json',
	        headers: headers,
	        success: function(data) {
	        	if(data.success==true){
//	        		console.log(data.data)
		        	storages.setItem("leftList",JSON.stringify(data.data[0].children));
		        	window.location.href = '../index/index.html';
	        	}else{
	        		layer.msg(data.message,{time: 5000});
	        	}
	        	
	        }
	    })
    }
var getMenu = function(parentId,id) {
    if(storages.leftList&&getCookie('username')){
//  	console.log(JSON.parse(storages.leftList));
        $("#menuTree").html(forTree(JSON.parse(storages.leftList),parentId,id));
    	 menuTree();
    }else{
    	$.ajax({
        url: url_menu,
        type: 'get',
        dataType: 'json',
        headers: headers,
        success: function(data) {
    		if(data.success==true){
//      		console.log(data.data)
	        	storages.setItem("leftList",JSON.stringify(data.data[0].children));
	        	window.location.href = '../index/index.html';
        	}else{
        		layer.msg(data.message,{time: 5000});
        	}
        }
    })
    }
};

var str = "";
var forTree = function(o,parentId,id) {
	if(o.length>0){
//		console.log(parentId);
	        for (var i = 0; i < o.length; i++) {
	            var urlstr = "";
	            try {
	                if (typeof o[i]["id"] == "undefined") {
	                    urlstr = "<div><span>" + o[i]["text"] + "</span><ul>";
	                } else {
	                    urlstr = "<div><span class='"+(id==o[i].id?'menu-span active clearfix':'menu-span clearfix')+"' id='"+o[i].id+"'><a class='menu-a inline-block' href=" +((o[i].data.url) ? o[i].data.url : 'javascript:void(0)')  + ">" + o[i]["text"] + "</a>"+
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
            $(element).siblings("span").html(spanContent+"<i class='fr'><img src='../images/right.png' /></i>")
        }
        if($(element).css("display")=="block"){
        	$(element).prev("span").find("i").find("img").attr("src","../images/bottom-array.png")
        }
    });
    $("#menuTree").find("div span").click(function() {
        var ul = $(this).siblings("ul");
        var spanStr = $(this).html();
//      $(this).css({ 'background-color': '#42485b' });
//      var spanContent = spanStr.substr(1, spanStr.length);
        var spanContent = spanStr
        if (ul.find("div").html() != null) {
            if (ul.css("display") == "none") {
                ul.show(300);
                $(this).html(spanContent);
                $(this).html(),$(this).find("i").find("img").attr("src","../images/bottom-array.png")
            } else {
                ul.hide(300);
//              $(this).html("＋" + spanContent);
                $(this).html(spanContent);
                 $(this).html(),$(this).find("i").find("img").attr("src","../images/right.png")
            }
        }
    })
};
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
    $('.pop-cont').css({ 'background': '#0dcb9c', 'color': '#fff'});
    $('.pop-cont').html('<span class="i-ok inline-block"></span>' + mesg);
    setTimeout(function() {
        $(".pop").hide();
        location.reload();
    }, 1000)
}
function showOkPopNew(mesg,callback) {
    $('.pop').show().css({"position":"absolute","top":"45%","left":"50%"});
    $('.pop-cont').css({ 'background': '#27bbff', 'color': '#fff',"display":"inline-block","padding":"15px 25px","border-radius":"7px"});
    $('.pop-cont').html('<span class="i-ok inline-block"><img src="../images/tip_success.png" />&nbsp;&nbsp;</span>' + mesg);
    callback()
    setTimeout(function() {
        $(".pop").hide();
//      location.reload();
    }, 1500)
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
function showErrorNew(msg) {
    $('.pop').show().css({"position":"absolute","top":"45%","left":"50%"});
    $('.pop-cont').css({ 'background': '#df6060', 'color': '#fff',"display":"inline-block","padding":"15px 25px","border-radius":"7px" });
    $('.pop-cont').html('<span class="i-no inline-block"><img src="../images/tip_no.png" />&nbsp;&nbsp;</span>'+msg);
    setTimeout(function() {
        $(".pop").hide();
    }, 1500)

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

//function setStorage(c_name) {
//	storages.setItem(c_name,3);
//}
//分页 ： urls：请求地址 ， types ： 请求类型：post/get
function getpages(urls,types,pages,sizes,datas,callback) {
	if(arguments.length==6){
		var newUrl = urls+"?page="+pages+"&size="+sizes;
		var callback =arguments[5]
	}else{
		var newUrl = urls;
		var callback =arguments[3]
	}
//	console.log(urls,types,pages,sizes,datas,callback)
	$.ajax({
		url:newUrl,
		type:types,
		headers: headers,
		data: datas,
		dataType:'json',
		contentType: 'application/json',
		dataType:'json',
		success:function(res){
//			console.log(res)
			if(res.success==true){
			  laypage({
			    cont: 'pageNumber', //注意，这里的 test1 是 ID，不用加 # 号
			    pages: res.data.totalPages,//总页数
			    groups: 8, // 显示几页
			    skin: '#42a6d4',
			    skip: true,
			    curr: res.data.number,
			    jump:function(x,y){
			    	if (!y) {
//			    		console.log(datas)
			  			getpages(urls,types,x.curr,sizes,datas,callback)
			  		}
			    }
			  });
			  callback(res)
			 }
		}
	})
}

function getdatas (urls,types,pages,sizes,datas,callback){
	$.ajax({
		url:urls,
		type:types,
		headers: headers,
		data: {page:pages,size:sizes},
		contentType: 'application/json',
		dataType:'json',
		success:function(res){
//			var res1 = JSON.stringify(res)
//			res1 = JSON.parse(res)
//			console.log(res)
			if(res.success==true){
			  laypage({
			    cont: 'pageNumber', //注意，这里的 test1 是 ID，不用加 # 号
			    pages: res.data.totalPages,//总页数
			    groups: 8, // 显示几页
			    skin: '#42a6d4',
			    skip: true,
			    curr: res.data.number,
			    jump:function(x,y){
			    	if (!y) {
			  			getdatas(urls,types,x.curr,sizes,datas,callback)
			  		}
			    }
			  });
			  callback(res)
			 }
		},
		error:function(){
			alert("请求出错，请稍后重试")
		}
	})
}

var checkArticle = function() {
        var $thr = $('table thead tr');
        var $checkAll = $thr.find('input');
        var $tbr = $('#person-list tr');
        var $checkAllTh = $('.checkth');
        $('#checkAll').click(function(e) {
            $tbr.find('input').prop('checked', $(this).prop('checked'));
            if ($(this).prop('checked')) {
                $tbr.find('input').parents('tr').addClass('warning');
            } else {
                $tbr.find('input').parents('tr').removeClass('warning');
            }
            stopPropagation(e);
        });
        $('.checkth').click(function() {
            $(this).find('input').click();
        });
        $('#person-list tr').click(function() {
            $(this).find('input').click();
        });
        $tbr.find('input').click(function(e) {
            $(this).parent().parent().toggleClass('warning');
            $checkAll.prop('checked', $tbr.find('input:checked').length == $tbr.length ? true : false);
            stopPropagation(e);
        });
        $tbr.click(function() {
            $(this).find('input').click();
        });
    }

//ajax请求
function ajaxs(urls,type,datas,callback){
	$.ajax({
    	type:type,
		url:urls,
		data:datas,
		headers: headers,
		contentType: 'application/json',
		dataType:'json',
		success:function(res){
			callback(res)
		}
    })
}
//导出excel
function ajaxsExport(urls,type,datas){
	$.ajax({
        url: urls,
        type: type,
        headers: headers,
        data: datas,
        dataType: 'binary',
        responseType: 'arraybuffer',
        processData: false,
        success: function(result) {
//          console.log(result)
            var linkElement = document.createElement('a');
            try {
                var arrayBufferView = new Uint8Array(result);
                var blob = new Blob([arrayBufferView], { type: 'application/vnd.ms-excel' });
                var url = window.URL.createObjectURL(blob);
                linkElement.setAttribute('href', url);
                linkElement.setAttribute("download", 'store_list.xls');
                var clickEvent = new MouseEvent("click", {
                    "view": window,
                    "bubbles": true,
                    "cancelable": false
                });
                linkElement.dispatchEvent(clickEvent);
            } catch (ex) {
//              console.log(ex);
            }
        }
    })
}
//正则校验
var regexpss = {
	phoneReg : function(e){
		var regs = /^1[3|4|5|8][0-9]\d{4,8}$/
		return e ? (regs.test(e)==true ? true : '手机号格式不正确'):'请输入手机号码'
	}
}
//获取多选的值值  elements：下拉列表select
var getSelected = function (elements) {  
    var selectValueStr = [];  
    elements.each(function () {  
        selectValueStr.push($(this).val());  
    });  
    return selectValueStr;  
}

//检验form表单内部数据是否为空
function region(eleid){
	var re=true;
	var arrs=new Array();
	for(var e =0;e<arguments.length;e++){
		if($(arguments[e]).val()==""||$(arguments[e]).val()==null||$(arguments[e]).val()==undefined){
			$(arguments[e]).parents("li").find(".tip").show();
			arrs.push(1)
		}else{
			$(arguments[e]).parents("li").find(".tip").hide();
			arrs.push(2)
		}
	}
	arrs.forEach(function(w){
		if(w==1){
			re=false;
		}
	})
	return re
}
function formReg(array){
	var re=true;
	for(var e =0;e<arguments.length;e++){
		if($(arguments[e]).val()==""||$(arguments[e]).val()==null||$(arguments[e]).val()==undefined){
			$(arguments[e]).parents("li").find(".tip").show();
			re= false;
		}else{
			$(arguments[e]).parents("li").find(".tip").hide();
			re = true;
		}
	}
	return re
}
