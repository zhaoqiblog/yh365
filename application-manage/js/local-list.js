$(function(){
	var applications={  //渲染各部分数据
		listData:[],  //列表渲染字段
		topInfo:{},
		detailVersion:[]
	};
	var versions={
		detail:{}
	}
	relogin()  //未登录的话跳转到登录页
var tlp=$("#tpl").html(),tplCom=new jSmart(tlp); //列表页模板
var moduleTop=$("#moduleTop").html(),topInfoCom=new jSmart(moduleTop) //module top详情内容
var moduleList=$("#moduleList").html(),moduleListCom=new jSmart(moduleList) //应用详情下版本列表
var pageNum=$("#pageNum").html(),pageNumCom=new jSmart(pageNum) //应用版本列表分页
//获取应用列表
ajaxs(url_main+"isp/api/v1/protected/appmodules","get","",function(res){
	if(res.success==true){
			applications.listData=res.data;
			var tplRes =tplCom.fetch(applications);
			$("#tpllist").html(tplRes);
	}else{
		layer.msg(res.message,{time: 5000});
	}
})
logout();
$("body").on("click","#newModuleBtn",function(){  //添加新应用
	console.log("上一个：首页")
	$("#backModule").attr("types","new")
	radioVal("#new-module input[name='moduleType']","")
	radioVal("#new-module input[name='showBadge']","false")  //角标默认选中
	checkVal("#new-module select[name='appType'] option","")
	$("#new-module input[name='name']").val("")
	$("#new-module input[name='id']").val("")
	$("#new-module input[name='icon']").val("").prev(".selectImg").find("img").attr("src","")
	$("#new-module input[name='badge']").val("").prev(".selectImg").find("img").attr("src","")
	$("#new-module input[name='moduleFlag']").val("")
	$("#new-module textarea[name='description']").val("")
	$(".detail-cont").hide();
	$("#new-module").parents(".right-cont").find(".table-cont").hide().end().end().show();
}).on("click","#backModule",function(){  //新增新应用返回
	console.log("新增应用==》首页")
	if($(this).attr("types")=="new"){
		$(".detail-cont").hide();
		$("#new-module").parents(".right-cont").find(".table-cont").show().end().end().hide();
	}else{
		$(".detail-cont").hide();
		$("#new-module").parents(".right-cont").find("#moduleDetail").show().end().end().hide();
	}
}).on("click","#nationCont dt",function(){  //应用列表点击去应用详情页
	console.log("首页==》详情")
	var thisId=$(this).attr("onlyId");
	getApplicationDetail(thisId,function(res){
//		console.log(res)
		applications.topInfo=res.data;
		applications.detailVersion=res.data.appVersions;
		var moduleInfoRes =topInfoCom.fetch(applications);
		var moduleListRes =moduleListCom.fetch(applications);
//		var moduleListRes =pageNumCom.fetch(applications);
		$("#moduleTmp").html(moduleInfoRes);
		$("#person-list").html(moduleListRes);
		$("#detail-cont").hide();
		$("#moduleDetail").parents(".right-cont").find(".table-cont").hide().end().end().show();
		$("#toNewVersion").attr("moduleId",res.data.id)
		
		if(res.data.moduleType.code=="1"||res.data.moduleType.code=="2"){
			console.log(res.data.moduleType)
			$("#moduleDetail .detail-module-list").hide()
		}else{
			$("#moduleDetail .detail-module-list").show()
		}
	})
}).on("click","#detailToEdit",function(){   //应用详情点击去应用/模块编辑
	console.log("应用详情=》应用编辑")
	$("#backModule").attr("types","edit")
	var thisId=$(this).attr("onlyId"),isEdit=$("#backModule").attr("types")=="edit"?true:false;
	$("#new-module input[name='id']").val(thisId)
	if(isEdit){
		getApplicationDetail(thisId,function(res){
			radioVal("#new-module input[name='showBadge']",res.data.showBadge.code)
			checkVal("#new-module select[name='appType'] option",res.data.appType.code)
			radioVal("#new-module input[name='moduleType']",res.data.moduleType.code)
			$("#new-module input[name='name']").val(res.data.name)
			$("#new-module input[name='icon']").val(res.data.icon).prev(".selectImg").find("img").attr("src",res.data.icon)
			$("#new-module input[name='badge']").val(res.data.badge).prev(".selectImg").find("img").attr("src",res.data.badge)
			$("#new-module input[name='moduleFlag']").val(res.data.moduleFlag)
			$("#new-module textarea[name='description']").val(res.data.description)
			$(".detail-cont").hide();
			$("#new-module").parents(".right-cont").find(".table-cont").hide().end().end().show();
			if(res.data.moduleType.code =="1"){
			     $("#isApp").hide().find("input").attr("disabled","disabled")
			     $("#isLink").show().find("input").removeAttr("disabled")
			}else{
			     $("#isApp").show().find("input").removeAttr("disabled")
			     $("#isLink").hide().find("input").attr("disabled","disabled")
			}
		})
	}
})
.on("click","#detailToList",function(){  //  应用详情页去列表页
	console.log("应用详情==》首页")
	window.location.reload()
//			$(".detail-cont").hide();
//			$("#moduleDetail").hide().parents(".right-cont").find(".table-cont").show();
	
}).on("click",".toVersionDetail",function(){  //去版本详情页
	console.log("应用详情==》版本详情")
	var verId=$(this).attr("versionId");
	getVersionInfo(verId,function(res){
		var verDetail=$("#verDetail").html(),verDetailCom=new jSmart(verDetail)
		versions.detail=res.data;
		verDetailRes=verDetailCom.fetch(versions);
		$("#version-detail").html(verDetailRes);
	})
	$(".detail-cont").hide();
	$("#moduleDetail").hide().parents(".right-cont").find("#detail-version").show();
}).on("click","#verDetailToVerList",function(){ //版本详情返回到版本列表
	console.log("版本详情==》应用详情")
	$(".detail-cont").hide();
	$("#detail-version").hide().parents(".right-cont").find("#moduleDetail").show();
})
.on("click","#submitApp",function(){   //新增/编辑应用提交
	var data= $("#appForm").serializeArray()
	var obj={},isEdit=$("#backModule").attr("types")=="edit"?true:false;
	function cheInput(){
		var isTrue=true;
		data.forEach(function(e){
			if(e.value){
				obj[e.name]=e.value
				$("#appForm").find("input[name='"+e.name+"']").parents("li").find(".tip").hide()
				$("#appForm").find("textarea[name='"+e.name+"']").parents("li").find(".tip").hide()
				$("#appForm").find("select[name='"+e.name+"']").parents("li").find(".tip").hide()
			}else{
				if(e.name=="id"||e.name=="badge"){
					
				}else{
					$("#appForm").find("input[name='"+e.name+"']").parents("li").find(".tip").show()
					$("#appForm").find("textarea[name='"+e.name+"']").parents("li").find(".tip").show()
					$("#appForm").find("select[name='"+e.name+"']").parents("li").find(".tip").show()
					isTrue=false
					return false;
				}
			}
		})
		return isTrue
	}
	function checkRadio(){
		var isTrue=true;
		console.log(obj)
		if(!obj.hasOwnProperty("moduleType")){
			console.log("mo")
			$("#appForm").find("input[name='moduleType']").parents("li").find(".tip").show();
			isTrue=false;
			return false;
		}else{console.log("yes")
			$("#appForm").find("input[name='moduleType']").parents("li").find(".tip").hide();
		}
//		if(!obj.hasOwnProperty("showBadge")){
//			$("#appForm").find("input[name='showBadge']").parents("li").find(".tip").show();
//			isTrue=false;
//			return false;
//		}else{
//			$("#appForm").find("input[name='showBadge']").parents("li").find(".tip").hide();
//		}
		return isTrue
	}
var checkinput=cheInput(),checkRadio = checkRadio()
//console.log(checkRadio,checkinput)
	if(isEdit){
		if(checkinput&&checkRadio&&obj.id!==""){
			console.log("编辑");
			ajaxs(url_main+"isp/api/v1/protected/updatemodules","post",JSON.stringify(obj),function(res){
				 getAppList()
				$(".detail-cont").hide();
				$("#new-module").hide().parents(".right-cont").find(".table-cont").show();
			})
		}else{
			return;
		}
	}else{
		
		if(checkinput&&checkRadio){ 
			console.log("新增")
			ajaxs(url_main+"isp/api/v1/protected/appmodules","post",JSON.stringify(obj),function(res){
				 getAppList()
				$(".detail-cont").hide();
				$("#new-module").hide().parents(".right-cont").find(".table-cont").show();
			})
		}else{return;}

	}
}).on("click","#deleteModule",function(){  //删除应用
	ajaxs(url_main+"isp/api/v1/protected/appmodules?moduleIds="+$(this).attr("onlyId"),"DELETE","",function(res){
		if(res.success==true){
			ajaxs(url_main+"isp/api/v1/protected/appmodules","get","",function(res){
			if(res.success==true){
				applications.listData=res.data;
				var tplRes =tplCom.fetch(applications);
				$("#tpllist").html(tplRes);
				$(".detail-cont").hide();
				$("#moduleDetail").hide().parents(".right-cont").find(".table-cont").show();
			}else{
				layer.msg(res.message,{time: 5000});
			}
		})
		}else{
			layer.msg(res.message,{time: 5000});
		}
	})
}).on("click","#toNewVersion",function(){  //添加新版本
	console.log("应用详情==》添加新版本")
	$("#subVersion").text("添加版本").removeAttr("edit")
	$("input[name='moduleId']").val($(this).attr("moduleId"))
	$("#new-version input[name='version']").val("")
	$("#new-version textarea[name='description']").val("")
	$("#new-version input[name='file']").val("")
	$("#new-version input[name='fileUrl']").val("").attr("disabled","disabled")
	$("#new-version input[name='md5']").val("").attr("disabled","disabled")
	$("#new-version input[name='versionId']").val("").attr("disabled","disabled")
	$(".detail-cont").hide();
	$("#new-version").show()
}).on("click","#new-version .back",function(){		//添加新版本页面返回至应用详情页
	console.log("添加新版本==》应用详情")
	$(".detail-cont").hide();
	$("#new-version").hide().parents(".right-cont").find("#moduleDetail").show();
	return false;
}).on("click","#subVersion",function(){    //版本新增/修改提交
	var _this=$(this)
var data = $("#newVersion").serializeArray(),obj={};
	function cheInputs(){
		var isTrue=true;
			data.forEach(function(e){
				if(e.value){
					obj[e.name]=e.value
					$("#new-version").find("input[name='"+e.name+"']").parents("li").find(".tip").hide()
					$("#new-version").find("textarea[name='"+e.name+"']").parents("li").find(".tip").hide()
				}else{
					if(e.name=="id"){}else{
						$("#new-version").find("input[name='"+e.name+"']").parents("li").find(".tip").show()
						$("#new-version").find("textarea[name='"+e.name+"']").parents("li").find(".tip").show()
						isTrue=false
						return false;
					}
				}
			})
			
		if(!$("#new-version").find("input[name='file']").val()&&!_this.attr("edit")==true){
			$("#new-version").find("input[name='file']").parents("li").find(".tip").show();
			isTrue=false;			return false;

		}else{
			$("#new-version").find("input[name='file']").parents("li").find(".tip").hide();
		}
		return isTrue
	}
	if(_this.attr("edit")&&cheInputs()){
		console.log("edit")
		$.ajax({
		    url: url_main+"isp/api/v1/protected/updateVersions",
		    type: 'POST',
		    cache: false,
		    headers:headers,
		    data: new FormData($('#newVersion')[0]),
		    processData: false,
		    contentType: false
		}).done(function(res) {
			if(res.success==true){
				getApplicationDetail($("#detailToEdit").attr("onlyId"),function(res){
					applications.topInfo=res.data;
					applications.detailVersion=res.data.appVersions;
					var moduleInfoRes =topInfoCom.fetch(applications);
					var moduleListRes =moduleListCom.fetch(applications);
					$("#moduleTmp").html(moduleInfoRes);
					$("#person-list").html(moduleListRes);
					$(".detail-cont").hide();
					$("#new-version").hide().parents(".right-cont").find("#moduleDetail").show();
//					$("#toNewVersion").attr("moduleId",res.data.id)
				})
				
			}else{
				layer.msg(res.message,{time: 5000});
			}
		}).fail(function(res) {
			layer.msg(res)
		});
	}else if(cheInputs()){   //新增
		console.log("new")
		$.ajax({
		    url: url_main+"isp/api/v1/protected/appVersions",
		    type: 'POST',
		    cache: false,
		    headers:headers,
		    data: new FormData($('#newVersion')[0]),
		    processData: false,
		    contentType: false
		}).done(function(res) {
			if(res.success==true){
				getApplicationDetail($("#detailToEdit").attr("onlyId"),function(res){
					applications.topInfo=res.data;
					applications.detailVersion=res.data.appVersions;
					var moduleInfoRes =topInfoCom.fetch(applications);
					var moduleListRes =moduleListCom.fetch(applications);
					$("#moduleTmp").html(moduleInfoRes);
					$("#person-list").html(moduleListRes);
					$(".detail-cont").hide();
					$("#new-version").hide().parents(".right-cont").find("#moduleDetail").show();
//					$("#toNewVersion").attr("moduleId",res.data.id)
				})
			}else{
				layer.msg(res.message,{time: 5000});
			}
		}).fail(function(res) {
			layer.msg(res)
		});
	}
	event.preventDefault();
	return false;
}).on("click",".toEditVersion",function(){   //应用详情页去到版本编辑页
	console.log("应用详情==》版本编辑页")
	$("#subVersion").text("确认修改").attr("edit",true)
	getVersionInfo($(this).attr("versionId"),function(res){
		console.log(res.data)
		$("#toNewVersion").attr("moduleId",res.data.id)
		$("#new-version input[name='version']").val(res.data.version)
		$("#new-version textarea[name='description']").val(res.data.description)
		$("#new-version input[name='moduleId']").val(res.data.moduleId)
		$("#new-version input[name='fileUrl']").val(res.data.file).removeAttr("disabled")
		$("#new-version input[name='md5']").val(res.data.md5).removeAttr("disabled")
		$("#new-version input[name='versionId']").val(res.data.id).removeAttr("disabled")
		$(".detail-cont").hide();
		$("#new-version").show().parents(".right-cont").find("#moduleDetail").hide();
	})
	
//	return false;
}).on("change",".modu",function(){
	var selectedvalue = $("input[name='moduleType']:checked").val();
// alert($selectedvalue);
	if(selectedvalue =="1"){
	     $("#isApp").hide().find("input").attr("disabled","disabled")
	     $("#isLink").show().find("input").removeAttr("disabled")
	}else{
	     $("#isApp").show().find("input").removeAttr("disabled")
	     $("#isLink").hide().find("input").attr("disabled","disabled")
	}
}).on("click",".deleteVersion",function(){   //删除版本
	var moduleId=$("#toNewVersion").attr("moduleId"),versionId=$(this).attr("versionId")
	ajaxs(url_main+"isp/api/v1/protected/appVersions?moduleId="+moduleId+"&versionIds="+versionId,"DELETE","",function(res){
		if(res.success==true){
			layer.msg("删除成功！",{time:1000},function(){
				console.log("kkk")//删除版本之后回到应用详情页
				getApplicationDetail($("#toNewVersion").attr("moduleId"),function(res){
					applications.topInfo=res.data;
					applications.detailVersion=res.data.appVersions;
					var moduleInfoRes =topInfoCom.fetch(applications);
					var moduleListRes =moduleListCom.fetch(applications);
					$("#moduleTmp").html(moduleInfoRes);
					$("#person-list").html(moduleListRes);
					$("#toNewVersion").attr("moduleId",res.data.id)
				})
			});
		}else{
			layer.msg("删除失败，请联系管理员！",{time: 5000});
		}
	})
})
//获取应用列表
function getAppList(){
	ajaxs(url_main+"isp/api/v1/protected/appmodules","get","",function(res){
		if(res.success==true){
				applications.listData=res.data;
				var tplRes =tplCom.fetch(applications);
				$("#tpllist").html(tplRes);
		}else{
			layer.msg(res.message,{time: 5000});
		}
	})
}
//获取应用详情
function getApplicationDetail(datasDetail,callback){
	ajaxs(url_main+"isp/api/v1/protected/appmodules/"+datasDetail,"get","",function(res){
		if(res.success==true){
			callback(res)
		}else{
			layer.msg(res.message,{time: 5000});
		}
	})
}

//获取版本详情
function getVersionInfo(versionId,callback){
	ajaxs(url_main+"isp/api/v1/protected/appVersions/"+versionId,"get","",function(res){
		if(res.success==true){
			callback(res);
		}else{
			layer.msg(res.message,{time: 5000});
		}
	})
}
	
	function getBase64Image(img) {  
	    var canvas = document.createElement("canvas");  
	    var width = img.width;  
	    var height = img.height;  
	    // calculate the width and height, constraining the proportions   
	    if(width > height) {  
	        if(width > 100) {  
	            height = Math.round(height *= 100 / width);  
	            width = 100;  
	        }  
	    } else {  
	        if(height > 100) {  
	            width = Math.round(width *= 100 / height);  
	            height = 100;  
	    	}  
    	}
	}
	var iconDatas={},iconImgInfo={}
	var badgeDatas={},badgeImgInfo={}
	baseImgs(iconDatas,iconImgInfo,"iconInput","iconImg")
	baseImgs(badgeDatas,badgeImgInfo,"badgeInput","badgeImg")
	 function baseImgs(iconDatas,iconImgInfo,inputId,imgId) {
		var fileInput = document.getElementById(inputId);
		fileInput.onchange = function() {
			var file = fileInput.files[0];
			var mpImg = new MegaPixImage(file);
			if (fileInput.files && file) {  
                 var img = new Image;  
                img.onload = function(){  
                    iconImgInfo.imgWidth=img.width;
					iconImgInfo.imgHeight=img.height;
                };  
                img.src=window.URL.createObjectURL(file);  
            }   
			iconDatas.originalFilename=file.name;
			iconDatas.size=file.size;
			iconDatas.contentType=file.type;
			var resImg = document.getElementById(imgId);
			mpImg.render(resImg, { maxWidth: iconImgInfo.imgWidth, maxHeight: iconImgInfo.imgHeight,quality: 1},function(){
				console.log($(resImg).attr("src"))
				uploadFile(resImg)
			});
		};
	};
		var headerss = {
        'Authorization': "bearer " + token,
        'X-Requested-With': "XMLHttpRequest",
        "Content-Type":"application/json",
	}
	function uploadFile(/*iconDatas,*/elementid) {  //elementId传 "#lklj"
		var imgSrc=$(elementid).attr('src');
		var first=imgSrc.indexOf('base64,');
//		iconDatas.image=imgSrc.substring(first+7);
		var basess=imgSrc.substring(first+7);
		if(first==-1){
			layer.msg("请先选择要上传的图片！",{time:2000})
		}else{
			$.ajax({
				url : url_main+"isp/api/v1/protected/commonUtils/uploadPhoto",
				type : "POST",
				data : JSON.stringify({"photoBase64":basess}),
				headers:headerss,
				dataType:'json',
				cache : false,
				success : function(data) {
					$(elementid).attr("src",data.data).parent(".selectImg").next().val(data.data)
					layer.msg("上传成功",{time: 1500});
				},
				error : function(e) {
					layer.msg("网络错误,上传失败,请重试！！",{time: 3000});
				}
			});
		}
	}
	//单选按钮赋值
	function radioVal(elements,res){
		for(var i= 0;i<$(elements).length;i++){
			if($(elements).eq(i).val()==res){
				$(elements).eq(i).attr("checked",true)
			}else{
				$(elements).eq(i).attr("checked",false)
			}
		}
	}
//	复选按钮赋值
function checkVal(elements,res){
	for(var i= 0;i<$(elements).length;i++){
			if($(elements).eq(i).val()==res){
				$(elements).eq(i).prop("selected",true)
			}else{
				$(elements).eq(i).prop("selected",false)
			}
		}
}
	/*$(".up").on("click",function(){
		if($(this).attr("isIcon")==1){
			uploadFile(iconDatas,"#iconImg")
		}else{
			uploadFile(badgeDatas,"#badgeImg")
		}
		
	})*/
})

