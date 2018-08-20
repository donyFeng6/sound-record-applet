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
      background:'./static/image/bg/bg_1.jpg', list: [{
        "id": 1,
        "title": "情人节祝福",
        "icon": "./static/image/icon_valentine_home@2x.png",
        "iconBackgroundImage": "./static/image/bg_valentine_home@2x.png",
        "backgroundImage": "./static/image/bg/bg_1.jpg",
        "backgroundTitle": "情人节",
        "isHot": 1,
        "sort": 1
      },{
          "id": 2,
          "title": "元宵快乐",
          "icon": "./static/image/icon_yuanxiao_home@2x.png",
          "iconBackgroundImage":"./static/image/bg_yuanxiao_home@2x.png",
          "backgroundImage": "./static/image/bg/bg_2.jpg",
          "backgroundTitle": "元宵",
          "isHot": 1,
          "sort": 2
      },{
          "id": 3,
          "title": "新年祝福",
          "icon": "./static/image/icon_new_year@2x.png",
          "iconBackgroundImage": "./static/image/bg_birthday_home@2x.png",
          "backgroundImage": "./static/image/bg/bg_3.jpg",
          "backgroundTitle": "新年祝语",
          "isHot": 1,
          "sort": 2
      },{
          "id": 4,
          "title": "生日祝语",
          "icon": "./static/image/icon_birthday_home@2x.png",
          "iconBackgroundImage": "./static/image/bg_valentine_home@2x.png",
          "backgroundImage": "./static/image/bg/bg_4.jpg",
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