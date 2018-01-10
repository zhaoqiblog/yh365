var vm = new Vue({
    el: "#settime",
    data: {
        param: [{
            paramKey: "job_workOrder_after_time_1",
            paramValue: '',
        }, {
            paramKey: "job_workOrder_after_time_2",
            paramValue: '',
        }, {
            paramKey: "job_workOrder_after_time_4",
            paramValue: '',
        }]
    },
    methods: {
        settime: function() {
            if (vm.param[1].paramValue <= vm.param[0].paramValue) {
                alert("通知协调人时间不能小于IT教练接单时间")
            } else if ((vm.param[2].paramValue) * 60 <= vm.param[1].paramValue && vm.param[2].paramValue <= vm.param[0].paramValue) {
                alert("滞留时间不能小于IT教练接单时间和通知协调人时间")
            } else {
                submitdata();

            }
        }
    }


})

function submitdata() {
    vm.param[0].paramValue = parseInt(vm.param[0].paramValue);
    vm.param[1].paramValue = parseInt(vm.param[1].paramValue);
    vm.param[2].paramValue = parseInt(vm.param[2].paramValue);
    $.ajax({
        url: url_get_common_param,
        type: 'put',
        dataType: 'json',
        headers: headers,
        data: '{"params":' + JSON.stringify(vm.param) + '}',
        contentType: 'application/json',
        success: function(result) {
            alert(result.message)
        }
    })
}

function getBaseData() {
    $.ajax({
        url: url_get_common_param,
        type: 'get',
        dataType: 'json',
        headers: headers,
        success: function(result) {
        	console.log(result)
            vm.param[0].paramValue = result.data[0].param_value;
            vm.param[1].paramValue = result.data[1].param_value;
            vm.param[2].paramValue = result.data[3].param_value;
            console.log(result)
        }
    })
}
$(document).ready(function() {
    
    getBaseData()
});
