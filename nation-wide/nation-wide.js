//laypage
var flag = true;
//页面容量
var size = 10;
$(document).ready(function() {
    
    queryData();


});
//引入VUE
var vm = new Vue({
    el: '#nationCont',
    data: {
        id: [],
        param: {
            beginDate: "",
            endDate: "",
            page: 1,
            size: 10
        },
        nationList: [],
        pagenum: '',
        totalpage: ''
    },
});
/*分页*/
function queryData() {
    vm.startDate = $('#starttime').val();
    vm.endDate = $('#endtime').val();
    $.ajax({
        url: url_national_situation,
        type: "get",
        headers: headers,
        data: vm.param,
        contentType: 'application/json',
        success: function(result) {
            /*  laypage({
                  cont: 'pageNumber', // 容器id
                  pages: result.data.totalPages, // 总页数
                  groups: size, // 每页个数
                  skin: '#079e75',
                  skip: true,
                  jump: function(obj, first) {
                      if (!first) {
                          data(obj.curr);
                      }
                  }
              });*/
            flag = false;
            vm.nationList = result.data;
            /*
                        vm.pagenum = result.data.number;
                        vm.totalpage = result.data.totalPages;*/
        }
    })
}

/*function data(currentPage) {
    vm.param.page = currentPage;
    $.ajax({
        url: url_national_situation,
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
            vm.nationList = result.data.content;
            vm.pagenum = result.data.number;

        }
    })
}
*/
