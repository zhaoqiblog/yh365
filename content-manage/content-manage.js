//laypage
var flag = true;
//页面容量
var size = 10;

$('body').on('click', '.add-btn', function() {
    $('.table-cont').hide();
    $('.add-cont').show();
    $('.nav-menu').height($('.right-cont').height());
    getDropCategory();

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
//	$("#menuTree").height($(document).height()-$("header").height())
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
        alertsummary: '',
        alertimageurl: '',
        uploadfilelist: [],
        alertfilelist: [],
        alertdetailtitle: '',
        alertdetailsummary: '',
        addcoverimg: '',
        addcaseimg: [],
        searchparam: {
            title: "",
            beginDate: "",
            endDate: "",
            page: 1,
            size: 10
        },
        querytypeparam: {
            parentId: 1
        },
        categoryIds: [],
        addfirstcategory: [],
        addsecondcategory: [],
        addthirdcategory: [],
        firstcategory: '',
        secondcategory: '',
        thirdcategory: '',
        addparam: {
            "cases": "",
            "categoryId": "",
            "categoryIds": "",
            "categoryPath": "",
            "content": "",
            "documents": [],
            "image": "",
            "isHot": 0,
            "postStatus": 0,
            "summary": "",
            "title": ""
        },
        articleId: '',
        deleteparam: [],
        articleDetail: [],
        articleList: [],
        pagenum: '',
        totalpage: '',
        firstcategoryid: '',
        seccategoryid: '',
        thirdcategoryid: ''
    },
    methods: {
        alertArticle: function(articleId, poststatus, isHot) {
            $('.table-cont').hide();
            $('.alert-cont').show();
            $('.nav-menu').height($('.right-cont').height());
            vm.addparam.isHot = isHot;
            console.log(vm.addparam.isHot);
            vm.addparam.postStatus = poststatus;
            getDetail(articleId);
            getDropCategory();
            vm.articleId = articleId;
        },
        addArticle: function() {
            addarticle();
        },
        alertArticleDetail: function() {
            alertDetail();

        },
        searchSecondCategory: function(typeid, typename) {
            vm.firstcategory = typename;
            vm.firstcategoryid = typeid;
            vm.seccategoryid = '';
            vm.secondcategory = '';
            vm.thirdcategoryid = '';
            vm.thirdcategory = '';
            vm.querytypeparam.parentId = typeid;
            getSecondDropCategory();
        },
        searchThirdCategory: function(typeid, typename) {
            vm.seccategoryid = typeid;
            vm.secondcategory = typename;
            vm.querytypeparam.parentId = typeid;
            getThirdDropCategory();

        },
        chooseThirdCategory: function(typeid, typename) {
            vm.thirdcategoryid = typeid;
            vm.addparam.categoryId = typeid;
            vm.thirdcategory = typename;

        },
        query: function() {
            queryData();
        },
        goDetail: function(articleid) {
            $('.table-cont').hide();
            $('.detail-cont').show();
            getDetail(articleid);

        },
        deleteConfirm: function() {
            if ($('.checkitem:checked').length >= 1) {
                $('#deleteModal').modal('show');
                $('.modal-body').html("确定删除小知识吗？");
                $('.btn-primary').show();
            } else {
                $('#deleteModal').modal('show');
                $('.modal-body').html("请选择要删除的小知识！")
                $('.btn-primary').hide();
            }
        },
        deleteArticle: function() {
            $('.checkitem').each(function() {
                if ($(this).prop('checked')) {
                    var id = $(this).parent().siblings('.listid').text();
                    (vm.deleteparam).push(id);
                    $.ajax({
                        url: url_main + 'isp/api/v1/protected/posts?postIds=' + (vm.deleteparam).toString(),
                        type: 'delete',
                        contentType: 'application/json',
                        headers: headers,
                        success: function(result) {
                            $('#deleteModal').modal('hide');
                            $('.pop').show();
                            $('.pop-cont').css({ 'background': '#0dcb9c', 'color': '#fff' });
                            $('.pop-cont').html('<span class="i-ok inline-block"></span>' + JSON.parse(result).message);
                            setTimeout(function() {
                                $(".pop").hide();
                                queryData();
                            }, 1000)

                        }
                    })
                }
            });
        },
        deleteCaseImg: function(item) {
            vm.addcaseimg = vm.addcaseimg.filter(function(caseimg) {
                return caseimg.file != item.file;
            });
        },
        deleteDocument: function(item) {
            vm.uploadfilelist = vm.uploadfilelist.filter(function(doc) {
                return doc.file != item.file;
            });
        }
    }
});

