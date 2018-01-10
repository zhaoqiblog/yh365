var innerManage = {
	
};
$(document).ready(function() {
	relogin()
	 getpageList("")
    //获取区域
//  ajaxs(url_main+"isp/api/v1/protected/secondRegionMap","get","",function(res){
//  	if(res.success==true){
//  	//区域选择模板
//  	   var areasSelText = $('#areasSel').html();
//		   var compiled1 = new jSmart(areasSelText);
//		   var books1 = {
//		   	 contents:res.data
//		   }
//		   books1.contents.unshift({id:"",name:"请选择区域"})
//		   var res = compiled1.fetch(books1);
//		   $("#srea").html(res);
//		}else{
//			layer.msg(res.message,{time: 5000});
//		}
//  })
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
   $.ajax({
    	type:"post",
		url:url_main+"isp/api/v1/protected/officeMap/tree",
		data:{type:"1"},
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
  $('body').on("click","#search",function(){
	//获取列表 搜索
	 getpageList($("#searchFrom").serialize())
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
//function exportToexcel(){
//	console.log("mmm")
////	exportlist(url_main+"isp/api/v1/protected/listStealRecord/export","get",$("#searchFrom").serialize())
//	return false;
//}

function getpageList(data){
	getpages(url_main + "isp/api/v1/protected/blueEagleRecord","get",1,10,data,function(res){
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
}

function exportlist(urls,type,datas){
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
                linkElement.setAttribute("download", 'blue_intercept.xls');
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
function exportToexcel(){
	exportlist(url_main+"/isp/api/v1/protected/listBlueEagle/export","get",$("#searchFrom").serialize())
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
	$("#srea").val(e)
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
		console.log("fff")
		hideMenu();
	}
}



