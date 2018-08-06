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
})
$(document).ready(function() {
   relogin();
    queryData(url_main+"isp/api/v1/protected/officeMap?parentId=0",function(res){
    	console.log(res)
    	vm.areaList=res.data;
    	queryData(url_main+"isp/api/v1/protected/officeMap?parentId="+vm.areaList[0].id,function(res1){
    		vm.secondAreaList=res1.data
    	})
    });
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
        addareaType: [
            { id: '0', name: '一级区域' },
            { id: '1', name: '二级区域' }
        ],
        secondAreaList:[],
        queryparam: {
            name: '',
            page: 1,
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
        message: ''

    },
    methods: {
    	//大区区域切换
    	changeArea :function(id){
    		queryData(url_main+"isp/api/v1/protected/officeMap?parentId="+id,function(res){
    			vm.secondAreaList=res.data;
    		})
    	},
        chooseAreaName: function(areaId, areaName) {
            vm.addareaName = areaName;
            vm.addareaId = areaId;
            vm.addfirstRegionId = '';
            vm.addfirstRegionName = '';
            if (areaId == 1) {
                $('.bigarea').show();
                $('.addSecbigarea,.shop-cont').hide();
            }else {
                $('.addSecbigarea,.shop-cont,.shop-detail').hide();
                $('.bigarea').hide()
            }

        },
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
            console.log(statuscode);

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
            // vm.addparam.firstRegionName = regionname;
            // vm.addparam.firstRegion = regionid;
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
//          $.ajax({
//              url: url_area,
//              type: 'post',
//              headers: headers,
//              data: JSON.stringify(vm.addparam),
//              contentType: 'application/json',
//              success: function(result) {
//                  $('.pop').show();
//                  $('.pop-cont').html(result.message);
//                  setTimeout(function() {
//                      $(".pop").hide();
//                      location.reload();
//                  }, 1000)
//              },
//              error: function() {
//                  $('.pop').show();
//                  $('.pop-cont').html('请填写所有参数！');
//                   setTimeout(function() {
//                      $(".pop").hide();
//                  }, 1000)
//              }
//
//          })
        },
        submitAlert: function() {
            vm.alertparam.type = vm.addareaId;
            vm.alertstatus = ('actived' == vm.alertstatus ? 'ACTIVED' : 'INACTIVE');
            vm.alertparam.status = vm.alertstatus;
            console.log(vm.alertparam);
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
        vm.addparam.type = vm.addareaId;
        if (vm.addareaId == '0') {
            vm.addparam.code = vm.addfirstRegionId;
            vm.addparam.name = vm.addfirstRegionName;
        } else if (vm.addareaId == '1') {
            vm.addparam.firstRegion = vm.addsecfirRegionId;
            vm.addparam.firstRegionName = vm.addsecfirstRegion;
            vm.addparam.code = vm.addsecondRegionId;
            vm.addparam.name = vm.addsecondRegionName
        } else if (vm.addareaId == '2') {
            vm.addparam.firstRegion = vm.addshopfirstRegionId;
            vm.addparam.firstRegionName = vm.addshopfirstRegion;
            vm.addparam.secondRegion = vm.secondRegionId;
            vm.addparam.secondRegionName = vm.secondRegion;
            vm.addparam.code = vm.shopid;
            vm.addparam.name = vm.shopname;
            vm.addparam.address = vm.shopaddress;
        }
        console.log(vm.addparam)
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
                console.log(vm.secondarea);
                if (vm.addsecfirstRegion != "" && vm.addareaId == '2') {
                    $('.shop-cont').show();
                    vm.$nextTick(function() {
                        downMenu()
                    })
                } else {
                    $('.shop-cont').hide();
                }
            }
        })
    }
    /*查询区域数据*/
function queryData(url,callback) {  //url_main+"isp/api/v1/protected/officeMap?parentId=0"
    $.ajax({
        url: url,
        type: "get",
        headers: headers,
        data: 0,
        contentType: 'application/json',
        success: function(result) {
        	var res = JSON.parse(result);
        	callback(res)
//          vm.areaList = JSON.parse(result).data;
//          vm.pagenum = JSON.parse(result).data.number;
//          vm.totalpage = JSON.parse(result).data.totalPages;

        }

    })
}

function downMenu() {
    $('.shop-inp,.shopdowm').click(function(e) {
        $(this).css('border-color', '#00a0e9');
        var menu = $(this).parent().find(".shopdownmenu");
        if ($(menu).is(':visible')) {
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
