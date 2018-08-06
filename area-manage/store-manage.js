$('body').on('click', '.add-btn', function() {
    showArea();
    $('.table-cont').hide();
    $('.add-cont').show();
}).on('click', '.alert-btn', function() {
    showArea();
    $('.table-cont').hide();
    $('.alert-cont').show();
}).on('click', '.back-btn', function() {
    $('.alert-cont,.add-cont').hide();
    $('.table-cont').show();
}).on("click","#search",function(){
	queryData();
	return false;
})
$(document).ready(function() {
   relogin();
   searchArea();
    queryData();
    downSelect();
});
//laypage
var flag = true;
//页面容量
var size = 10;
//引入VUE
var vm = new Vue({
    el: '#area-cont',
    data: {
        alertstatus: '',
        addareaName: '',
        addareaId: '',
        alertAreaType: '',
        name: '',
        alertTypeid: '',
        addfirstRegionId: '',
        /*添加一级区域大区编码*/
        addfirstRegionName: '',
        /*添加一级区域大区名字*/
        addsecfirstRegion: '',
        /*添加二级大区名字*/
        addsecfirRegionId: '',
        /*添加二级大区编码*/
        addsecondRegionId: '',
        /*添加二级区域编码*/
        addsecondRegionName: '',
        /*添加二级区域名字*/
        addshopfirstRegionId: '',
        // 添加三级大区编码
        addshopfirstRegion: '',
        // 添加三级大区名称
        secondRegion: '',
        /*添加三级所属区域名字*/
        shopname: '',
        /*添加三级门店名字*/
        shopid: '',
        /*添加三级门店名字*/
        shopaddress: '',
        /*添加三级门店详细地址*/
        queryparam: {
            type: 'SHOP',
            page: 1,
            size: 10,
            parentId:""   //二级区域id
           
        },
        addparam: {
            address: '',
            code: '',
            firstRegion: '',
            firstRegionName: '',
            name: '',
            secondRegion: '',
            secondRegionName: '',
            status: '',
            type: '',
        },
        alertparam: {
            id: '',
            address: '',
            code: '',
            firstRegion: '',
            firstRegionName: '',
            name: '',
            secondRegion: '',
            secondRegionName: '',
            status: '',
            type: '',
        },
        areadownparam: {
            parentId: 0
        },
        secRegionparam: {
            parentId: ''
        },
        areaType: '',
        pagenum: '',
        totalpage: '',
        areaList: [],
        addbigarea: [],
        secondarea: '',
        message: '',
        searchAreaList:[{id:"",name:"请选择区域"}]
    },
    methods: {
        alertData: function(id, areaid, areaname, name, code, statuscode, firstRegion, firstRegionname, secondRegion, secondRegionname, address) {
            vm.addareaName = areaname;
            vm.addareaId = areaid;
            vm.alertparam.id = id;
            vm.alertparam.code = code;
            vm.alertparam.name = name;
            vm.alertparam.firstRegion = firstRegion;
            vm.alertparam.firstRegionName = firstRegionname;
            vm.alertparam.secondRegion = secondRegion;
            vm.alertparam.secondRegionName = secondRegionname;
            vm.alertparam.address = address;
            vm.alertstatus = statuscode;
            vm.addsecfirstRegion = firstRegionname;
            vm.secRegionparam.parentId = firstRegion;

            if (areaid == 1) {
                showSecArea();
                $('.bigarea').show();

                $('.addSecbigarea,.shop-cont').hide();
            } else if (areaid == 2) {
                showSecArea();
                $('.addSecbigarea,.shop-cont').show();
                $('.bigarea').hide()
            } else {
                $('.addSecbigarea,.shop-cont').hide();
                $('.bigarea').hide()
            }
        },
        searchSecArea: function(regionid, regionname) {
            vm.secondRegion = '';
            vm.secondRegionId = '';
            vm.addparam.firstRegionName = regionname;
            vm.addparam.firstRegion = regionid;
            vm.addsecfirstRegion = regionname;
            vm.addsecfirRegionId = regionid;
            vm.addshopfirstRegionId = regionid;
            vm.addshopfirstRegion = regionname;
            vm.secRegionparam.parentId = regionid;
  	    vm.alertparam.firstRegion = regionid;
            vm.alertparam.firstRegionName = regionname
            showSecArea();
        },
        selectSecArea: function(id, name) {
            vm.secondRegion = name;
            vm.secondRegionId = id;
            vm.addparam.secondRegionName = name;
            vm.addparam.secondRegion = id;
    	    vm.alertparam.secondRegionName = name;
            vm.alertparam.secondRegion = id;

        },
        submitAdd: function() {
            paramDefined();
            $.ajax({
                url: url_area,
                type: 'post',
                headers: headers,
                data: JSON.stringify(vm.addparam),
                contentType: 'application/json',
                success: function(result) {
                    $('.pop').show();
                    $('.pop-cont').html(result.message);
                    setTimeout(function() {
                        $(".pop").hide();
                        location.reload();
                    }, 1000)
                },
                error: function() {
                    $('.pop').show();
                    $('.pop-cont').html('请填写所有参数！');
                     setTimeout(function() {
                        $(".pop").hide();
                    }, 1000)
                }

            })
        },
        submitAlert: function() {
            vm.alertparam.type = vm.addareaId;
            vm.alertstatus = ('actived' == vm.alertstatus ? 'ACTIVED' : 'INACTIVE');
            vm.alertparam.status = vm.alertstatus;
            $.ajax({
                url: url_area,
                type: 'put',
                headers: headers,
                data: JSON.stringify(vm.alertparam),
                contentType: 'application/json',
                success: function(result) {
                    $('.pop').show();
                    $('.pop-cont').html(result.message);
                    setTimeout(function() {
                        $(".pop").hide();
                        location.reload();
                    }, 1000)
                }
            })
        }
    }
});

