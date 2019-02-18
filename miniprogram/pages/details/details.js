let util = require('../../utils/dateFormat');


Page({
    data: {
   		  open: false,
        has: false,
        lastid: 0,
        pull:false,
        count: 0,
        info: null,
        catalog: [],
        novelid: 0,
        updatetime: null
    },

    off_canvas(){
      this.setData({
        open: !this.data.open
      })
    },

    detailed(){
      this.setData({
        pull: !this.data.pull
      })
    },

    toRead(){
        let getInfo = wx.getStorageSync("阅读过的小说")
        let res = false
        for(let index in getInfo){
            if(getInfo[index].id == this.data.novelid){
                wx.navigateTo({
                  url:"../read/read?chapterid=" + getInfo[index].chapterid + "&novelid=" + this.data.novelid
                })
                res = true
                break
            }
        }
        if(!res){
          wx.navigateTo({
              url:"../read/read?chapterid=1" + "&novelid=" + this.data.novelid
          })
        }
               
    },

    toShelf(){
      let info = {
          				id: this.data.novelid,
          				img: this.data.info.img,
          				title: this.data.info.title,
                  author: this.data.info.author,
                  state: this.data.info.state
      	       }
      let getInfo = wx.getStorageSync("加入书架的小说");
      getInfo.push(info)
      wx.setStorageSync("加入书架的小说", getInfo)
      this.setData({
         has: true
      })
     
    },

    onLoad(options){
      let that = this
      let getInfo = wx.getStorageSync("加入书架的小说")
      that.setData({
        novelid: parseInt(options.novelid)
      })
      for(let index in getInfo){
	    	if(getInfo[index].id == parseInt(options.novelid)){
	    		that.setData({
	    			has: true
	    		})
          break
	    	}
	    }   
	  that.Main()  
    },

    Main(){
      let that = this
      let detailModel = that.detailModel()
      let detailView = that.detailView()
      detailView(detailModel.init()) 
  
    },

    detailModel(){
      let that = this
      let result = {}
      let init = function(){
      	result.bookInfo =  that.getNovelInfo();
      	result.chapterInfo = that.getChapterInfo();
        return result
      }
      return {
        init: init
      }
    },

    detailView(){
      let that = this
      let renderView = function(res){
      	let num = 0 
      	let lastid = 0
      	let bookInfo = res.bookInfo
      	let chapterInfo = res.chapterInfo
          bookInfo.then(res=>{
            res.data[0].updatetime = util.formatDate(res.data[0].updatetime);
            that.setData({
              info: res.data[0]
            })
          })     
          chapterInfo.then(res =>{
            for(let index in res.data){
              res.data[index].updatetime  = util.formatDate(res.data[index].updatetime);
              num = num + res.data[index].count
            }
            let lastid = res.data.length
            that.setData({
              catalog: res.data,
              count: num,
              lastid: lastid,
              updatetime: res.data[res.data.length - 1].updatetime
            })
          })       
        } 
        return renderView;   
    },

    getNovelInfo(){
      let that = this
      const db = wx.cloud.database()
      let res = db.collection('novelinfo').where({
          id: this.data.novelid
      })
      .get()
      return res;
    },

    getChapterInfo(){
      let that = this
      const db = wx.cloud.database()
      let res = db.collection('chapterinfo').where({
          novelid: this.data.novelid
      })
      .get()
      return res;
    },

    onHide(){
      this.setData({
        open: false
      })
    }
})