//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}
    let getInfo = wx.getStorageSync("加入书架的小说") || []
    wx.setStorageSync("加入书架的小说", getInfo)
    let getRead = wx.getStorageSync("阅读过的小说") || []
    wx.setStorageSync("阅读过的小说", getRead)
  }

  

})
