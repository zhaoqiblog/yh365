//laypage
var flag = true;
//页面容量
var size = 10;

$('body').on('click', '.add-btn', function() {
    $('.table-cont').hide();
    $('.add-cont').show();
}).on('click', '.back-btn', function() {
    $('.alert-cont,.add-cont').hide();
    $('.table-cont').show();
});

function setstartdate(e) {
    $('#endtime').click(function() {
        $("#endtime").datetimepicker("setStartDate", e)
    })
}
/*时间选择初始化*/
$(function() {
	relogin()
    $('#starttime').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'fr',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    }).on("click", function() {
        $("#starttime").datetimepicker("setEndDate", $("#endtime").val())
    });
    $('#endtime').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'fr',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
    });
});
/**
 * 表格分页
 */

//引入VUE
var vm = new Vue({
    el: '#articleCont',
    data: {
        addcoverimg: '',
        alertsummary: '',
        alertstatus: '',
        searchparam: {
            title: "",
            beginDate: "",
            endDate: "",
            page: 1,
            size: 10
        },
        alertparam: {
            "id": "",
            "image": "",
            "postId": '',
            "sort": 0,
            "status": "",
            "title": ""
        },
        addparam: {
            "id": "",
            "image": "",
            "postId": '',
            "sort": 0,
            "status": "",
            "title": ""
        },
        deleteparam: [],
        articleDetail: [],
        articleList: [],
        pagenum: '',
        totalpage: ''
    },
    methods: {
        alertArticle: function(id, title, image, status, postId) {
            console.log(status);
            vm.alertparam.id = id;
            vm.alertparam.title = title;
            vm.addcoverimg = image;
            vm.alertstatus = status == 0 ? "ENABLED" : "DISABLE";
            vm.alertparam.postId = postId;
            $('.table-cont').hide();
            $('.alert-cont').show();
        },
        addArticle: function() {
            addarticle();
        },
        alertArticleDetail: function() {
              // 封面
        var imgpath = vm.addcoverimg.substring(vm.addcoverimg.lastIndexOf('/upload'), vm.addcoverimg.length);
        vm.alertparam.image = vm.alertparam.image == '' ? imgpath : (vm.alertparam.image);
            vm.alertparam.status = vm.alertstatus;
            console.log(vm.alertparam)
            console.log(vm.alertparam);
            $.ajax({
                url: url_get_banner,
                type: "put",
                headers: headers,
                data: JSON.stringify(vm.alertparam),
                contentType: 'application/json',
                success: function(result) {
                    $('.pop').show();
                    $('.pop-cont').html(result.message);
                    setTimeout(function() {
                        $(".pop").hide();
//                      location.reload();
                    }, 1000)
                },
                error: function() {
                    alert("请填写所有参数！")
                }
            })
        },
        query: function() {
            queryData();
        },
        deleteConfirm: function() {
            if ($('.checkitem:checked').length >= 1) {
                $('#deleteModal').modal('show');
                $('.modal-body').html("确定删除吗？");
                $('.btn-primary').show();
            } else {
                $('#deleteModal').modal('show');
                $('.modal-body').html("请选择要删除的banner！")
                $('.btn-primary').hide();
            }
        },
        deleteArticle: function() {
            $('.checkitem').each(function() {
                if ($(this).prop('checked')) {
                    var id = $(this).parent().siblings('.listid').text();
                    (vm.deleteparam).push(id);
                    $.ajax({
                        url: url_main + 'isp/api/v1/protected/banners?bannerIds=' + (vm.deleteparam).toString(),
                        type: 'delete',
                        contentType: 'application/json',
                        headers: headers,
                        success: function(result) {
                            console.log(result);
                            $('#deleteModal').modal('hide');
                            $('.pop').show();
                            $('.pop-cont').html(JSON.parse(result).message);
                            setTimeout(function() {
                                $(".pop").hide();
                                location.reload();
                            }, 1000)
                        }
                    })
                }
            });
        }
    }
});
// 添加小知识
var addarticle = function() {
        /*  var link = localStorage.getItem('link');
          vm.addparam.image = link;*/
        $.ajax({
            url: url_get_banner,
            type: "post",
            headers: headers,
            data: JSON.stringify(vm.addparam),
            contentType: 'application/json',
            success: function(result) {
                $('.pop').show();
                $('.pop-cont').html(result.message);
                setTimeout(function() {
                    $(".pop").hide();
                    localStorage.setItem('link', '');
                    location.reload();
                }, 1000)
            },
            error: function() {
                alert("请填写所有参数！")
            }
        })
    }
    // 选择小知识
