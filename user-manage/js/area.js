
$(document).ready(function() {
	relogin()
	var formobjs;var names=[] , //区域名称暂存数据
	page=1,size=10,
	shopname=[],//小店名称
	roleName=$(".breadcrumb").find(".active").attr("roleName"),
	isFirst=true,
    options1=[];   //详情页区域数据
    //初始化获取列表
	pagelist({roleCode:roleName},page,size)
   var setting = {
	check: {enable: true,chkboxType: { "Y": "", "N": "" },chkStyle: "radio",radioType: "all"},
	view: {dblClickExpand: false},
	data: {simpleData: {enable: true}},
	callback: {beforeClick: beforeClick,onCheck: onCheck}
}; 
//详情页下拉选择
   var setting1 = {
	check: {enable: true,chkboxType: { "Y": "s", "N": "ps" }},
	view: {dblClickExpand: false},
	data: {simpleData: {enable: true}},
	callback: {beforeClick: beforeClick1,onCheck: onCheck1}
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
	    		options1.push({name:it.text,id:it.id,pId:it.parentId,nocheck:false})
	    		it.children.forEach(function(e){
					options.push({name:e.text,id:e.id,pId:e.parentId})
					options1.push({name:e.text,id:e.id,pId:e.parentId})
	    		})
	    		$.fn.zTree.init($("#treeDemo"), setting, options);
	    		
	    	});
		}else{
			layer.msg(res.message,{time: 5000});
		}
		}
    })
    
     //查看
  $('body').on('click', '.alert-btn', function() {
  	isFirst=true;
  	$('#editSel').val("")
	$.ajax({
		type:"get",
		url:url_main+"isp/api/v1/protected/editRoleUser",
		headers: headers,
		data:{"roleCode":roleName,"userJobNum":$(this).attr("userJobNum")},
		success:function(res){
			res = JSON.parse(JSON.stringify(res))
			if(res.success==true&&res.data){
				formobjs=res.data
				$("input[name='userJobNum']").val(res.data.userJobNum)
    			$("input[name='userName']").val(res.data.userName)
    			for(var i= 0;i<$("input[name='status']").length;i++){
    				if($("input[name='status']").eq(i).val()==res.data.status.name){
						$("input[name='status']").eq(i).attr("checked",true)
					}else{
					}
    			}
    			$("#editSel").val(res.data.secondRegionName.split("|").join(","))
    			$("#editVal").val(res.data.secondRegionId)
				var ids=res.data.secondRegionId.split("|");
    			options1.forEach(function(a,n){
    				a.checked = false;//重置所有的id为false
    				for(var j =0 ;j<ids.length;j++){
    					if(a.id == ids[j]){//判断
    						a.checked = true;
    						for(var e =0;e<options1.length;e++){
    							if(options1[n].pId==options1[e].id){
    								options1[e].open=true;
    							}
    						}
    					}
    				}
    			})
    			$.fn.zTree.init($("#treeDemo1"), setting1, options1);
    			$('.detail-cont').show();
			}else{
				layer.msg(res.message,{time: 5000});
			}
		}
	});
    
}).on('click', '.back-btn', function() {
    $('.alert-cont,.add-cont').hide();
    $('.table-cont').show();
}).on("click","#search",function(){
	//搜索
pagelist($("#searchFrom").serialize(),1,10)
	return false;
})
.on("click","#storeSelVal",function(){
	if(!$(this).prev("#firstAreaVal").val()){
		$(this).next(".tip").show()
	}else{
		$(this).next(".tip").hide()
	}
}).on("click",".closeBtn",function(){
	$(this).parents(".detail-cont").hide()
})
.on("blur","#phone",function(){
	var val = $(this).val();
	if(!(regexpss.phoneReg(val)==true)){
		$(this).next(".tip").show().find("span").text(regexpss.phoneReg(val))
	}else{
		$(this).next(".tip").hide().find("span").text(regexpss.phoneReg(val))
	}
}).on("click","#submit",function(){
	var namesArea = [],namesShop=[];
	formobjs.secondRegionId=$("#editVal").val()
	formobjs.secondRegionName=$("#secondIds").val()
	formobjs.status=$("input[name='status']:checked").val()
	delete formobjs.roleUserStatus;
	checkForms(formobjs);
	return false;
})
logout()
function checkForms(formobjs){
	var roles=rolestatus();
	var checck = region("#editVal");
	delete formobjs.roleUserStatus
	if(roles&&checck&&isFirst){
		ajaxs(url_main+"isp/api/v1/protected/updateRoleUser",'put',JSON.stringify(formobjs),function(res){
			isFirst=false;
			if(res.success==true){
				pagelist({roleCode:roleName},page,size,function(){
					$(".detail-cont").hide();
				})
			}
		})
	}else{
		return false;
	}
}

function pagelist(data,pages,size,callback){
	var ar =arguments.length;
	getpages(url_main+"isp/api/v1/protected/listRoleUser","get",pages,size,data,function(resdata){
		var listPage = $("#tpl").html(),pageText=$("#pageNum").html();
    	var listPageCom = new jSmart(listPage),pageTextCom=new jSmart(pageText);
    	if(resdata.success==true&&resdata.data.content){
    		var list=resdata.data;
    		var listPageRes = listPageCom.fetch(list),pageRes=pageTextCom.fetch(list);
    		$("#person-list").html(listPageRes);
    		$("#pagetips").html(pageRes);
    		page=resdata.data.number;
    		if(ar>3){
    			callback()
    			}
    	}else{
    		layer.msg(resdata.message,{time: 5000});
    	}
		
	})
}

});


function rolestatus(){
	if(!$("input[name='status']:checked").val()){
		$("input[name='status']").parents(".radiosel").next(".tip").show().find("span").text("请选择角色状态")
		return false;
	}else{
		$("input[name='status']").parents(".radiosel").next(".tip").hide();
		return true;
	}
}

function region(eleid){
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
	$("#firstAreaVal").val(e)
}

function showMenu() {
	var cityObj = $("#citySel");
	var cityOffset = $("#citySel").offset();
	console.log(cityOffset.left,cityOffset.top,cityObj.outerHeight())
	$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	console.log("ppp111")
	if (!(event.target.id == "menuBtn" || event.target.id == "citySel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}


 function beforeClick1(treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}
function onCheck1(e, treeId, treeNode) {
	console.log(nodes)
	var zTree = $.fn.zTree.getZTreeObj("treeDemo1"),
	nodes = zTree.getCheckedNodes(true),
	showName = [], ajaxId=[],ajaxName=[];
	
	for(var i=0;i<nodes.length;i++){
		if(!nodes[i].isParent){
			ajaxId.push(nodes[i].id)
			ajaxName.push(nodes[i].name)
			showName.push(nodes[i].name)
		}
	}
	$("#editSel").val(showName.join(","))
	$("#secondIds").val(ajaxName.join("|"))
	$("#editVal").val(ajaxId.join("|"))
	console.log($("#secondIds").val(),$("#editVal").val())
	
	
	
	
	
}

function showMenu1() {
	$("#editSel").show()
	var cityObj = $("#editSel");
	var cityOffset = $("#editSel").offset();
	$("#menuContent1").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", onBodyDown1);
}
function hideMenu1() {
	$("#menuContent1").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown1);
}
function onBodyDown1(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "editVal" || event.target.id == "menuContent1" || $(event.target).parents("#menuContent1").length>0)) {
		hideMenu1();
	}
}




