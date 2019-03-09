Page({
	/**
	 * 页面的初始数据
	 */
	data:{
		GirlLists:[ ],
		BoyLists: [ ],
		Bid: null,
		Gid: null
	},
	
	onLoad(){
	},

	onShow(){
		let that = this
		that.Main()
	},

	Main(){
		let that = this
		let listModel = that.listModel()
		let listView = that.listView()
		listView(listModel.init())
	},

	listModel(){
		let that = this
	    let result = {}
	    let init = function(){
	       result.GirlBook =  that.getGirl();
	       result.BoyBook = that.getBoy();
	       return result
	    }
	    return {
	       init: init
	    }
	},

	listView(res){
		let that = this
		let renderView = function(res){
			let GirlBook = res.GirlBook
      	    let BoyBook = res.BoyBook
      	    GirlBook.then(res=>{
      	    	that.setData({
					GirlLists: res.data,
					Gid: res.data.length - 1
				})
      	    })
      	    BoyBook.then(res=>{
      	    	that.setData({
					BoyLists: res.data,
					Bid: res.data.length - 1
				})
      	    })
		}
		return renderView;
	},
	
	getGirl(){
	    let that = this
        const db = wx.cloud.database()
        let res = db.collection('classify').where({
          tag: "女生"
	    })
	    .get()
        return res;
    },

    getBoy(){
    	let that = this
        const db = wx.cloud.database()
        let res = db.collection('classify').where({
            tag: "男生"
        })
        .get()
        return res;
    }
})