var getDetail = function(articleid) {
    $.ajax({
        url: url_get_article + '/' + articleid,
        type: 'get',
        contentType: 'application/json',
        headers: headers,
        success: function(r) {
            vm.articleDetail = JSON.parse(r).data;
            vm.uploadfilelist = JSON.parse(r).data.documents;
            vm.alertdetailtitle = JSON.parse(r).data.title;
            vm.alertdetailsummary = JSON.parse(r).data.summary;
            vm.addcoverimg = JSON.parse(r).data.image;
            UE.getEditor('alertcontent').setContent(JSON.parse(r).data.content);
            vm.addcaseimg = JSON.parse(r).data.cases;
            var alertcategoryIds = [];
            alertcategoryIds = JSON.parse(r).data.categoryIds.split(',');
            if (alertcategoryIds.length >= 0) {
                $.ajax({
                    url: url_option_category + '/' + alertcategoryIds[0],
                    type: 'get',
                    contentType: 'application/json',
                    headers: headers,
                    success: function(r) {
                        vm.firstcategory = JSON.parse(r).data.name;
                        vm.firstcategoryid = JSON.parse(r).data.id;
                        $.ajax({
                            url: url_option_category + '/' + alertcategoryIds[1],
                            type: 'get',
                            contentType: 'application/json',
                            headers: headers,
                            success: function(r) {
                                vm.secondcategory = JSON.parse(r).data.name;
                                vm.seccategoryid = JSON.parse(r).data.id
                                $.ajax({
                                    url: url_option_category + '/' + alertcategoryIds[2],
                                    type: 'get',
                                    contentType: 'application/json',
                                    headers: headers,
                                    success: function(r) {
                                        vm.addparam.categoryId = JSON.parse(r).data.id;
                                        vm.thirdcategory = JSON.parse(r).data.name;
                                        vm.thirdcategoryid = JSON.parse(r).data.id;
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
    })
}
var getDropCategory = function() {
    $.ajax({
        url: url_option_category,
        type: 'get',
        contentType: 'application/json',
        headers: headers,
        data: vm.querytypeparam,
        success: function(result) {
            vm.addfirstcategory = JSON.parse(result).data;
            console.log(JSON.parse(result))
        }
    })
}
var getSecondDropCategory = function() {
    $.ajax({
        url: url_option_category,
        type: 'get',
        contentType: 'application/json',
        headers: headers,
        data: vm.querytypeparam,
        success: function(result) {
            vm.addsecondcategory = JSON.parse(result).data;
            console.log(JSON.parse(result))
        }
    })
}
var getThirdDropCategory = function() {
    $.ajax({
        url: url_option_category,
        type: 'get',
        contentType: 'application/json',
        headers: headers,
        data: vm.querytypeparam,
        success: function(result) {
            vm.addthirdcategory = JSON.parse(result).data;
            console.log(JSON.parse(result))
        }
    })
}
//参数定义
var paramDefined = function() {
    var content = UE.getEditor('addcontent').getContent();
    vm.addparam.content = content;
    // 获取文档参数
    var filelist = vm.uploadfilelist;
    var listarry = [];
    for (i = 0; i < filelist.length; i++) {
        var file = filelist[i].file;
        var filename = filelist[i].fileName;
        var size = filelist[i].size;
        var list = { 'file': file, 'fileName': filename };
        listarry.push(list);
    }
    vm.addparam.documents = listarry;
    // 获取图片参数
    var imgarry = [];
    for (i = 0; i < vm.addcaseimg.length; i++) {
        var img = vm.addcaseimg[i].url;
        if (img != undefined) {
            imgarry.push(img);
        }
    }
    vm.addparam.cases = imgarry.toString();
    vm.addparam.categoryPath = vm.firstcategory + '>' +
        vm.secondcategory + '>' + vm.thirdcategory;
    vm.categoryIds = [];
    if (vm.firstcategoryid != '' && vm.seccategoryid != '' && vm.thirdcategoryid != '') {
        vm.categoryIds.push(vm.firstcategoryid, vm.seccategoryid, vm.thirdcategoryid);
    }
    // vm.categoryIds = categorys;
    vm.addparam.categoryIds = vm.categoryIds.toString();
    console.log(vm.addparam.categoryIds);
}
var alertDetail = function() {
    paramDefined();
    var content = UE.getEditor('alertcontent').getContent();
    vm.addparam.content = content;
    vm.addparam.summary = vm.alertdetailsummary;
    vm.addparam.title = vm.alertdetailtitle;
    var alertparam = vm.addparam;
    alertparam.id = vm.articleId;
    // 封面
    var imgpath = vm.addcoverimg.substring(vm.addcoverimg.lastIndexOf('/upload'), vm.addcoverimg.length);
    vm.addparam.image = vm.addparam.image == '' ? imgpath : (vm.addparam.image);
    // 案例
    var casespath = [];
    $('.alertcase-item').each(function(index, item) {
        console.log(item)
        var casepath = $(item).find('img').attr('src').substring($(item).find('img').attr('src').lastIndexOf('/upload'), $(item).find('img').attr('src').length);
        casespath.push(casepath);
    });
    vm.addparam.cases = casespath.toString();
    console.log(casespath.toString())
    // 文档
    var documents = vm.addparam.documents;
    var documentsArry = [];
    for (i = 0; i < documents.length; i++) {
        var newfile = documents[i].file.substring(documents[i].file.lastIndexOf('/upload'), documents[i].file.length);
        var newlist = { 'file': newfile, 'fileName': documents[i].fileName };
        documentsArry.push(newlist);
    }
    vm.addparam.documents = documentsArry;
    if (vm.addparam.isHot == 0) {
        if (vm.addparam.title == '' || vm.addparam.summary == '' || vm.addparam.image == '' || vm.addparam.categoryIds == '') {
            $('.pop').show();
            $('.pop-cont').css({ 'background': '#df6060', 'color': '#fff' });
            $('.pop-cont').html('<span class="i-no inline-block"></span>热点文章标题、摘要、封面图，分类必填');
            setTimeout(function() {
                $(".pop").hide();
                $('.pop-cont').html('');
            }, 1000)
        } else {
            alert(alertparam);
        }
    } else if (vm.addparam.isHot == 1) {
        if (vm.addparam.title == '' || vm.addparam.categoryIds == '') {
            $('.pop').show();
            $('.pop-cont').html("文章标题、分类不能为空！");
            setTimeout(function() {
                $(".pop").hide();
                $('.pop-cont').html('');
            }, 1000)
        } else {
            alert(alertparam);
        }
    }
}
var alert = function(alertparam) {
    $.ajax({
        url: url_get_article,
        type: "put",
        headers: headers,
        data: JSON.stringify(alertparam),
        contentType: 'application/json',
        success: function(result) {
            var mesg = result.message;
            if (result.success == true) {
                showOkPop(mesg);
            } else {
                showErrorPop(mesg)
            }
        },
        error: function() {
            showError();
        }
    })
}
// 添加小知识

var addarticle = function() {
    paramDefined();
    if (vm.addparam.isHot == 0) {
        if (vm.addparam.title == '' || vm.addparam.summary == '' || vm.addparam.image == '' || vm.addparam.categoryIds == '') {
            $('.pop').show();
            $('.pop-cont').css({ 'background': '#df6060', 'color': '#fff' });
            $('.pop-cont').html('<span class="i-no inline-block"></span>热点文章标题、摘要、封面图，分类不能为空');
            setTimeout(function() {
                $(".pop").hide();
                $('.pop-cont').html('');
            }, 1000)
        } else {
            add();
        }
    } else if (vm.addparam.isHot == 1) {
        if (vm.addparam.title == '' || vm.addparam.categoryIds == '') {
            $('.pop').show();
            $('.pop-cont').html("普通文章标题、分类必填！");
            setTimeout(function() {
                $(".pop").hide();
                $('.pop-cont').html('');
            }, 1000)
        } else {
            add();
        }
    }
}
var add = function() {
    $.ajax({
        url: url_get_article,
        type: "post",
        headers: headers,
        data: JSON.stringify(vm.addparam),
        contentType: 'application/json',
        success: function(result) {
            var mesg = result.message;
            if (result.success == true) {
                showOkPop(mesg);
            } else {
                showErrorPop(mesg)
            }
        },
        error: function() {
            showError();
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
//  console.log(vm.searchparam)
    $.ajax({
        url: url_get_article,
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
                skin: '#42a6d4',
                skip: true,
                jump: function(obj, first) {
                    if (!first) {
                        data(obj.curr);
                    }
                }
            });
            flag = false;
            vm.articleList = $.parseJSON(result).data.content;
            vm.pagenum = $.parseJSON(result).data.number;
            vm.totalpage = $.parseJSON(result).data.totalPages;
            vm.$nextTick(function() {
                checkArticle();
                $('.nav-menu').height($('.right-cont').height() + 60);

            })
        }
    })
}

function data(currentPage) {
    vm.searchparam.page = currentPage;
    $.ajax({
        url: url_get_article,
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
            vm.articleList = $.parseJSON(result).data.content;
            vm.pagenum = $.parseJSON(result).data.number;

        }
    })
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
    $('.sup-type').bind('click', function(e) {
        stopPropagation(e);
    });
    $('.sup-type').on('click', 'li', function() {
        $(this).addClass('cur').siblings().removeClass('cur');
        $(this).parents('.sup-type').fadeOut();
        $(this).css('border-color', '#ccc');
    });

}
var _addeditor;
var _alerteditor;
var addimgdialog;
var addcasedialog;
var alertimgdialog;
var alertcasedialog;
$(document).ready(function() {
    relogin();
    downSelect();
    queryData();
   
    // 添加小知识
    // 添加封面图片
    addimgdialog = UE.getEditor('coverimg');
    addimgdialog.ready(function() {
        addimgdialog.setDisabled();
        addimgdialog.hide();
        addimgdialog.addListener('beforeInsertImage', function(t, arg) {
            vm.addcoverimg = arg[0].file;
            vm.addparam.image = arg[0].url;
        })
        console.log("3")
    });
    // 添加案例
    addcasedialog = UE.getEditor('caseimg');
    addcasedialog.ready(function() {
        addcasedialog.setDisabled();
        addcasedialog.hide();
        addcasedialog.addListener('beforeInsertImage', function(t, arg) {
            vm.addcaseimg = vm.addcaseimg.concat(arg);
        })
    });
    //添加富文本
    var addcontent = UE.getEditor('addcontent');
    //重新实例化一个编辑器，防止在上面的editor编辑器中显示上传的图片或者文件
    _addeditor = UE.getEditor('upload_file');
    _addeditor.ready(function() {
        //设置编辑器不可用
        _addeditor.setDisabled();
        //隐藏编辑器，因为不会用到这个编辑器实例，所以要隐藏
        _addeditor.hide();
        //侦听文件上传
        _addeditor.addListener('afterUpfile', function(t, arg) {
            vm.uploadfilelist = vm.uploadfilelist.concat(arg);
        })
    });
    // 修改小知识
    // 修改封面图片
    alertimgdialog = UE.getEditor('alertcoverimg');
    alertimgdialog.ready(function() {
        alertimgdialog.setDisabled();
        alertimgdialog.hide();
        alertimgdialog.addListener('beforeInsertImage', function(t, arg) {
            vm.addcoverimg = arg[0].file;
            vm.addparam.image = arg[0].url;
        })
    });
    // 修改案例
    alertcasedialog = UE.getEditor('alertcaseimg');
    alertcasedialog.ready(function() {
        alertcasedialog.setDisabled();
        alertcasedialog.hide();
        alertcasedialog.addListener('beforeInsertImage', function(t, arg) {
            vm.addcaseimg = vm.addcaseimg.concat(arg);
        })
    });
    //修改富文本
    var alertcontent = UE.getEditor('alertcontent');

    //重新实例化一个编辑器，防止在上面的editor编辑器中显示上传的图片或者文件
    _alerteditor = UE.getEditor('alertupload_file');
    _alerteditor.ready(function() {
        //设置编辑器不可用
        _alerteditor.setDisabled();
        //隐藏编辑器，因为不会用到这个编辑器实例，所以要隐藏
        _alerteditor.hide();
        //侦听文件上传，取上传文件列表中第一个上传的文件的路径
        _alerteditor.addListener('afterUpfile', function(t, arg) {
            vm.uploadfilelist = vm.uploadfilelist.concat(arg);
        })
    });

    // 控制浏览器返回状态
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function() {
            var hashLocation = location.hash;
            var hashSplit = hashLocation.split("#!/");
            var hashName = hashSplit[1];
            if (hashName !== '') {
                var hash = window.location.hash;
                console.log(hash)
                if (hash === '') {
                    location.href = "content-manage.html"
                }
            }
        });

        window.history.pushState('forward', null, 'content-manage.html');
    }
});
//弹出添加文件上传的对话框
function upFiles() {
    var myFiles = _addeditor.getDialog("attachment");
    myFiles.open();
}
//弹出修改文件上传的对话框
function alertupFiles() {
    var myFiles = _alerteditor.getDialog("attachment");
    myFiles.open();
}

function openImgDialog() {
    var myFiles = addimgdialog.getDialog("insertimage");
    myFiles.open();
    console.log("1")
}

function opencaseDialog() {
    var myFiles = addcasedialog.getDialog("insertimage");
    myFiles.open();
}

function alertImgDialog() {
    var myFiles = alertimgdialog.getDialog("insertimage");
    myFiles.open();
}

function alertCaseDialog() {
    var myFiles = alertcasedialog.getDialog("insertimage");
    myFiles.open();
}