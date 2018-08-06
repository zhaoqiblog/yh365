//laypage
var flag = true;
//页面容量
var size = 10;

$('body').on('click', '.alert-btn', function() {
    $('.table-cont').hide();
    $('.alert-cont').show();
}).on('click', '.back-btn', function() {
    $('.alert-cont').hide();
    $('.table-cont').show();
}).on('click', '.choose-btn', function() {
    $('#_easyui_textbox_input1,#_easyui_textbox_input2').trigger('click');
})


//引入VUE
var vm = new Vue({
    el: '#shopCont',
    data: {
        userno: '',
        username: '',
        usertel: '',
        shopname: '',
        status: '',
        officeMapIds:'',
        param: {
            userNo: '',
            name: '',
            mobile: '',
            page: 1,
            size: 10
        },
        getpersonparam: {
            code: 'isp_it_coach_person'
        },
        alertparam: {
            shops: '',
            status: '',
            userId: ''
        },
        shopList: [],
        pagenum: '',
        totalpage: ''
    },
    methods: {
        query: function() {
            queryData();
        },
        alertData: function(userid, userno, usertel, username, shopname,statuscode,officeMapIds) {
            // vm.alertparam.userId=userid;
            vm.alertparam.userId = userno;
            vm.userno = userno;
            vm.username = username;
            vm.usertel = usertel;
            vm.shopname = shopname;
            vm.status = statuscode;
            vm.officeMapIds=officeMapIds;
            //获取门店
            getshop();
        },
        submitAlert: function() {
            vm.status = ('actived' == vm.status ? 'ACTIVED' : 'INACTIVE');
            vm.alertparam.status = vm.status;
            var shops = $('.store').combotree('getValues');
            vm.alertparam.shops = shops.toString();
            console.log(JSON.stringify(vm.alertparam));
            $.ajax({
                url: url_itcoach_alertshop,
                type: 'post',
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

function getshop() {
	var datas={"type":'2'}
    $.ajax({
        url: url_main+"isp/api/v1/protected/officeMap/tree",
        type: 'post',
        headers: headers,
        data:datas,
        dataType:'json',
        success: function(result) {
            // console.log($.parseJSON(result));
            console.log(result);
            $('.store').combotree({
                data: result.data,
                onBeforeLoad: function() {},
                multiple: true,
                panelHeight: 'auto',
            });
            if(vm.officeMapIds!=''){
                 $('.store').combotree('setValues', vm.officeMapIds);
            }

        }
    })
}
/*分页*/
function queryData() {
    $.ajax({
        url: url_itcoach_manageshop,
        type: 'get',
        headers: headers,
        data: vm.param,
        contentType: 'application/json',
        success: function(result) {
//          console.log($.parseJSON(result));
            flag = false;
            vm.shopList = $.parseJSON(result).data.content;
            vm.pagenum = $.parseJSON(result).data.number;
            vm.totalpage = $.parseJSON(result).data.totalPages;
//          console.log()
            laypage({
                cont: 'pageNumber', // 容器id
                pages: $.parseJSON(result).data.totalPages, // 总页数
                groups: size, // 每页个数
                skin: '#42a6d4',
                skip: true,
                jump: function(obj, first) {
                    if (!first) {
                        data(obj.curr);
                    }
                }
            });
            
        }
    })
}

function data(currentPage) {
    vm.param.page = currentPage;
    $.ajax({
        url: url_itcoach_manageshop,
        type: 'get',
        headers: headers,
        data: vm.param,
        contentType: 'application/json',
        success: function(result) {
            if (flag) {
                laypage({
                    cont: 'pageNumber', // 容器id
                    pages: $.parseJSON(result).data.totalPages, // 总页数
                    groups: limit, // 每页个数
                    skin: '#079e75',
                    skip: true,
                    jump: function(obj, first) {
                        if (!first) {
                            data(obj.curr);
                        }
                    }
                });
            }
            flag = false;
            vm.shopList = $.parseJSON(result).data.content;
            vm.pagenum = $.parseJSON(result).data.number;

        }
    })
}


$(document).ready(function() {
    
//getLeft("","875593831181344768")
    queryData();
});
