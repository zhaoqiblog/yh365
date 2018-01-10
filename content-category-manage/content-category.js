$(document).ready(function() {
	logout()
	relogin()
    getMenu("875593547210186752","879535374133039104");
    getCategory();

});
var vm = new Vue({
    el: "#category-cont",
    data: {
        editparam: {
            "description": "",
            "href": "",
            "id": "",
            "image": "",
            "isShow": "true",
            "name": "",
            "parentId": 0,
            "siteId": 1,
            "sort": '',
            "target": "BLANK"
        },
        addparam: {
            "description": "",
            "href": "",
            "image": "",
            "isShow": "true",
            "name": "",
            "parentId": "",
            "siteId": 1,
            "sort": 10,
            "target": "BLANK"
        },
        categoryId: ''
    },
    methods: {
        deletetype: function() {
        	console.log("pppp")
            deleteCategory();
        },
        addtype: function() {
            addCategory();
        }
    }
});

function getCategory() {
    $.ajax({
        url: url_getarticle_category,
        type: 'get',
        headers: headers,
        contentType: 'application/json',
        success: function(result) {
            // console.log($.parseJSON(result));
            console.log(result);
            $('.category').tree({
                data: result.data,
                onBeforeLoad: function() {},
                multiple: true,
                panelHeight: 'auto',
                animate: true,
                onClick: function(node) {

                    vm.categoryId = node.id;
                    $('.optbtn-add').removeClass('disabled').addClass('add-category');
                    $('.optbtn-delete').removeClass('disabled').addClass('delete-type');

                },
                onDblClick: function(node) {
                    $(this).tree('beginEdit', node.target);
                },
                onAfterEdit: function(node) {
                    var parent = $(this).tree("getParent", node.target);
                    vm.addparam.parentId = parent.id;
                    vm.editparam.parentId = parent.id;
                    if (node.id == '') {
                        vm.addparam.name = node.text;
                        console.log(vm.addparam);
                        $.ajax({
                            url: url_option_category,
                            type: 'post',
                            headers: headers,
                            contentType: 'application/json',
                            data: JSON.stringify(vm.addparam),
                            success: function(result) {
                                $('.pop').show();
                                $('.pop-cont').html(result.message);
                                setTimeout(function() {
                                    $(".pop").hide();
                                    getCategory();
                                    $('.optbtn-add').removeClass('add-category').addClass('disabled');
                                    $('.optbtn-delete').removeClass('delete-type').addClass('disabled');
                                }, 1000)
                            }
                        });
                    } else {
                        vm.editparam.name = node.text;
                        vm.editparam.id = node.id;
                        console.log(node.id);
                        $.ajax({
                            url: url_option_category,
                            type: 'put',
                            headers: headers,
                            contentType: 'application/json',
                            data: JSON.stringify(vm.editparam),
                            success: function(result) {
                                $('.pop').show();
                                $('.pop-cont').html(result.message);
                                setTimeout(function() {
                                    $(".pop").hide();
                                    getCategory();
                                    $('.optbtn-add').removeClass('add-category').addClass('disabled');
                                    $('.optbtn-delete').removeClass('delete-type').addClass('disabled');

                                }, 1000)

                            }
                        });
                    }
                },
            });
        }
    })
}
// 删除知识
function deleteCategory() {
	console.log("kkkk")
    $.ajax({
        url: url_main + 'isp/api/v1/protected/categorys/' + vm.categoryId,
        type: 'delete',
        contentType: 'application/json',
        headers: headers,
        success: function(result) {
            $('.pop').show();
            $('.pop-cont').html(JSON.parse(result).message);
            setTimeout(function() {
                $(".pop").hide();
                getCategory();
                $('.optbtn-add').removeClass('add-category').addClass('disabled');
                $('.optbtn-delete').removeClass('delete-type').addClass('disabled');
            }, 1000)
        }
    })
}
//添加知识
function addCategory() {
    var node = $('.category').tree('getSelected');
    if (node) {
        var nodes = [{
            "id": '',
            "text": "新菜单"
        }];
        $('.category').tree('append', {
            parent: node.target,
            data: nodes
        });
    }
}
