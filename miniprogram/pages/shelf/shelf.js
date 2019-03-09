//index.js
//获取应用实例
const UPDATE_MILE_SEC = 100; //自动关闭、打开 每次刷新毫秒

Page({
    data: {
        imgs: [],
        novels: [],
        chaptertitle: []
    },

    toRead(e){
        let that = this
        let title = []
        let flag = true
        let chapter = wx.getStorageSync("阅读过的小说")
        let id = e.currentTarget.dataset.id
        for(let index in chapter){
            if(id == chapter[index].id){
               wx.navigateTo({
                    url:"../read/read?chapterid=" + chapter[index].chapterid + "&novelid=" + chapter[index].id
               })
               flag = false
            }
        }
        if(flag){
            console.log(id);
            wx.navigateTo({
                    url:"../read/read?chapterid=1" + "&novelid=" + id
            })
        }
    },

    onShow(){
        let that = this
        let novels = wx.getStorageSync("加入书架的小说")
        that.setData({
             novels: novels
        })
    }   
})