//laypage
var flag = true;
//页面容量
var size = 10;
$(document).ready(function() {
    relogin();
    logout()
    getMenu("859217399604428800","866825106381357056");
    downSelect();
    queryData();
    showFirstRegion();
    getEnumeration();



});
//获取下拉枚举值
var getEnumeration = function() {
    $.ajax({
        url: url_get_enumeration,
        type: 'get',
        headers: headers,
        contentType: 'application/json',
        success: function(result) {
            console.log(result);
            var data = result.data;
            vm.originType = data.originType;
            vm.faultType = data.faultType;
            vm.status = data.documentStatus;

        }
    })
};

function chooseStarttime(e) {
    $('#endtime').click(function() {
        $("#endtime").datetimepicker("setStartDate", e)
    })
}
/*时间选择初始化*/
$(function() {
    $('#starttime').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'cn',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    }).on("click", function() {
        console.log($("#starttime").val());
        $("#starttime").datetimepicker("setEndDate", $("#endtime").val())
    });
    $('#endtime').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'cn',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
    });
});

//引入VUE
var vm = new Vue({
    el: '#assureCont',
    data: {
        id: [],
        originType: [],
        faultType: [],
        status: [],
        firstRegion: '',
        secondRegion: '',
        searchfirstRegion: '',
        searchsecondRegion: '',
        originName: '',
        faultName: '',
        statusName: '',
        firstregionparam: {
            parentId: 0
        },
        secRegionparam: {
            parentId: ''
        },
        param: {
            id: "",
            originType: "",
            faultType: "",
            firstRegion: '',
            secondRegion: '',
            status: "",
            beginDate: "",
            endDate: "",
            orderBy: "",
            page: 1,
            size: 10
        },
        exportparam: {
            originType: '',
            faultType: '',
            firstRegion: '',
            secondRegion: '',
            status: '',
            id: '',
            beginDate: '',
            endDate: ''
        },
        firstRegionList: [],
        secondRegionList: [],
        assureList: [],
        pagenum: '',
        totalpage: ''
    },
    methods: {
        chooseDoctype: function(originId, originName) {
            vm.param.originType = originId;
            vm.originName = originName;
            // if (originId != '') {
            vm.exportparam.originType = originId;

            // }
        },
        choosefaultType: function(faultId, faultName) {
            vm.param.faultType = faultId;
            vm.exportparam.faultType = faultId;
            vm.faultName = faultName;
        },
        choosefirstRegion: function(parentId, regionName) {
            vm.secondRegion = '';
            vm.searchsecondRegion = '';
            vm.searchfirstRegion = parentId;
            vm.firstRegion = regionName;
            vm.secRegionparam.parentId = parentId;
            vm.exportparam.firstRegion = parentId;
            showSecRegion();
        },
        choosesecRegion: function(secregionId, secregionName) {
            vm.searchsecondRegion = secregionId;
            vm.secondRegion = secregionName;
            vm.exportparam.secondRegion = secregionId;
        },
        chooseStatus: function(statusId, statusName) {
            vm.param.status = statusId;
            vm.statusName = statusName;
            vm.exportparam.status = statusId;
        },
        query: function() {
            vm.param.firstRegion = vm.searchfirstRegion;
            vm.param.secondRegion = vm.searchsecondRegion;
            queryData();
        },
        queryDetail: function() {
            queryDetailData();
        },
        exportWorkList: function() {
            vm.exportparam.id = $('#documentId').val()
            vm.exportparam.beginDate = $('#starttime').val();
            vm.exportparam.endDate = $('#endtime').val();
            exportlist();

        }
    }
});

function showFirstRegion() {
    $.ajax({
        url: url_area,
        type: "get",
        headers: headers,
        data: vm.firstregionparam,
        contentType: 'application/json',
        success: function(result) {
            vm.firstRegionList = $.parseJSON(result).data;

        }
    })
}
// 获取二级区域下拉框数据
function showSecRegion() {
    console.log(vm.secRegionparam)
    $.ajax({
        url: url_area,
        type: "get",
        headers: headers,
        data: vm.secRegionparam,
        contentType: 'application/json',
        success: function(result) {
            vm.secondRegionList = $.parseJSON(result).data;
            if (vm.secondRegionList != '') {
                $('.secondregion').show();
            } else {
                $('.secondregion').hide();

            }
        }
    })
}

