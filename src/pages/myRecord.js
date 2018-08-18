// src/pages/myRecord.js

//获取应用实例
const app = getApp();
const Global = app.Globals, GlobalConfig = app.GlobalConfig;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Resource: GlobalConfig.Resource,
    Audio: { status: true },

    UserInfo: {},
    Params: {},
    MyRecordList: {
      list: [{
        "id": 1,
        "userId": 1,
        "themeId": 1,
        "themeTextId": 1,
        "title": "情人节祝语",
        "recordUrl": "2018/02/08/1518075695084.mp3",
        "duration": "0:12",
        "backgroundThumbImage": 'static/bg/bg_title_1.png',
        "playCount": 1
      }, {
          "id": 1,
          "userId": 1,
          "themeId": 1,
          "themeTextId": 1,
          "title": "新年祝语",
          "recordUrl": "2018/02/08/1518075695084.mp3",
          "duration": "0:12",
          "backgroundThumbImage": 'static/bg/bg_title_2.png',
          "playCount": 1
        }, {
          "id": 1,
          "userId": 1,
          "themeId": 1,
          "themeTextId": 1,
          "title": "元宵节祝语",
          "recordUrl": "2018/02/08/1518075695084.mp3",
          "duration": "0:12",
          "backgroundThumbImage": 'static/bg/bg_title_3.png',
          "playCount": 1
        }, {
          "id": 1,
          "userId": 1,
          "themeId": 1,
          "themeTextId": 1,
          "title": "生日快乐祝语",
          "recordUrl": "2018/02/08/1518075695084.mp3",
          "duration": "0:12",
          "backgroundThumbImage": 'static/bg/bg_title_4.png',
          "playCount": 1
        }]
    },
    MyRecordBg: { backgroundImage: GlobalConfig.Resource + 'static/bg/bg_1.jpg'},
    PlayAudio: {},
    PlayAudioAction: { method: 'pause' },

    RecordSheet:{active:"u-hide",key:0},
    MiffRecordTile: { active: "u-hide"},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this;
    _self.audioCtx = wx.createAudioContext('testHearMusic')

    GlobalConfig.setUserLogin(function (res) {
      _self.setData({ UserInfo: res }); 
      var Params = { userId: res.id, pageNum: 1, pageSize: 20 }
      _self.setData({ Params: Params })
      _self.getRandomTextByTheme(Params);
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    var _self = this, params = _self.data.Params;

  },
  onHide() { var _self = this; _self.setData({ PlayAudioAction: { method: 'pause' } }); },
  onUnload() { var _self = this; _self.setData({ PlayAudioAction: { method: 'pause' } }); },
  getRandomTextByTheme(params) {
    var _self = this
  },
  
  /**
   * 点击播放试听
   */
  PlayAudio(e) {
    var _self = this, Key = e.currentTarget.dataset.key, ThemeByList = _self.data.ThemeByList;
    if (ThemeByList.recordPage.list[Key].play && ThemeByList.recordPage.list[Key].play == "play") {
      ThemeByList.recordPage.list[Key].play = "pause"
      Music(ThemeByList.recordPage.list[Key]);
    } else {
      ThemeByList.recordPage.list.map(function (k, i) {
        if (k.id == ThemeByList.recordPage.list[Key].id) {
          ThemeByList.recordPage.list[i].play = "play"
          Music(ThemeByList.recordPage.list[Key]);
        } else {
          ThemeByList.recordPage.list[i].play = "pause"
        }
      })
    }
    _self.setData({ ThemeByList: ThemeByList });
    function Music(audio) {
      _self.setData({ PlayAudioAction: { method: 'pause' } });
      audio.recordUrl = _self.data.Resource + audio.recordUrl
      _self.setData({ PlayAudio: audio });
      if (audio.play == "play") {
        _self.audioCtx.pause();
        _self.setData({ PlayAudioAction: { method: 'play' } });
      } else {
        _self.audioCtx.pause();
      }
    };
  },
  /**
   * 试听结束
   */
  endPlayAudio() {
    var _self = this, ThemeByList = _self.data.ThemeByList;
    ThemeByList.recordPage.list.map(function (k, i) {
      ThemeByList.recordPage.list[i].play = "pause"
    })
    _self.audioCtx.pause();
    _self.setData({ ThemeByList: ThemeByList });
  },
  /**
   * 试听播放时长控制内容
   */
  playDurationCtr(audio) {
    var _self = this;
  },
  MyRecord(e) {
    var _self = this, Key = e.currentTarget.dataset.key, MyRecordList = _self.data.MyRecordList;
    console.log(MyRecordList);
    const MyRecord = MyRecordList.list[Key]
    wx.navigateTo({ url: '/src/pages/createRecord?id=' + MyRecord.themeId + '&recordid=' + MyRecord.id + '&themeTextId=' + MyRecord.themeTextId, })
  },
  NoActionSheet() { return false; },
  /**
   * 显示跟多
   */
  ActionSheet(e) {
    var _self = this, Key = e.currentTarget.dataset.key, RecordSheet = _self.data.RecordSheet
    RecordSheet.active = "slideInUp"; RecordSheet.key = Key;
    _self.setData({ RecordSheet: RecordSheet });
  },
  DelMyRecord(param) {
    var _self = this, MyRecordList = _self.data.MyRecordList;
    wx.showModal({
      content: '你确定要删除' + param.title + '吗？',
      success(res) {
        if (res.confirm) {
        }
      },
    })
  },
  ShareMyRecord(param) {
    console.log(param);
  },
  /**加载更多 */
  MyRecordScroll(e){
    var _self = this, params = _self.data.Params; params.pageNum++;
    if (params.pageNum <= params.totalPage){
    }
  },
  /**
   *删除我的录音列表 
   */
  DelRecordSheet() {
    var _self = this, RecordSheet = _self.data.RecordSheet, MyRecordList = _self.data.MyRecordList;
    const MyRecord = MyRecordList.list[RecordSheet.key]
    wx.showModal({
      content: '你确定要删除‘' + MyRecord.title + '’吗？',
      success(res) {
        if (res.confirm) {
        }
      },
    })
  },
  /**
   * 修改名称内容
   */
  MiffRecordSheet() {
    var _self = this, MiffRecordTile = _self.data.MiffRecordTile, Key = _self.data.RecordSheet.key, 
    MyRecordList = _self.data.MyRecordList;
    const MyRecord = MyRecordList.list[Key]
    MiffRecordTile.active = "slideInDown"; MiffRecordTile.title = MyRecord.title;
    _self.setData({ MiffRecordTile: MiffRecordTile });
  },
  closeRecordSheet() { 
    var _self = this,RecordSheet = _self.data.RecordSheet
    RecordSheet.active = "slideOutDown"; _self.setData({ RecordSheet: RecordSheet });
  },
  /**
   * 修改录音名称
   */
  MiffRecordTile(e) {
    var _self = this, Key = _self.data.RecordSheet.key, MyRecordList = _self.data.MyRecordList,
      RecordSheet = _self.data.RecordSheet, MiffRecordTile = _self.data.MiffRecordTile
    const MyRecord = MyRecordList.list[Key],Title = e.detail.value.title
  },
  closerecordTile() {
    var _self = this, MiffRecordTile = _self.data.MiffRecordTile
    MiffRecordTile.active = "slideOutUp"; _self.setData({ MiffRecordTile: MiffRecordTile });
  },
})