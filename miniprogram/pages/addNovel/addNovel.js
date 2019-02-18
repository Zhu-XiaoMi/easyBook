Page({

  /**
   * 页面的初始数据
   */
  data: {
    lastid: 0,
    title: "",
    author: "",
    description: "",
    state: "",
    img: "",
    type: "",
    tag: "",
    grade: 0,
    read: 0
  },

  bindTitle(e){
    if (e.detail.value.length == 0){
        console.log("小说名不能为空"); 
    }
    else if(e.detail.value.length > 12){
        console.log("小说名长度少于12位"); 
    }else{
      this.setData({
            title: e.detail.value
          })
      console.log(e.detail.value.length);
    }
  },

  bindAuthor(e){
    if (e.detail.value.length == 0){
        console.log("小说作者不能为空"); 
    }
    else if(e.detail.value.length > 12){
        console.log("小说作者长度少于12位"); 
    }else{
      this.setData({
            author: e.detail.value
          })
    }
    
  },

  bindDesciption(e){
    this.setData({
            description: e.detail.value
          })
  },

  bindGrade(e){
    let read = /^[0-9]+.?[0-9]*$/;
  　 if(e.detail.value.length == 0){
      console.log("评分不能为空");
    }else if (!read.test(Number(e.detail.value))){ 
  　　　　console.log("请输入数字"); 
  　　}else{
          this.setData({
            grade: e.detail.value
          })
      }
  },

  bindImg(e){
    this.setData({
            img: e.detail.value
          })
  },

  bindRead(e){
      let read = /^[0-9]+.?[0-9]*$/;
    　 if(e.detail.value.length == 0){
        console.log("阅读量不能为空");
      }else if (!read.test(Number(e.detail.value))){ 
    　　　　console.log("请输入数字"); 
    　　}else{
            this.setData({
                  read: Number(e.detail.value)
                })
       }

  },

  stateChange(e){
    this.setData({
            state: e.detail.value
          })
  },

  tagChange(e){
    this.setData({
            tag: e.detail.value
          })
  },

  bindType(e){
    this.setData({
            type: e.detail.value
          })
  },

  formSubmit(){
    let that = this
    that.Main()
  },

  onLoad(options){ 
  },

  onShow(){ 
    
  },
  Main(){
    let that = this
    let addModel = that.addModel()
    let addView = that.addView()
    addModel.init.then(res =>{
      addView(res)
    })
  },
  addModel(){
    let that = this
    let init = that.getLastid().then(res =>{
      return that.addNovel(res.data[0].id + 1)
    })
    return {
      init: init
    } 
  },

  addView(res){
    let that = this
    let renderView = function(res){
        if(res){
          wx.showModal({
            title: '添加成功',
            content: '是否还继续添加书籍',
            success(res) {
              if(res.confirm){
                wx.redirectTo({
                  url: '../addNovel/addNovel'
                })
              }else{
                wx.redirectTo({
                  url: '../adminNovel/adminNovel'
                })
              }
            }
          })
      } 
    }
    return renderView
  },

  getLastid(){
    let that = this
    const db = wx.cloud.database()
    let res = db.collection('novelinfo')
              .orderBy('id', 'desc').limit(1)
              .field({
                  id: true
              }).get()
    return res
  },

  addNovel(id){
    let that = this
    const db = wx.cloud.database()
    let res = db.collection('novelinfo').add({
              // data 字段表示需新增的 JSON 数据
                data: {
                  id: id,
                  title: that.data.title,
                  author: that.data.author,
                  description: that.data.description,
                  state: that.data.state,
                  img: that.data.img,
                  type: that.data.type,
                  tag: that.data.tag,
                  grade: that.data.grade,
                  read: that.data.read,
                  tags: [
                    'cloud',
                    'database'
                  ]
                }
            })
    return res
  }

})