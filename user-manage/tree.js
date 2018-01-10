     $('#treeDemo').multiselect({
     	nonSelectedText: '请选择所属区域',
	 	nSelectedText: '个被选中',
	 	enableClickableOptGroups: true,
	 	numberDisplayed: 2
     });
 var optgroups = [
		        {
		            label: 'Group 1', children: [
		                {label: 'Option 1.1', value: '1-1', selected: true},
		                {label: 'Option 1.2', value: '1-2'},
		                {label: 'Option 1.3', value: '1-3'}
		            ]
		        },
		        {
		            label: 'Group 2', children: [
		                {label: 'Option 2.1', value: '1'},
		                {label: 'Option 2.2', value: '2'},
		                {label: 'Option 2.3', value: '3', disabled: true}
		            ]
		        }
		    ];
	    	console.log(res)
	    	res.data.forEach(function(eval){
	    		res.data.forEach(function(rr){
	    			console.log(eval.id,rr.parentId)
	    			if(eval.id==rr.parentId){
	    				console.log(eval)
	    			}else{
	    				
	    			}
	    		})
	    	})
	    	 $('#treeDemo').multiselect('dataprovider', optgroups);