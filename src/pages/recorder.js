// src/pages/recorder.js

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
    ThemeByList: {},
    isSatrtRecord:'stop',
    RecordTimer: { Time: "点击录音", duration:0},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this
    _self.Recorder = wx.getRecorderManager();
    _self.setData({ Params: { themeId: parseInt(options.id), themeTextId: parseInt(options.themeTextId), pageNum: 1, pageSize: 20 } })
    GlobalConfig.setUserLogin(function (res) {
      _self.setData({ UserInfo: res })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _self = this, params = _self.data.Params
    if (params.themeId) {
      result.forEach(function (d, f) {
        if (d.theme.id == params.themeId) {
          d.theme.textlist = d.theme.textContent.split('|');
          _self.setData({ ThemeByList: d });
        }

      })
    }
  },
  /**
   * 点击录音
   */
  RecorderManager(e) {
    var _self = this, Type = e.type, isSatrtRecord = _self.data.isSatrtRecord;
    if (isSatrtRecord == "pause"){
      _self.Recorder.pause()
      _self.RecorderTime('pause')
      _self.setData({ isSatrtRecord: 'resume' })
    } else if (isSatrtRecord == "resume") {
      _self.Recorder.resume()
      _self.RecorderTime('start')
      _self.setData({ isSatrtRecord: 'pause' })

    } else{
      const StartRecord = {
        duration: 100000,
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: 'aac',
        frameSize: 50
      }
      _self.Recorder.start(StartRecord);
      _self.RecorderTime('start')
      _self.setData({ isSatrtRecord:'pause'})
    };
  },
  /**
   * 录音完成
   */
  RecorderDone(e){
    var _self = this, isSatrtRecord = _self.data.isSatrtRecord;
    if (isSatrtRecord != "stop"){
      _self.Recorder.stop();
      _self.Recorder.onStop((res) => {
        if (isSatrtRecord == "start" || isSatrtRecord == "pause"){
          if (res && res.duration / 1000 > 3) {
            wx.showLoading({title: '请稍后...',})
            var Audio = { src: res.tempFilePath, duration: res.duration, fileSize: res.fileSize, status: false }
            _self.uploadAudioFile(Audio)
          } else {
            if (res && res.duration > 300) {
              wx.showModal({ content: '您录的声音太短啦,请重新录制吧',showCancel:false,})
            }
          }
          _self.RecorderTime('stop')
          _self.setData({ isSatrtRecord: 'stop' })
        }
      })
    }else{
  wx.showModal({ content: '您还没有录制呢', confirmColor:" #F94747 ", showCancel: false, })
    };
  },
  RecorderTime(T){
    var _self = this, RecordTimer = _self.data.RecordTimer;
    if (T == "start"){
      _self.RecordTimer = setInterval(function(){
        RecordTimer.duration++
        RecordTimer.Time = Global.formatSeconds(RecordTimer.duration);
        _self.setData({ RecordTimer: RecordTimer})
      },1000)
    };
    if (T == "pause") { clearInterval(_self.RecordTimer); }
    if (T == "stop") { clearInterval(_self.RecordTimer); _self.setData({ RecordTimer: { Time: "00：00", duration: 0 } }) }
    if (T == "reset") { clearInterval(_self.RecordTimer); _self.setData({ RecordTimer: { Time: "点击录音", duration: 0 }})}
  },
  /**
 * 重新录制
 */
  resetRecorder() {
    var _self = this;
    _self.setData({ isSatrtRecord: 'reset' })
    _self.RecorderTime('reset')
    _self.Recorder.stop();
  },
  /**
   * 上传音频文件
   */
  uploadAudioFile(audio){
    var _self = this;
    audio.path = audio.file = audio.src
    wx.setStorage({ key: 'RecorderFile', data: audio, });
    wx.navigateTo({ url: '/src/pages/editAudio?themeId=' + _self.data.Params.themeId + '&themeTextId=' + _self.data.Params.themeTextId, })

    /**
     * 录音文件上传
    wx.uploadFile({
      url: "******", filePath: audio.src, formData: { userId: _self.data.UserInfo.id},name: 'file',
      success(res){
         var rst = JSON.parse(res.data); wx.hideLoading();
        if (rst.code == 10000){
          audio.path = audio.file = rst.result.file;
        };
      },
    })
     * */
  },
})




var result = [{
  "theme": {
    "id": 1,
    "title": "情人节祝福",
    "icon": "pictures/2018/1/31/1517378773870.png",
    "iconBackgroundImage": "pictures/2018/1/31/1517390557925.png",
    "backgroundImage": "pictures/2018/1/30/1517298506024.jpg",
    "backgroundTitle": "情人节",
    "textContent": "曾经有一份真诚的爱情放在我面前，我没有珍惜，等我失去的时候我才后悔莫及，人世间最痛苦的事莫过于此。如果上天能够给我一个再来一次的机会，我会对那个女孩子说三个字：我爱你。如果非要在这份爱上加上一个期限，我希望是……一万年！",
    "sort": 1
  }
}, {
  "theme": {
    "id": 2,
    "title": "元宵快乐",
    "icon": "pictures/2018/1/31/1517378750103.png",
    "iconBackgroundImage": "pictures/2018/1/31/1517390557925.png",
    "backgroundImage": "pictures/2018/2/1/1517485547867.png",
    "backgroundTitle": "元宵",
    "textContent": "幸福是来自身边的每一份感动，来自照在身上的每一缕暖阳，来自亲情的温暖，来自亲人之间相互体贴相互包容的情怀，来自爱和被爱的幸福。幸福，其实很简单。元宵佳节到，祝你幸福快乐！",
    "sort": 2
  }
}, {
  "theme": {
    "id": 3,
    "title": "新年祝福",
    "icon": "pictures/2018/1/31/1517378730150.png",
    "iconBackgroundImage": "pictures/2018/1/31/1517390557925.png",
    "backgroundImage": "pictures/2018/2/2/1517564565451.png",
    "backgroundTitle": "新年祝语",
    "textContent": "我考虑过了，如果到了十二点，我注定会对你说那三个字，那我为何不早点说：新年好！",
    "sort": 2
  }
}, {
  "theme": {
    "id": 4,
    "title": "生日祝语",
    "icon": "pictures/2018/1/31/1517390530820.png",
    "iconBackgroundImage": "pictures/2018/1/31/1517390557925.png",
    "backgroundImage": "pictures/2018/1/31/1517388289440.png",
    "backgroundTitle": "生日快乐",
    "textContent": "在你生日这一天，没能陪在你身边，不能给你我的温暖，只能留下我的祝福，愿你快乐每一天！",
    "sort": 2
  }
}]