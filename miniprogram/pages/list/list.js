Page({
	/**
	 * 页面的初始数据
	 */
	data:{
		novellists:[ ],
		type:""
	},
	
	onLoad(options){
		let that = this
        that.setData({
        	type: options.type
        })
        

	},

	onShow(){
		let that = this
		that.Main()
	},

	Main(){
		let that = this
		let listModel = that.listModel()
		let listView = that.listView()
		listModel.init.then(res =>{
			listView(res)
		})
	},

	listModel(){
		let that = this
		let init = that.getNovelInfo()
		return {
			init: init
		}
	},

	listView(res){
		let that = this
		let renderView = function(res){
			that.setData({
				novellists: res.data
			})
		}
		return renderView;
	},
	
	getNovelInfo(){
		let that = this
        const db = wx.cloud.database()
        let res = db.collection('novelinfo').where({
            type:that.data.type
        }).limit(20).field({
        	id:true,
            img:true,
            title:true,
            author:true,
            description:true,
            state:true
        })
        .get()
        return res;
	}
})