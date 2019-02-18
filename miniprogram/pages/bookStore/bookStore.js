Page({
	/**
	 * 页面的初始数据
	 */
	data:{
		
	},
	
	tolist(e){
        wx.navigateTo({
        url: '../list/list?type=' + e.currentTarget.dataset.type
    })
    }
})