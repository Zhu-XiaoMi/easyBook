//index.js
//获取应用实例
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data:{
        navbar: ['男生', '女生'], 
        lists: [ ],
        currentTab: 0,
        currentTag: "男生"
    },

    feelRead(e){
        let novelid = e.currentTarget.dataset.novelid
        let getInfo = wx.getStorageSync("阅读过的小说")
        let res = false
        for(let index in getInfo){
            if(getInfo[index].id == novelid){
                wx.navigateTo({
                    url:"../read/read?chapterid=" + getInfo[index].chapterid + "&novelid=" + novelid
                })
                res = true
                break;
            }
        }
        if(!res){
            wx.navigateTo({
                url:"../read/read?chapterid=1" + "&novelid=" + novelid
            })
        }
        
    },

    onShow(){
        let that = this
        that.Main()
    },

    Main(){
        let that = this
        let indexModel = that.indexModel()
        let indexView = that.indexView()
        indexModel.init.then(res =>{
            indexView(res)
        })
    },

    indexModel(){
        let that = this   
        let init = that.getNovelInfo()
        return {
            init: init
        }
       
    },

    getNovelInfo(){
        let that = this
        let tag = that.data.currentTag
        const db = wx.cloud.database()
        let res = db.collection('hotNovel').where({
            tag:tag
        }).orderBy('updatetime','desc').limit(5)
        .get()
        return res

    },

    indexView(res){
       let that = this
       let renderView = function(res){
            that.setData({
                lists : res.data
            })
       }

       return renderView
    },

    
    searchBtn(){
        wx.navigateTo({
        url: '../search/search'
    })
    },

    navbarTap(e){ 
        let that = this
        that.setData({ 
            currentTab: e.currentTarget.dataset.idx,
            currentTag: e.currentTarget.dataset.tag
        })
        that.Main()
    }
})
