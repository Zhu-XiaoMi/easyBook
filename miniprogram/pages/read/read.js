Page({
    /**
     * 页面的初始数据
     */
    data:{
        open: false,
        look: false,
        has: false,
        show: false,
        hide: false,
        day: false,
        offsetTop: 0,
        color: "#f8faf9",
        pcolor: "white",
        font_color: "#333333",
        border_bottom: "1px solid #f2f2f2",
        bcolor: "white",
        nav_list: [],
        chaptertitle: "",
        img: "",
        content: "",
        chapterid: 0,
        novelid: 0,
        count: 0,
        noveltitle: "",
        title: 0,
        author: "",
        state: ""
    },
    
    off_canvas(){ 
      if(this.data.open == true){
        wx.pageScrollTo({
          scrollTop: offsetTop,
          duration: 1
        })
      }
        this.setData({
            open: !this.data.open,
            look: false,
            show: false,
            hide: false
        })
    },

    off_set(){
      this.setData({
            hide: !this.data.hide
        })
    },

    off_day(){
      this.setData({
            day: !this.data.day
        })
      this.data.pcolor == "white" ? this.setData({pcolor: "gray"}) : this.setData({pcolor: "white"})
      this.data.bcolor == "white" ? this.setData({bcolor: "#676767"}) : this.setData({bcolor: "white"})
      this.data.color == "#f8faf9" ? this.setData({color: "#585858"}) : this.setData({color: "#f8faf9"})
      this.data.font_color == "#333333" ? this.setData({font_color: "gray"}) : this.setData({font_color: "#333333"})
      this.data.border_bottom == "1px solid #f2f2f2" ? this.setData({border_bottom: "1px solid #999999"}) : this.setData({border_bottom: "1px solid #f2f2f2"})
    },

    lookShelf(){
      this.setData({
        look: !this.data.look,
        show: !this.data.show
      })
    },

    tolist(e){
      this.setData({
        chapterid: e.currentTarget.dataset.chapterid,
        offsetTop: e.currentTarget.offsetTop
      })
      this.Main()
      this.setData({
              open:false
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
    },

    toChapterLast(){
      let chapterid = this.data.chapterid
      let novelid = this.data.novelid
      if(chapterid > 1){
        this.setData({
          chapterid: chapterid - 1
        })
        this.Main()
      }
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })   
    }, 

    toChapterNext(){
      let chapterid = this.data.chapterid
      let count = this.data.count 
      let novelid = this.data.novelid
      if(chapterid < count){
        this.setData({
          chapterid: chapterid + 1
        })
        this.Main()
      }
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
    },

    joinShelf(){
     let info = {
              id: this.data.novelid,
              img: this.data.img,
              title: this.data.noveltitle,
              author: this.data.author,
              state: this.data.state
           }
      let getInfo = wx.getStorageSync("加入书架的小说");
      getInfo.push(info)
      wx.setStorageSync("加入书架的小说", getInfo)
      this.setData({
         has: true
      })
      wx.showToast({
        title: '已加入书架',
        icon: 'success',
        duration: 2000
      })
    },

    getNovelInfo(novelid){
      let that = this;
      const db = wx.cloud.database()
      db.collection('novelinfo').where({
          id:novelid
      }).field({
              img: true,
              title: true,
              author: true,
              state: true
          }).get()
          .then(res=>{
              that.setData({
                img: res.data[0].img,
                noveltitle: res.data[0].title,
                author: res.data[0].author,
                state: res.data[0].state
              })
              wx.setNavigationBarTitle({
                 title: this.data.noveltitle
            })
        })
    },

    getChapterTitle(novelid){
      let that = this;
      const db = wx.cloud.database()
      db.collection('chapterinfo').where({
            novelid:novelid
      }).field({
            title:true,
            chapterid:true
          }).get().then(res =>{
            that.setData({
              nav_list: res.data
            }) 
        })
    },

    getChapterCount(){
      let that = this;
      const db = wx.cloud.database()
      db.collection('chapterinfo').where({
          novelid:that.data.novelid
      }).count().then(res =>{
              that.setData({
                count: res.total
              })
        })
    },
   
    onLoad(options){
        let that = this
        let chapterid = parseInt(options.chapterid)
        let novelid = parseInt(options.novelid)
        that.getNovelInfo(novelid)
        that.getChapterTitle(novelid)
        that.setData({
            chapterid:chapterid,
            novelid:novelid
        })      
        let getInfo = wx.getStorageSync("加入书架的小说")
        for(let index in getInfo){
          if(getInfo[index].id == novelid){
            that.setData({
              has: true
            })
            break
          }
        }   
    },

    onShow(){
        let that = this
        that.Main()
        that.getChapterCount()
        let getColor = wx.getStorageSync("颜色信息")
        if(getColor){
          that.setData({
              color: getColor.color,
              font_color: getColor.font_color
            }) 
        }
                  
    },

    Main(){
      let that = this
      let readModel = that.readModel()
      let readView = that.readView()
      readModel.init.then(res =>{
        readView(res)
      })
    },

    readModel(){
      let that = this
      let init = that.getChapterInfo(that.data.chapterid,that.data.novelid)
      return {
        init: init
      }
    },
    getChapterInfo(chapterid,novelid) {
      var that = this;
      const db = wx.cloud.database()
      let res = db.collection('chapterinfo').where({
                  novelid:novelid,
                  chapterid:chapterid
                }).field({
                      title:true,
                      content:true
                  }).get()
      return res
    },

    readView(){
      let that = this
      let renderView = function(res){
          let str = res.data[0].content.split(' ').join('\n&emsp;&emsp;')
          that.setData({
            content: str,
            chaptertitle: res.data[0].title
          })
      }
      return renderView
    },

    onUnload(){
      let color_info = {
              color: this.data.color,
              font_color: this.data.font_color
           }
      let info = {
              id: this.data.novelid,
              chapterid: this.data.chapterid
           }
      let getInfo = wx.getStorageSync("阅读过的小说");
      let getColor = wx.getStorageSync("颜色信息");
      let res = false
      for(let index in getInfo){
        if(getInfo[index].id == this.data.novelid){
            res = true
            getInfo[index].chapterid = this.data.chapterid
            break;
        } 
      }
      if(!res){
          getInfo.push(info)
        }
      wx.setStorageSync("阅读过的小说", getInfo)
      wx.setStorageSync("颜色信息", color_info)
    }

})