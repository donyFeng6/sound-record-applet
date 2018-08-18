// src/pages/editAudio.js

//获取应用实例
const app = getApp();
const Global = app.Globals, GlobalConfig = app.GlobalConfig;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Resource: GlobalConfig.Resource,
    UserInfo: {},
    Params: {},
    RecordEntity: {
      backgroundImage: GlobalConfig.Resource + 'static/bg/bg_1.jpg', location: "深圳", recordUrl: "https://api.pigbanker.com/audioRecordingResource/records/219/2018/2/5/1517815585632.m4a"
    },
    PlayAudio: {
      timer: 0, audioUrl: "https://api.pigbanker.com/audioRecordingResource/records/219/2018/2/5/1517815585632.m4a", themeBackgroundMusicUrl: "https://api.pigbanker.com/audioRecordingResource/2018/02/03/1517629464649.mp3"
    },
    PlayAudioAction: { method: 'pause' },
    BgPlayAction: { method: 'pause' },
    isShowCity: { active: 'u-hide', status: "show", loca:'深圳'},

    rhythmCartoon: { active:"rapid stop"},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this
    _self.setData({ Params: { themeId: parseInt(options.id), recordId: parseInt(options.recordid), themeTextId: parseInt(options.themeTextId) } })
    _self.recordAudioCtx = wx.createAudioContext('recordHearMusic')
    GlobalConfig.setUserLogin(function (res) {
      _self.setData({ UserInfo: res })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _self = this, params = _self.data.Params, PlayAudio = _self.data.PlayAudio
    wx.getLocation({ type: 'wgs84', 
      success: function (local) {
        var Paramet = { id: params.recordId, latitude: local.latitude, longitude: local.longitude}
        _self.getRecord(Paramet);
      }, fail(local) { var Paramet = { id: params.recordId }; _self.getRecord(Paramet);},
    })
  },
  onHide() { var _self = this; _self.setData({ PlayAudioAction: { method: 'pause' }, BgPlayAction: { method: 'pause' } }); },
  onUnload() { var _self = this; _self.setData({ PlayAudioAction: { method: 'pause' }, BgPlayAction: { method: 'pause' } }); },
  getRecord(Paramet){
    var _self = this, PlayAudio = _self.data.PlayAudio, isShowCity = _self.data.isShowCity
    Global.GetData(GlobalConfig.URL.getRecord, Paramet, "POST", function (res) {
      if (res.code == 10000) {
        var duration = res.result.entity.duration.split(':'); duration = parseInt(duration[0] * 60) + parseInt(duration[1])
        res.result.entity.backgroundImage = GlobalConfig.Resource + res.result.entity.backgroundImage
        if (res.result.location){
          isShowCity.loca = res.result.location
          res.result.entity.location = res.result.location
        }
        res.result.entity.duration = PlayAudio.timer = duration; console.log(res.result);
        _self.setData({ RecordEntity: res.result.entity, PlayAudio: PlayAudio, isShowCity: isShowCity });
        _self.ShowMapShield({ currentTarget: { dataset:{type:1}}});
      } else { console.log(res); }
    })
  },
  PlayBgMusic(e) {
    var _self = this, RecordEntity = _self.data.RecordEntity, PlayAudio = _self.data.PlayAudio, PlayAudioAction = _self.data.PlayAudioAction
    PlayAudio.audioUrl = RecordEntity.recordUrl
    if (RecordEntity.themeBackgroundMusicUrl) { PlayAudio.themeBackgroundMusicUrl = _self.data.Resource + RecordEntity.themeBackgroundMusicUrl }
    _self.setData({ PlayAudio: PlayAudio});
    if (PlayAudioAction.method == "play"){
      _self.rhythmCartoon('pause');
      _self.setData({ PlayAudioAction: { method: 'pause' }, BgPlayAction: { method: 'pause' }});
    }else{
      _self.rhythmCartoon('play');
      _self.setData({ PlayAudioAction: { method: 'play' }, BgPlayAction: { method: 'play' } });
    }
  },
  playDurationCtr(e){
    var _self = this, PlayAudio = _self.data.PlayAudio;
    PlayAudio.timer = parseInt(e.detail.duration-e.detail.currentTime);
    _self.setData({ PlayAudio: PlayAudio });
  },
  endPlayAudio(e){
    console.log(e);
    var _self = this, PlayAudio = _self.data.PlayAudio, RecordEntity = _self.data.RecordEntity;
    PlayAudio.timer = RecordEntity.duration;
    _self.rhythmCartoon('pause');
    _self.setData({ PlayAudio: PlayAudio, PlayAudioAction: { method: 'pause' }, BgPlayAction: { method: 'pause' }});
  },
  /**
 * 律动播放内容
 */
  rhythmCartoon(parms) {
    var _self = this, rhythmCartoon = _self.data.rhythmCartoon
    if (parms == 'play') {
      rhythmCartoon.active = 'rapid'
    } else { 
      rhythmCartoon.active = 'rapid stop'
    }
    _self.setData({ rhythmCartoon: rhythmCartoon });
  },
  /**
   * 页面转发内容
   */
  onShareAppMessage: function (res) {
    var _self = this, Params = _self.data.Params;
    if (!_self.data.RecordEntity || !_self.data.RecordEntity.title) { _self.data.RecordEntity.title = "" };
    if (!_self.data.UserInfo || !_self.data.UserInfo.nickName) { _self.data.UserInfo.nickName = ""};
    return {
      title: '来自@张三的祝语',
      path: '/src/pages/shar?id=',
      success: function (res) { // 转发成功
        Params.userId = _self.data.UserInfo.id;
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})