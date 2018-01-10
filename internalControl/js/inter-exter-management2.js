var innerManage = {
	
};
//laypage
var flag = true;
//页面容量
var size = 10;
$(document).ready(function() {
	relogin();
	logout();
	$("#srea").multiselect({
		nonSelectedText: '请选择所属区域',
	 	nSelectedText: '个被选中',
	 	numberDisplayed: 4, //当超过4个标签的时候显示n个被选中
	 	buttonWidth: '140px',
	 	onChange:function(ele,ss,fd){}
	})
    //获取区域
//  ajaxs(url_main+"isp/api/v1/protected/secondRegionMap","get","",function(res){
    ajaxs(url_main+"isp/api/v1/protected/officeMap/tree","post",{"type":"1"},function(res){
    	
    	
    	if(res.success==true){
    		console.log(res)
    		var options=[],optgroup=[];
	    	res.data.forEach(function(it){
	    		console.log(it)
	    		var childrens=[];
	    		it.children.forEach(function(e){
	    			childrens.push({label:e.text,value:e.id})
	    		})
	    		optgroup.push({label:it.text,children:childrens})
	    		options.push({label:it.text,value:it.id})
	    	});
	    	$('#srea').multiselect('dataprovider', optgroup);
	    	$('#srea').val("")
	    	$('#srea').multiselect('select', "");
	    	
	    	
	    	var optgroups = [
	        {
	            label: 'Group 1', children: [
	                {label: 'Option 1.1', value: '1-1', selected: true},
	                {label: 'Option 1.2', value: '1-2'},
	                {label: 'Option 1.3', value: '1-3'}
	            ]
	        },
	        {
	            label: 'Group 2', children: [
	                {label: 'Option 2.1', value: '1'},
	                {label: 'Option 2.2', value: '2'},
	                {label: 'Option 2.3', value: '3', disabled: true}
	            ]
	        }
	    ];
	    	
	    	
    	//区域选择模板
//  	   var areasSelText = $('#areasSel').html();
//		   var compiled1 = new jSmart(areasSelText);
//		   var books1 = {
//		   	 contents:res.data
//		   }
//		   books1.contents.unshift({id:"",name:"请选择区域"})
//		   
//		   var res = compiled1.fetch(books1);
//		   $("#srea").html(res);
		   
		   $("#srea").on("change",function(){
		   	console.log($(this).val())
			   	if($(this).val()!==""){
			   		$("#storeList").next(".tip").hide();
					ajaxs(url_main+"isp/api/v1/protected/officeMap","get",{parentId:$(this).val()},function(res){
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
			})
		}else{
			layer.msg(res.message,{time: 5000});
		}
    })
    //获取事件类型
    ajaxs(url_main+"isp/api/v1/public/enumeration/stealRecord/-1","get","",function(res){
    	
    	if(res.success==true && res.data){
    		var eventType1 = $("#eventType").html(),dealType1 = $("#dealType").html();
    		var eventTypeCom = new jSmart(eventType1),dealTypeCom = new jSmart(dealType1);
    		var eventTypeInit=[{code:"",name:"请选择事件类型"}]
    		var dealTypeInit=[{code:"",name:"请选择事件类型"}]
	    	var allType = {
	    		dealType:eventTypeInit.concat(res.data.dealType),
	    		eventType:dealTypeInit.concat(res.data.eventType),
	    	};
	    	var eventRes = eventTypeCom.fetch(allType),dealRes = dealTypeCom.fetch(allType);
	    	$("#eventVal").html(eventRes);$("#dealVal").html(dealRes)
    	}else{
    		layer.msg(res.message,{time: 5000});
    	}
    })
    $("#storeList").on("click",function(){
	   	if(!$("#srea").val()){
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
//		   console.log(books)
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
			console.log(res.data)
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
		   		$("#detailInfo").html(resContent)
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
//.on("click","#exportList",function(){
////	GET /api/v1/protected/listStealRecord/export
//ajaxs(url_main+"isp/api/v1/protected/listStealRecord/export","get",$("#searchFrom").serialize(),function(res){
//	console.log(res)
//})
//})



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
	ajaxsExport(url_main+"isp/api/v1/protected/listStealRecord/export","get",$("#searchFrom").serialize())
	return false;
}





