// src/pages/shar.js

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
      backgroundImage: GlobalConfig.Resource + 'static/bg/bg_1.jpg', location:"深圳"
    },
    PlayAudio: {
      timer: 0, audioUrl: "https://api.pigbanker.com/audioRecordingResource/records/219/2018/2/5/1517815585632.m4a", themeBackgroundMusicUrl:"https://api.pigbanker.com/audioRecordingResource/2018/02/03/1517629464649.mp3"
    },
    PlayAudioAction: { method: 'pause' },
    isShowCity: { active: 'u-hide', status: "show" },
    loadingPage: { active: '' }, 

    rhythmCartoon: { active: "rapid stop" },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this
    _self.setData({ Params: { themeId: parseInt(options.id), recordId: parseInt(options.recordid), pageNum: 1, pageSize: 20 } })
    _self.recordAudioCtx = wx.createAudioContext('recordHearMusic')
    GlobalConfig.setUserLogin(function (res) {
      _self.setData({ UserInfo: res })
    })
    _self.ctx1 = wx.createCanvasContext('Canvas1')
    _self.ctx2 = wx.createCanvasContext('Canvas2')
    _self.ctx3 = wx.createCanvasContext('Canvas3')
    _self.ctx4 = wx.createCanvasContext('Canvas4')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _self = this, params = _self.data.Params, PlayAudio = _self.data.PlayAudio
    var Paramet = { id: params.recordId }, isShowCity = _self.data.isShowCity;
    setTimeout(function () {
      var loadingPage = _self.data.loadingPage;
      loadingPage.active = 'slideOutUp'; _self.setData({ loadingPage: loadingPage })
    }, 3000)

    // Global.GetData(GlobalConfig.URL.getRecord, Paramet, "POST", function (res) {
    //   if (res.code == 10000) {
    //     var duration = res.result.entity.duration.split(':'); duration = parseInt(duration[0] * 60) + parseInt(duration[1])
    //     res.result.entity.backgroundImage = GlobalConfig.Resource + res.result.entity.backgroundImage
    //     res.result.entity.duration = PlayAudio.timer = duration; console.log(res.result);        
    //     if (res.result.entity.isShowLocation == 1) {
    //       isShowCity.status = 'show' 
    //     } else {
    //       res.result.entity.location = '未知星球';
    //     }
    //     _self.setData({ RecordEntity: res.result.entity, PlayAudio: PlayAudio, isShowCity: isShowCity});
    //     setTimeout(function () { _self.PlayBgMusic(); }, 2000)
    //     setTimeout(function () {
    //       var loadingPage = _self.data.loadingPage;
    //       loadingPage.active = 'slideOutUp'; _self.setData({ loadingPage: loadingPage })
    //     },1200)
    //   } else { console.log(res); }
    // })
    var params1 = {
      waveHeight: 62,//波浪高度
      waveCount: 6,//波浪个数
      progress: 160,//波浪位置的高度
      fillStyle: 'rgba(255, 255, 255, 0.6)', //颜色
    }
    _self.waveOne(_self.ctx1, params1);
    var params2 = {
      waveHeight: 52,//波浪高度
      waveCount: 5,//波浪个数
      progress: 155,//波浪位置的高度
      fillStyle: 'rgba(255, 255, 255, 0.7)', //颜色
    }
    _self.waveOne(_self.ctx2, params2);
    var params3 = {
      waveHeight: 56,//波浪高度
      waveCount: 4,//波浪个数
      progress: 150,//波浪位置的高度
      fillStyle: 'rgba(255, 255, 255, 0.5)', //颜色
    }
    _self.waveOne(_self.ctx3, params3);
    var params4 = {
      waveHeight: 48,//波浪高度
      waveCount: 3,//波浪个数
      progress: 148,//波浪位置的高度
      fillStyle: 'rgba(255, 255, 255, 0.4)', //颜色
    }
    _self.waveOne(_self.ctx4, params4);

  },
  onHide() { var _self = this; _self.setData({ PlayAudioAction: { method: 'pause' }, BgPlayAction: { method: 'pause' } }); },
  onUnload() { var _self = this; _self.setData({ PlayAudioAction: { method: 'pause' }, BgPlayAction: { method: 'pause' } }); },
  PlayBgMusic(e) {
    var _self = this, RecordEntity = _self.data.RecordEntity, PlayAudio = _self.data.PlayAudio, PlayAudioAction = _self.data.PlayAudioAction
    PlayAudio.audioUrl = _self.data.Resource + RecordEntity.recordUrl
    if (RecordEntity.themeBackgroundMusicUrl) { PlayAudio.themeBackgroundMusicUrl = _self.data.Resource + RecordEntity.themeBackgroundMusicUrl}
    _self.setData({ PlayAudio: PlayAudio });
    if (PlayAudioAction.method == "play") {
      _self.rhythmCartoon('pause');
      _self.setData({ PlayAudioAction: { method: 'pause' }, BgPlayAction: { method: 'pause' } });
    } else {
      _self.rhythmCartoon('play');
      _self.setData({ PlayAudioAction: { method: 'play' }, BgPlayAction: { method: 'play' } });
    }
  },
  playDurationCtr(e) {
    var _self = this, PlayAudio = _self.data.PlayAudio;    
    PlayAudio.timer = parseInt(e.detail.duration - e.detail.currentTime);
    _self.setData({ PlayAudio: PlayAudio });
  },
  endPlayAudio(e) {
    var _self = this, PlayAudio = _self.data.PlayAudio, RecordEntity = _self.data.RecordEntity;
    PlayAudio.timer = RecordEntity.duration;
    _self.rhythmCartoon('pause');
    _self.setData({ PlayAudio: PlayAudio, PlayAudioAction: { method: 'pause' }, BgPlayAction: { method: 'pause' } });
  },
  wantPlay() {
    var _self = this
    wx.navigateTo({ url: '/src/pages/index?id=' + _self.data.RecordEntity.themeId,}) 
  },
  /**
   * 律动播放内容
   */
  rhythmCartoon(parms){
    var _self = this, rhythmCartoon = _self.data.rhythmCartoon
    if (parms == 'play') {
      rhythmCartoon.active = 'rapid'
    } else {
      rhythmCartoon.active = 'rapid stop'
    }
    _self.setData({ rhythmCartoon: rhythmCartoon });
  },
  /**
   * 绘制波浪线内容
   */
  waveOne(ctx, Params) {
    var waveWidth = 3300, offset = 0,
      waveHeight = Params.waveHeight,  //波浪高度
      waveCount = Params.waveCount,  //波浪个数
      startX = -1000, startY = 200,   //canvas 高度
      progress = Params.progress,  //波浪位置的高度
      d2 = waveWidth / waveCount,
      d = d2 / 2, hd = d / 2, Width = wx.getSystemInfoSync().windowWidth;
    tick();
    function tick() {
      offset -= 5;
      if (-1 * offset === d2) offset = 0;
      ctx.clearRect(0, 0, Width, startY);
      ctx.beginPath();
      var offsetY = startY - progress;
      ctx.moveTo(startX - offset, offsetY);
      for (var i = 0; i < waveCount; i++) {
        var dx = i * d2;
        var offsetX = dx + startX - offset;
        ctx.quadraticCurveTo(offsetX + hd, offsetY + waveHeight, offsetX + d, offsetY);
        ctx.quadraticCurveTo(offsetX + hd + d, offsetY - waveHeight, offsetX + d2, offsetY);
      }
      ctx.lineTo(startX + waveWidth, 3000);
      ctx.lineTo(startX, 3000);
      ctx.setFillStyle(Params.fillStyle)
      ctx.fill();
      ctx.draw()
      setTimeout(tick, 5000 / 220);
      // requestAnimationFrame(tick);
    }
  },
})