// 添加参数定义
var paramDefined = function() {
        vm.addparam.type = 2;
        vm.addparam.firstRegion = vm.addshopfirstRegionId;
        vm.addparam.firstRegionName = vm.addshopfirstRegion;
        vm.addparam.secondRegion = vm.secondRegionId;
        vm.addparam.secondRegionName = vm.secondRegion;
        vm.addparam.code = vm.shopid;
        vm.addparam.name = vm.shopname;
        vm.addparam.address = vm.shopaddress;
    }
    // 添加区域下拉框数据
var showArea = function() {
        $.ajax({
            url: url_area,
            type: "get",
            headers: headers,
            data: vm.areadownparam,
            contentType: 'application/json',
            success: function(result) {
                vm.addbigarea = $.parseJSON(result).data;
            }
        })
    }
    // 获取二级区域下拉框数据
var showSecArea = function() {
        $.ajax({
            url: url_area,
            type: "get",
            headers: headers,
            data: vm.secRegionparam,
            contentType: 'application/json',
            success: function(result) {
                vm.secondarea = $.parseJSON(result).data;
//              console.log(vm.secondarea)
//              if (vm.addsecfirstRegion != "" && vm.addareaId == '2') {
//                  $('.shop-cont').show();
 					
                    vm.$nextTick(function() {
                        downMenu()
                    })
//              } else {
//                  $('.shop-cont').hide();
//              }
            }
        })
    }
    /*分页 查询地图列表*/
function queryData() {
	vm.queryparam.type="SHOP"
    $.ajax({
        url: url_main+"isp/api/v1/protected/officeMaps",
        type: "get",
        headers: headers,
        data: vm.queryparam,
        contentType: 'application/json',
//      dataType:'json',
        success: function(result) {
            laypage({
                cont: 'pageNumber', // 容器id
                pages: JSON.parse(result).data.totalPages, // 总页数
                groups: size, // 每页个数
                skin: '#42a6d4',
                skip: true,
                jump: function(obj, first) {
                    if (!first) {
                        data(obj.curr);
                    }
                }
            });
            flag = false;
            vm.areaList = JSON.parse(result).data.content;
            vm.pagenum = JSON.parse(result).data.number;
            vm.totalpage = JSON.parse(result).data.totalPages;
        }

    })
}
function searchArea(){
	vm.queryparam.type="SECOND"
	$.ajax({
        url: url_main+"isp/api/v1/protected/secondRegionMap",
        type: "get",
        headers: headers,
        data: vm.queryparam,
        contentType: 'application/json',
//      dataType:'json',
        success: function(result) {
            vm.searchAreaList =vm.searchAreaList.concat(JSON.parse(result).data);
        }
    })
//var datas={type:"1"}
//	$.ajax({
//      url: url_main+"isp/api/v1/protected/officeMap/tree",
//      type: "post",
//      headers: headers,
//      data:{type:"1"},
////      contentType: 'application/json',
////      dataType:'json',
//      success: function(result) {
//      	console.log(result)
//          vm.searchAreaList =vm.searchAreaList.concat(result.data);
//          $("#firstAreaVal").multiselect()
//      }
//  })

}
function data(currentPage) {
    vm.queryparam.page = currentPage;
    $.ajax({
        url: url_office_map,
        type: "get",
        headers: headers,
        data: vm.queryparam,
        contentType: 'application/json',
        success: function(result) {
            if (flag) {
                laypage({
                    cont: 'pageNumber', // 容器id
                    pages: JSON.parse(result).data.totalPages, // 总页数
                    groups: limit, // 每页个数
                    skin: '#42a6d4',
                    skip: true,
                    jump: function(obj, first) {
                        if (!first) {
                            data(obj.curr);
                        }
                    }
                });
            }
            flag = false;
            vm.areaList = JSON.parse(result).data.content;
            vm.pagenum = JSON.parse(result).data.number;

        }
    })
}

function downMenu() {
    $('.shop-inp,.shopdowm').click(function(e) {
        $(this).css('border-color', '#00a0e9');
        var menu = $(this).parent().find(".shopdownmenu");
        if ($(menu).css("display")=="block") {
            $(this).parent().find(".shopdownmenu").fadeOut();
            $(this).css('border-color', '#ccc');
        } else {
            $(this).parent().find(".shopdownmenu").fadeIn();
            stopPropagation(e);
        }
    });
}
/*下拉框选择(渲染效果)*/
function downSelect() {
    $(document).click(function() {
        $(".sup-type,.shopdownmenu").fadeOut();

    });
    // 门店所属区域下拉

    // 其他下拉框
    $(".select-inp,.btn-down").click(function(e) {
        $(this).parents(".form-group").siblings(".form-group").find(".sup-type").css({ 'display': 'none' });
        $(this).css('border-color', '#00a0e9');
        var menubox = $(this).parent().find(".sup-type");
        if ($(menubox).is(':visible')) {
            $(this).parent().find(".sup-type").fadeOut();
            $(this).css('border-color', '#ccc');
        } else {
            $(this).parent().find(".sup-type").fadeIn();
            stopPropagation(e);
        }
    });
    $('.sup-type,.shopdowm').bind('click', function(e) {
        stopPropagation(e);
    });
    $('.sup-type,.shopdowm').on('click', 'li', function() {
        $(this).addClass('cur').siblings().removeClass('cur');
        $(this).parents('.sup-type').fadeOut();
        $(this).css('border-color', '#ccc');
    });

}
