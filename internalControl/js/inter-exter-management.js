var innerManage = {
	
};
//laypage
var flag = true;
//页面容量
var size = 10;
$(document).ready(function() {
	relogin();
	logout();
	var setting = {
			check: {
				enable: true,
//				chkboxType: {"Y":"", "N":""}
				chkStyle: "radio",
				radioType: "all"
			},
			view: {
				dblClickExpand: false
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				beforeClick: beforeClick,
				onCheck: onCheck
			}
		};
    //获取区域
//  ajaxs(url_main+"isp/api/v1/protected/secondRegionMap","get","",function(res){
	var datass={"type":1}
    	$.ajax({
    	type:"post",
		url:url_main+"isp/api/v1/protected/officeMap/tree",
		data:datass,
		headers: headers,
		dataType:'json',
		success:function(res){
    	if(res.success==true){
    		var options=[];
	    	res.data.forEach(function(it){
	    		options.push({name:it.text,id:it.id,pId:it.parentId,nocheck:true})
	    		it.children.forEach(function(e){
					options.push({name:e.text,id:e.id,pId:e.parentId})
	    		})
	    		$.fn.zTree.init($("#treeDemo"), setting, options);
	    	});
		}else{
			layer.msg(res.message,{time: 5000});
		}
		}
    })
    //获取事件类型
    ajaxs(url_main+"isp/api/v1/public/enumeration/stealRecord/-1","get","",function(res){
    	if(res.success==true && res.data){
    		var eventType1 = $("#eventType").html(),dealType1 = $("#dealType").html();
    		var eventTypeCom = new jSmart(eventType1),dealTypeCom = new jSmart(dealType1);
    		var eventTypeInit=[{code:"",name:"请选择事件类型"}]
    		var dealTypeInit=[{code:"",name:"请选择处理方式"}]
	    	var allType = {
	    		dealType:eventTypeInit.concat(res.data[2].value),
	    		eventType:dealTypeInit.concat(res.data[1].value),
	    	};
	    	var eventRes = eventTypeCom.fetch(allType),dealRes = dealTypeCom.fetch(allType);
	    	$("#eventVal").html(eventRes);$("#dealVal").html(dealRes)
    	}else{
    		layer.msg(res.message,{time: 5000});
    	}
    })
    $("#storeList").on("click",function(){
	   	if(!$("#secondRegionId").val()){
	   		$(this).next(".tip").show()
	   	}else{
	   		
	   	}
	})
    //获取列表
	getpages(url_main + "isp/api/v1/protected/reportStealRecord","get",1,10,"",function(res){
		//模板
		 var tplText = $('#tpl').html(),pageText=$("#pageNum").html();
		   var compiled = new jSmart( tplText ),pageTextCom=new jSmart(pageText);
		   var books = {
		   	content:res.data.content,
		   	allpage:res.data.totalPages,
		   	curr:res.data.number,
		   	size:res.data.size
		   }
		   var res1 = compiled.fetch(books),pageRes=pageTextCom.fetch(books);
		   $("#person-list").html(res1);
		   $("#pagetips").html(pageRes);
	})
	//事件年月初始化
    $('#eventDate').datetimepicker({
        format: 'yyyy-mm',
        language: 'cn',
        clearBtn:true,
        weekStart: 1,
        autoclose: 1,
        startView: 3,
        minView: 3,
        forceParse: 0
    });
     //查看
  $('body').on('click', '.alert-btn', function() {
  	$.ajax({
		type:"get",
		url:url_main+"isp/api/v1/protected/getStealRecord/"+$(this).attr("stealRecordId"),
		headers: headers,
		success:function(res){
			if(res.success==true&&res.data){
				var tplText = $('#detailTep').html();
			    var compiled = new jSmart( tplText );
			    var books = {
			   	    content:res.data
			    }
			    books.content.isBlueEagle = books.content.isBlueEagle == 1 ? "是":"否";
			    books.content.isPayGoods = books.content.isPayGoods == 1 ? "是":"否";
			    books.content.isReturnGoods = books.content.isReturnGoods == 1 ? "是":"否";
			    books.content.isAlwaysSteal = books.content.isAlwaysSteal == 1 ? "是":"否";
			    var resContent = compiled.fetch(books);
			    console.log(res.data.eventType.value)
			    
		   		$("#detailInfo").html(resContent)
		   		if(res.data.eventType.value!=0){
			    	console.log("ss")
			    	$(".innerType").show()
			    }
		   		$('.table-cont').hide();
    			$('.detail-cont').show();
			}else{
				layer.msg(res.message,{time: 5000});
			}
		}
	});
    
}).on('click', '.back-btn', function() {
    $('.detail-cont').hide();
    $('.table-cont').show();
}).on("click","#search",function(){
	//获取列表 搜索
	getpages(url_main + "isp/api/v1/protected/reportStealRecord","get",1,10,$("#searchFrom").serialize(),function(res){
		  //模板
		 var tplText = $('#tpl').html(),pageText=$("#pageNum").html();
		   var compiled = new jSmart( tplText ),pageTextCom=new jSmart(pageText);
		   var books = {
		   	content:res.data.content,
		   	allpage:res.data.totalPages,
		   	curr:res.data.number,
		   	size:res.data.size
		   }
		   var res1 = compiled.fetch(books),pageRes=pageTextCom.fetch(books);
		   $("#person-list").html(res1);
		   $("#pagetips").html(pageRes); 
		})
	return false;
})

});
function openImg(id){
	$("#tong img").attr("src",id)
	layer.open({
	  type: 1,
	  title: false,
	  closeBtn: 0,
	  area: '600px',
	  skin: 'layui-layer-nobg', //没有背景色
	  shadeClose: true,
	  content: $('#tong')
	});
}
function exportToexcel(){
	console.log("ppp")
	ajaxsExport(url_main+"isp/api/v1/protected/listStealRecord/export","get",$("#searchFrom").serialize())
	return false;
}
 function beforeClick(treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}
function onCheck(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
	nodes = zTree.getCheckedNodes(true),
	v = "",e="";
	for (var i=0, l=nodes.length; i<l; i++) {
		v += nodes[i].name + ",";
		e +=nodes[i].id
	}
	if (v.length > 0 ) v = v.substring(0, v.length-1);
	var cityObj = $("#citySel");
	cityObj.attr("value", v);
	$("#secondRegionId").val(e)
	
	if($("#secondRegionId").val()!==""){
		console.log("opopop")
   		$("#storeList").next(".tip").hide();
		ajaxs(url_main+"isp/api/v1/protected/officeMap","get",{parentId:$("#secondRegionId").val()},function(res){
			if(res.success==true){
				var areasSelText = $('#secondStore').html();
			    var compiled1 = new jSmart(areasSelText);
			    var storeList = {
			   	 contents:res.data
			   }
			    console.log(storeList.contents)
			    storeList.contents.unshift({id:"",name:"请选择门店"})
			   var res = compiled1.fetch(storeList);
			   $("#storeList").html(res)
		  }else{
		  	layer.msg(res.message,{time: 5000});
		  }
		})
	}
}

function showMenu() {
	var cityObj = $("#citySel");
	var cityOffset = $("#citySel").offset();
	$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
	console.log("kkk")
	$("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "citySel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}





