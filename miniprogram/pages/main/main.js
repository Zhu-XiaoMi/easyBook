//index.js
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: true
  },

  onLoad(){
    let that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.switchTab({
                url: '../index/index'   
        })
      }else{
        that.setData({
            isHide: false
        })
       }
      }
    })
  },

  getUserInfo(e){
    let that = this
    if (e.detail.userInfo) {
        wx.cloud.callFunction({
          name: "login",//这里填写云函数的名字
          data: {
            userInfo: e // 这里是把参数e直接传给test函数处理
          },
          success: res => { 
            wx.setStorageSync("用户昵称",e.detail.userInfo.nickName)
            wx.switchTab({
                url: '../index/index'
              })
          } 
        })
          
      }else{
              wx.showModal({
                  title: '提示',
                  content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入',
                  showCancel: false     
              })
      }
    }
})
