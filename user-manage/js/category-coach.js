$(document).ready(function() {
	relogin()
	var formobjs, //区域名称暂存数据
	page=1,size=10,
	shopname=[],//小店名称
	roleName=$(".breadcrumb").find(".active").attr("roleName");
	
	var thirdStore=$("#thardStore").html();
    	var thirdStoreCom = new jSmart(thirdStore),
	areas={thirdStores:[]},
	isFirst=true, options1=[];
    pagelist({roleCode:roleName},page,size);
    logout();
    
   var setting = {
	check: {enable: true,chkboxType: { "Y": "", "N": "" },chkStyle: "radio",radioType: "all"},
	view: {dblClickExpand: false},
	data: {simpleData: {enable: true}},
	callback: {beforeClick: beforeClick,onCheck: onCheck}
};   
   var setting1 = {
	check: {enable: true,chkboxType: { "Y": "s", "N": "ps" },chkStyle: "radio",radioType: "all"},
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
	    		options1.push({name:it.text,id:it.id,pId:it.parentId,nocheck:true})
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
    //获取所属小店
	ajaxs(url_main+"isp/api/v1/protected/shopSelect","get","",function(res2){
		var res = res2
		var smallStore = $("#smallStoreList").html(),smallChange=$("#smallStoreChange").html();
    	var smallStoreCom = new jSmart(smallStore),smallChangeCom = new jSmart(smallChange);
    	var initStore = [{shopId:"",shopName:"请选择品类"}]
    	if(res.success==true&&res.data){
    		var smallSto={
    			smallstore:initStore.concat(res.data),
    			smallChange:res.data
    		}
    		var smallStoreRes1 = smallStoreCom.fetch(smallSto),smallStoreRes = smallChangeCom.fetch(smallSto);
    		$("#smallStoreLists").html(smallStoreRes1);
    		$("#shopId").html(smallStoreRes);
    	}else{
    		layer.msg(res.message,{time: 5000});
    	}
	})
     //查看
  $('body').on('click', '.alert-btn', function() {
  	$("#responseStore").hide()
  	isFirst=true;
  	//详情页负责品类
  	
	  	$("#shopId").multiselect({
			nonSelectedText: '请选择负责品类',
		 	nSelectedText: '个被选中',
		 	numberDisplayed: 3, //当超过4个标签的时候显示n个被选中
		 	buttonWidth: '345px',
		 	onChange:function(ele,ss,fd){
		 		if($("select[name='shopId']").val()){
		 		formobjs.shopId=$("select[name='shopId']").val().join("|");
		 		}
		 	}
		 		
		})
	$.ajax({
		type:"get",
		url:url_main+"isp/api/v1/protected/editRoleUser",
		data:{"roleCode":roleName,"userJobNum":$(this).attr("userJobNum")},
		headers: headers,
		success:function(res){
			if(res.success==true&&res.data){
				formobjs=res.data
				$("#numChange").val(res.data.userJobNum)
    			$("#nameChange").val(res.data.userName)
    			$("#isStoreMan").prop("checked",formobjs.isStoreManager== 1?true:false).on("click",function(){
    				if($(this).prop("checked")){
    					$("#responseStore").show()
    				}else{
    					$("#responseStore").hide()
    				}
    				formobjs.isStoreManager=$("#isStoreMan").val()
    			})
    			if($("#isStoreMan").prop("checked")==true){
    				$("#responseStore").show()
    				formobjs.isStoreManager=$("#isStoreMan").val()
    			}
    			for(var i= 0;i<$("input[name='status']").length;i++){
    				if($("input[name='status']").eq(i).val()==res.data.status.name){
						$("input[name='status']").eq(i).attr("checked",true)
					}else{
					}
    			}
    			if(res.data.roleCode=="isp_categroy_coach"){
    				$("select[name='shopId']").val(res.data.shopId.split("|"))
    			}
    			$('#shopId').multiselect('select', res.data.shopId.split("|"));
    			$("#shopId").multiselect('refresh');
				//负责门店
				$("#storeId").multiselect({
					nonSelectedText: '请选择负责门店',
				 	nSelectedText: '个被选中',
				 	numberDisplayed: 1, //当超过4个标签的时候显示n个被选中
				 	buttonWidth: '345px',
				 	onChange:function(ele,ss,fd){
						formobjs.storeId = $("#storeId").val().join("|")
						var namesArea=[];
						$("#storeId option:selected").each(function(ede){
							namesArea.push($(this)[0].label)
						})
						formobjs.storeName=namesArea.join("|")
				 	}
				})
				if(formobjs.secondRegionId){
					ajaxs(url_main+"isp/api/v1/protected/officeMap","get",{parentId:formobjs.secondRegionId},function(res2){
						var /*res2 = JSON.parse(res2),*/third=[{id:'',name:"请选择门店"}]
						if(res2.success==true && res2.data){
							var options=[];
					    	res2.data.forEach(function(it){
					    		options.push({label:it.name,value:it.id})
					    	});
					    	$('#storeId').multiselect('dataprovider', options);
					    	$('#storeId').multiselect('select', res.data.storeId.split("|"));
			    			$("#storeId").multiselect('refresh');
						}else{
							layer.msg(res2.message,{time: 5000});
						}
					})
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
    							options1[e].open=false;
    							if(options1[n].pId==options1[e].id){
    								console.log("oooo")
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
	formobjs.secondRegionName=$("#editSel").val()
	formobjs.secondRegionId=$("#editVal").val()
	if(roleName=="isp_categroy_coach"){
		$("#shopId option:selected").each(function(ede){
			namesShop.push($(this)[0].label)
		})
		formobjs.shopName=namesShop.join("|")
	}
	formobjs.status=$("input[name='status']:checked").val()
	checkForms(formobjs);
	return false;
}).on("click","#citySel",function(){
	showMenu()
}).on("click","#editSel",function(){
	showMenu1()
})
function checkForms(formobjs){
	var roles=rolestatus();
	var checck = region("#editVal","#shopId");
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
	$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
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

 function beforeClick1(treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}
function onCheck1(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo1"),
	nodes = zTree.getCheckedNodes(true),
	v = "",e=[];
	var names=""
	
	for (var i=0, l=nodes.length; i<l; i++) {
			v += nodes[i].name + ",";
			e +=nodes[i].id
	}
	if (v.length > 0 ) v = v.substring(0, v.length-1);
	$("#editSel").val(v)
	
	$("#editVal").val(e)
    if(e!==""){
		ajaxs(url_main+"isp/api/v1/protected/officeMap","get",{parentId:e},function(res){
			var third=[{id:'',name:"请选择门店"}]
			if(res.success==true && res.data){
				areas.thirdStores=third.concat(res.data)
				var storeRes = thirdStoreCom.fetch(areas);
				var options=[];
		    	res.data.forEach(function(it){
		    		options.push({label:it.name,value:it.id})
		    	});
		    	$('#storeId').multiselect('dataprovider', options);
			}else{
			}
//	    				
		})
    }
//	    	});
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





