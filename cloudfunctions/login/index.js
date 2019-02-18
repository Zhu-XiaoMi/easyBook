// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()


exports.main = (event, context) => {
 
  const WXContext = cloud.getWXContext()

  return {
   openid : WXContext.OPENID
  }
}
