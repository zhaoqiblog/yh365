

//laypage
var flag = true;
//页面容量
var size = 10;
$(document).ready(function() {
    getMenu("","875593151485992960");
    queryData();

    
});

/*分页*/
  laypage({
    cont: 'pageNumber', //注意，这里的 test1 是 ID，不用加 # 号
    pages: 50,//总页数
    groups: 5, // 显示几页
    skin: '#42a6d4',
//  first:"<<",
//  next:"ooo",
    skip: true,
    jump:function(x,y){
    	console.log(x,y)
    }
  });
  //查看
  $('body').on('click', '.alert-btn', function() {
    $('.table-cont').hide();
    $('.detail-cont').show();
}).on('click', '.back-btn', function() {
    $('.alert-cont,.add-cont').hide();
    $('.table-cont').show();
});
function queryData() {
	
}
