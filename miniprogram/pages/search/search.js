Page({
	/**
	 * 页面的初始数据
	 */
	data:{
		inputValue: "",
		novellists: [],
		result: false
	},

	searchText(e){
		this.setData({
			inputValue: e.detail.value
		})
	},

    query(){
    	let that = this
    	that.Main()
    },

    toRead(){
    	wx.navigateTo({
    		url: '../details/details?novelid=' + this.data.id
    	})
    },
	
	Main(){
		let that = this
        let searchModel = that.searchModel()
        let searchView = that.searchView()
        searchModel.init.then(res =>{
            searchView(res)
        })
	},

	searchModel(){
		let that = this
		let init = that.getNovelInfo()
		return {
            init: init
        }
	},
	
	getNovelInfo(){
		let that = this
		let inputValue = that.data.inputValue
    	const db = wx.cloud.database()
        let res = db.collection('novelinfo').where({
        	title: db.RegExp({
    				regexp: inputValue,
    				options: 'i'
  			})
        }).field({
            id: true,
            img: true,
            title: true,
            author: true,
            description: true,
            state: true
        })
        .get()
        return res
	},

	searchView(res){
       let that = this
       let renderView = function(res){
       	if(res.data.length > 0){
            	that.setData({
            		novellists: res.data,
                    result: true
                })
        }else{
            	that.setData({
                    result: false
                })
            }
       }
       return renderView
   }

})