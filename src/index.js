// src/index.js

//获取应用实例
const app = getApp();
const Global = app.Globals, GlobalConfig = app.GlobalConfig;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Resource: GlobalConfig.Resource,
    HotThemeList: {
      background: GlobalConfig.Resource + 'static/bg/bg_1.jpg', list: [{
        "id": 1,
        "title": "情人节祝福",
        "icon": "pictures/2018/1/31/1517378773870.png",
        "iconBackgroundImage": "pictures/2018/1/31/1517390557925.png",
        "backgroundImage": "pictures/2018/1/30/1517298506024.jpg",
        "backgroundTitle": "情人节",
        "isHot": 1,
        "sort": 1
      },{
          "id": 2,
          "title": "元宵快乐",
          "icon": "pictures/2018/1/31/1517378750103.png",
          "iconBackgroundImage":"pictures/2018/1/31/1517390557925.png",
          "backgroundImage": "pictures/2018/2/1/1517485547867.png",
          "backgroundTitle": "元宵",
          "isHot": 1,
          "sort": 2
      },{
          "id": 3,
          "title": "新年祝福",
          "icon": "pictures/2018/1/31/1517378730150.png",
          "iconBackgroundImage": "pictures/2018/1/31/1517390557925.png",
          "backgroundImage": "pictures/2018/2/2/1517564565451.png",
          "backgroundTitle": "新年祝语",
          "isHot": 1,
          "sort": 2
      },{
          "id": 4,
          "title": "生日祝语",
          "icon": "pictures/2018/1/31/1517390530820.png",
          "iconBackgroundImage": "pictures/2018/1/31/1517390557925.png",
          "backgroundImage": "pictures/2018/1/31/1517388289440.png",
          "backgroundTitle": "生日快乐",
          "isHot": 1,
          "sort": 2
      }]}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this
    // 处理数据
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _self = this
  },
})