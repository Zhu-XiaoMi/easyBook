Page({
	/**
	 * 页面的初始数据
	 */
	data:{
		novellists: [ ],
		type: "",
		count: 0,
		finish: true
	},
	
	onLoad(options){
		let that = this
        that.setData({
        	type: options.type
        })
        wx.setNavigationBarTitle({
	      title: options.type
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
		let count = that.data.count
		let init = that.getNovelInfo(count)
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
	
	getNovelInfo(count){
		let that = this
        const db = wx.cloud.database()
        let res = db.collection('novelinfo').where({
            type: that.data.type
        }).skip(count).limit(20).field({
        	id:true,
            img:true,
            title:true,
            author:true,
            description:true,
            state:true
        })
        .get()
        return res;
	},
	onReachBottom(){
		let that = this
		let data = that.data.novellists
		that.data.count = that.data.count + 20
		let renderView = that.getNovelInfo(that.data.count)
		renderView.then(res=>{
			if(res.data.length == 0){
				that.setData({
					finish: false
				})
			}
			else{
				let newArr = data.concat(res.data)
				that.setData({
					novellists: newArr
				})
			}
			
		})

	}
})
	