var parseParam = function(param, key) {
    console.log(param)
    var paramStr = "";
    if (param instanceof String || param instanceof Number || param instanceof Boolean) {
        paramStr += "&" + key + "=" + encodeURIComponent(param);
    } else {
        $.each(param, function(i) {
            var k = key == "" ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
            paramStr += '&' + parseParam(this, k);
        });
    }
    /*  return paramStr.substr(1);*/
    console.log(paramStr.substr(1))
}


function exportlist() {
    $.ajax({
        url: url_workList_export,
        type: 'get',
        headers: headers,
        data: "id=" + vm.exportparam.id + '&originType=' + vm.exportparam.originType + '&faultType=' + vm.exportparam.faultType + '&firstRegion=' + vm.exportparam.firstRegion + '&secondRegion=' + vm.exportparam.secondRegion + '&status=' + vm.exportparam.status + '&beginDate=' + vm.exportparam.beginDate + '&endDate=' + vm.exportparam.endDate,
        dataType: 'binary',
        responseType: 'arraybuffer',
        processData: false,
        success: function(result) {
            console.log(result)
            var linkElement = document.createElement('a');
            try {
                var arrayBufferView = new Uint8Array(result);
                var blob = new Blob([arrayBufferView], { type: 'application/vnd.ms-excel' });
                var url = window.URL.createObjectURL(blob);
                linkElement.setAttribute('href', url);
                linkElement.setAttribute("download", 'work_order.xls');
                var clickEvent = new MouseEvent("click", {
                    "view": window,
                    "bubbles": true,
                    "cancelable": false
                });
                linkElement.dispatchEvent(clickEvent);
            } catch (ex) {
                console.log(ex);
            }
        }
    })
}
/*分页*/
function queryData() {
    vm.param.id = $('#documentId').val();
    vm.param.beginDate = $('#starttime').val();
    vm.param.endDate = $('#endtime').val();
    console.log(vm.param)
    $.ajax({
        url: url_workList,
        type: "get",
        headers: headers,
        data: vm.param,
        contentType: 'application/json',
        success: function(result) {
            laypage({
                cont: 'pageNumber', // 容器id
                pages: result.data.totalPages, // 总页数
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
            vm.assureList = result.data.content;
            vm.pagenum = result.data.number;
            vm.totalpage = result.data.totalPages;

        }
    })
}

function data(currentPage) {
    vm.param.page = currentPage;
    $.ajax({
        url: url_workList,
        type: "get",
        headers: headers,
        data: vm.param,
        contentType: 'application/json',
        success: function(result) {
            if (flag) {
                laypage({
                    cont: 'pageNumber', // 容器id
                    pages: result.data.totalPages, // 总页数
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
            vm.assureList = result.data.content;
            vm.pagenum = result.data.number;

        }
    })
}

/*下拉框选择(渲染效果)*/
function downSelect() {
    $(document).click(function() {
        $(".sup-type").fadeOut();
    });

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
    $('.sup-type').bind('click', function(e) {
        stopPropagation(e);
    });
    $('.sup-type').on('click', 'li', function() {
        $(this).addClass('cur').siblings().removeClass('cur');
        $(this).parents('.sup-type').fadeOut();
        $(this).css('border-color', '#ccc');
        var val = $(this).text();
        $(this).parents('.sup-type').siblings('input').val(val);
    });

}
// 引入详情VUE
var vmDetail = new Vue({
    el: "#alertCont",
    data: {
        docid: "",
        status: "",
        itName: "",
        statuscode: "",
        detail: [],
        picture: [],
        solutions: [],
        solutionpicture: []
    }
})
// 获取工单详情
function queryDetailData(docId, status, itName) {
    $('.table-cont').hide();
    $('.alert-cont').show();
    $('.nav').height($('.right-cont').height());
    vmDetail.docid = docId;
    vmDetail.status = status;
    vmDetail.itName = itName;
    console.log(itName)
    $.ajax({
        url: url_workListDetail + docId,
        headers: headers,
        success: function(result) {
            vmDetail.detail = result.data;
            vmDetail.detail.solutions = result.data.solutions.reverse();
            console.log(vmDetail.detail.picture);
            vmDetail.statuscode = result.data.statusCode.code;
            var picArry = result.data.picture.split("|");
            vmDetail.picture = picArry;
            vmDetail.$nextTick(function() {
                var $input = $('input.rating');
                if ($input.length) {
                    $input.removeClass('rating-loading').addClass('rating-loading').rating();
                }
            });

        }
    })


}