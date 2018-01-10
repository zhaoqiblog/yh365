$(function(){
	var htmlTmp={
		firstList:[],
		secondList:{},
		thirdList:{}
	};
	relogin()
	console.log(token)
	var firstList = $("#firstList").html();
    var firstListCom = new jSmart(firstList);
    var isSave=false,timer=null; //单机事件和双击事件重叠
    var objNew={  //新增时：
			description:"",href:"",image:"",isShow:"true",name:$("#newcategory").val(),parentId:"",siteId:1,sort:10,target:"BLANK"
		}
	function gtelist(){
		ajaxs(url_main+"isp/api/v1/protected/categorys/tree","get","",function(res){
			htmlTmp.firstList=res.data[0].children;
			console.log(res.data[0])
			$("#firstNew").attr("pid",res.data[0].id)
			var firstListRes = firstListCom.fetch(htmlTmp);
	    		$("#firstListWrap").html(firstListRes);
		})
	}
	gtelist()
	$("body").on("click",".editName",function(){
		$("#secondNo").hide();$("#thidrNo").hide()
		var _this=$(this)
		_this.parents("tr").css("background","#dceaff").siblings("tr").css("background","#ffffff")
		if(_this.attr("pid")=="1"){
			$("#thirds").hide()
			var secondList = $("#secondList").html();
	    	var secondListCom = new jSmart(secondList);
			htmlTmp.firstList.forEach(function(e){
				if(e.id==_this.attr("id")){
//					htmlTmp.secondList.text=e.text;
					htmlTmp.secondList=e
					var secondListRes = secondListCom.fetch(htmlTmp);
		    		$("#seconds").html(secondListRes);
		    		$("#seconds").show()
		    		if(htmlTmp.secondList.children.length<=0){
		    			$("#secondNo").show()
		    		}
				}
			})
		}else{
			$("#thirds").show()
			var thirdList = $("#thirdList").html();
	    	var thirdListCom = new jSmart(thirdList);
			htmlTmp.secondList.children.forEach(function(re){
				if(_this.attr("id")==re.id){
					htmlTmp.thirdList=re;
					htmlTmp.thirdList.pText=htmlTmp.secondList.text;
					var thirdListRes = thirdListCom.fetch(htmlTmp);
		    		$("#thirds").html(thirdListRes);
		    		if(htmlTmp.thirdList.children.length<=0){
						$("#thidrNo").show()		    			
		    		}
				}
			})
		}
//		})
	}).on("click",".edits",function(){
		clearTimeout(timer)
		var obj={
			name:$(this).parents("td").attr("text"),	
			parentId:$(this).parents("td").attr("pid"),			
			id:$(this).parents("td").attr("id")		
		}
		var j = 1,_this=$(this)
		if($(this).text()=="编辑"){
			$(this).text("完成")
			$("#newcategory").show().val(obj.name).css({"left":$(this).parents("tr").offset().left+3,"top":$(this).offset().top-4,"z-index":99999})
				.focus().on("blur",function(){
					if(($("#newcategory").val()==obj.name)){
						_this.text("编辑");
						$("#newcategory").hide()
					}
				})
		}else{
			if(($("#newcategory").val()!=obj.name)){
						obj.name=$("#newcategory").val()
				if(obj.name){
					if(_this.attr("status")=="new"){
						//新增
						objNew.name=$("#newcategory").val()
						isSave=true;
						ajaxs(url_main+"isp/api/v1/protected/categorys","post",JSON.stringify(objNew),function(callData){
							if(callData.success==true){
								$("#newcategory").hide()
								showOkPopNew(callData.message,function(){
									gtelist()
									_this.text("编辑")
								})
							}else{
//								$("#newcategory").hide()
								$("#newcategory").focus()
								showErrorNew(callData.message)
							}
						})
					}else{
						//修改
						isSave=true;
						ajaxs(url_main+"isp/api/v1/protected/categorys","put",JSON.stringify(obj),function(rs){
							if(rs.success==true){
								$("#newcategory").hide()
								showOkPopNew(rs.message,function(){
									gtelist()
									_this.text("编辑").parents(".handel").prev(".editName").find(".names").text(rs.data.name)
								})
							}else{
								$("#newcategory").hide()
								showErrorNew("不好意思，服务器开小差了，保存失败，请稍后再试")
							}
						})
					}
				}else{
    				showErrorNew("请输入分类名称！")
				}
			}else{
				$("#newcategory").hide()
				$(this).text("编辑")
			}
		}	
	}).on("click",".newCategory",function(){
		var _this=$(this)
		console.log(_this.attr("pid"))
		var h = (htmlTmp.firstList.length+2)*40+$(this).offset().top-10
		objNew.parentId=_this.attr("pid")
//		if(objNew.parentId=="1"){
			var htmls='<tr class="normal newListss" id="newListss"><td class="editName"><i class="names">未命名1</i></td>'+
			'<td class="handel">'+
			'<a href="javascript:;" class="edits" status="new">完成</a>&nbsp;/&nbsp;<a href="javascript:;" class="toCancel">取消</a>&nbsp;&nbsp;&nbsp;<i><img src="../images/right.png"></i></td></tr>'
//			$("#firstListWrap").append(htmls)
			_this.parents(".category-level").find("tbody").append(htmls)
//			console.log($("#newListss").length)
			$("#newcategory").show().val("未命名1").css({"left":_this.parents(".category-level").find("tbody").offset().left+3,"top":$("#newListss").offset().top,"z-index":99999})
			.focus().on("blur",function(){
				timer=setTimeout(function(){
					if(!isSave){
						showErrorNew("请保存或取消新建的分类！")
						$("#newcategory").focus()
//						console.log("保存")
//						_this.parents(".category-level").find("tbody").find(".newListss").remove()
					}else{}
				},2000)
			})
			$('.toCancel').on("click",function(){
				clearTimeout(timer)
				$("#newcategory").hide();
				_this.parents(".category-level").find("tbody").find(".newListss").remove()
			})
//		ajaxs(url_main+"isp/api/v1/protected/categorys","post",JSON.stringify(obj),function(res){
//			
//		})
	}).on("blur","#newcategory",function(){
		timer=setTimeout(function(){
			if(!isSave){
				showErrorNew("请保存或取消新建的分类！")
				$("#newcategory").focus()
//						console.log("保存")
//						_this.parents(".category-level").find("tbody").find(".newListss").remove()
			}else{}
		},2000)
	}).on("click",".deletes",function(){
		var categroyId=$(this).parents(".handel").attr("id")
		ajaxs(url_main+"isp/api/v1/protected/categorys/"+categroyId,"delete","",function(res){
			if(res.success==true){
				showOkPopNew(res.message)
			}else{
				showErrorNew(res.message)
			}
		})
	})
	
})