var checkArticle = function() {
        var $thr = $('table thead tr');
        var $checkAll = $thr.find('input');
        var $tbr = $('#person-list tr');
        var $checkAllTh = $('.checkth');
        $('#checkAll').click(function(e) {
            $tbr.find('input').prop('checked', $(this).prop('checked'));
            if ($(this).prop('checked')) {
                $tbr.find('input').parents('tr').addClass('warning');
            } else {
                $tbr.find('input').parents('tr').removeClass('warning');
            }
            stopPropagation(e);
        });
        $('.checkth').click(function() {
            $(this).find('input').click();
        });
        $('#person-list tr').click(function() {
            $(this).find('input').click();
        });
        $tbr.find('input').click(function(e) {
            $(this).parent().parent().toggleClass('warning');
            $checkAll.prop('checked', $tbr.find('input:checked').length == $tbr.length ? true : false);
            stopPropagation(e);
        });
        $tbr.click(function() {
            $(this).find('input').click();
        });
    }
    /*分页*/
function queryData() {
    vm.searchparam.beginDate = $('#starttime').val();
    vm.searchparam.endDate = $('#endtime').val();
    vm.searchparam.title = $('.title').val();
    console.log(vm.searchparam)
    $.ajax({
        url: url_get_banner,
        type: "get",
        headers: headers,
        data: vm.searchparam,
        contentType: 'application/json',
        success: function(result) {
            console.log($.parseJSON(result));
            laypage({
                cont: 'pageNumber', // 容器id
                pages: $.parseJSON(result).data.totalPages, // 总页数
                groups: size, // 每页个数
                skin: '#079e75',
                skip: true,
                jump: function(obj, first) {
                    if (!first) {
                        data(obj.curr);
                    }
                }
            });
            flag = false;
            vm.articleList = $.parseJSON(result).data.content;
            console.log(vm.articleList);
            vm.pagenum = $.parseJSON(result).data.number;
            vm.totalpage = $.parseJSON(result).data.totalPages;
            vm.$nextTick(function() {
                checkArticle();
            })
        }
    })
}

function data(currentPage) {
    vm.searchparam.page = currentPage;
    $.ajax({
        url: url_get_banner,
        type: "get",
        headers: headers,
        data: vm.searchparam,
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
            vm.articleList = $.parseJSON(result).data.content;
            vm.pagenum = $.parseJSON(result).data.number;

        }
    })
}



// $(function() {

/*     var ue = UE.getEditor('editor', {
         toolbars: [
             ["simpleupload"]
         ],
         maximumWords: [1]
     });
     var alertue = UE.getEditor('alerteditor', {
         toolbars: [
             ["simpleupload"]
         ],
         maximumWords: [1]
     });*/
/*var proinfo = $(".alert-img-hide").html();
alertue.ready(function() { //编辑器初始化完成再赋值
    console.log(proinfo);
    alertue.setContent(proinfo); //赋值给UEditor
});*/

// });
var addimgdialog,
    alertimgdialog;

$(document).ready(function() {
    queryData();
    
    // 添加
    addimgdialog = UE.getEditor('coverimg');
    addimgdialog.ready(function() {
        addimgdialog.setDisabled();
        addimgdialog.hide();
        addimgdialog.addListener('beforeInsertImage', function(t, arg) {
            vm.addcoverimg = arg[0].file;
            vm.addparam.image = arg[0].url;
        })
    });
    // 修改
    alertimgdialog = UE.getEditor('alertcoverimg');
    alertimgdialog.ready(function() {
        alertimgdialog.setDisabled();
        alertimgdialog.hide();
        alertimgdialog.addListener('beforeInsertImage', function(t, arg) {
            vm.addcoverimg = arg[0].file;
            vm.alertparam.image = arg[0].url;
        })
    });
});

function openImgDialog() {
    var myFiles = addimgdialog.getDialog("insertimage");
    myFiles.open();
}

function alertImgDialog() {
    var myFiles = alertimgdialog.getDialog("insertimage");
    myFiles.open();
}
