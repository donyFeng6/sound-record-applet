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
    Audio: { status: true },
    UserInfo: {},
    Params: {},
    ThemeByList: { theme: { backgroundImage: GlobalConfig.Resource + 'static/bg/bg_1.jpg'}},
    BgMusic: { active: "u-hide", text:"添加背景音乐"},
    whineAdio: { Type: "0", active: "u-hide", text: "戳我变声", filter:0, list: [{ type: 0, text: '原声' }, { type: 1, text: '男声 ' }, { type: 2, text: '萝莉  ' }, { type: 3, text: '儿童  ' }, { type: 4, text: '小黄人  ' }, { type: 5, text: '怪兽 ' }]},
    recordPlayMusic: { status: 'pause',duration:'00：00'},
    PlayAudio: {}, PlayAudioAction: { method: 'pause' },
    recordAudio: {},RecordPlayAudioAction: { method: 'play' },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this
    wx.getStorage({ key: 'RecorderFile', success: function (res) { _self.setData({ 'RecorderFile': res.data})},})

    _self.setData({ Params: { themeId: parseInt(options.themeId), themeTextId: parseInt(options.themeTextId), pageNum: 1, pageSize: 20 } })
    _self.recordAudioCtx = wx.createAudioContext('recordHearMusic')
    _self.recordHearAudio = wx.createAudioContext('recordHearAudio')
    GlobalConfig.setUserLogin(function (res) {
      _self.setData({ UserInfo: res })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _self = this, params = _self.data.Params
    console.log(_self);
    if (params.themeId) {
      var recordPlayMusic = _self.data.recordPlayMusic
      recordPlayMusic.duration = Global.formatSeconds(parseInt(_self.data.RecorderFile.duration / 1000))
      _self.setData({ recordPlayMusic:recordPlayMusic });
      _self.getMusicListByTheme(params);
    }
  },
  onHide() { var _self = this; _self.setData({ PlayAudioAction: { method: 'pause' }, RecordPlayAudioAction: { method: 'pause' } }); },
  onUnload() { var _self = this; _self.setData({ PlayAudioAction: { method: 'pause' }, RecordPlayAudioAction: { method: 'pause' } }); },
  /**
   * 添加背景音乐
   */
  BgMusic() { 
    var _self = this, params = _self.data.Params, BgMusic = _self.data.BgMusic
    if (BgMusic.hasOwnProperty('list')){
      BgMusic.active = "slideInDown"; 
      _self.setData({ BgMusic: BgMusic,});
    }else{
      _self.getMusicListByTheme(params);
    };
  },

  /**
   * 根据主题获取背景音乐
   */
  getMusicListByTheme(params){
    var _self = this, BgMusic = BgmusicList;
    BgMusic.active = "u-hide";

    _self.setData({ BgMusic: BgMusic})
    _self.loadOndeBgMusic()

  },
  /**
   * 加载第一个背景列表自动播放
   */
  loadOndeBgMusic(){
    var _self = this, BgMusic = _self.data.BgMusic;
    let Music = BgMusic.list[0];BgMusic.text = Music.title; BgMusic.clas = 'left';
    BgMusic.list[0].radio = true;
    console.log("1231456", BgMusic)
    _self.setData({ PlayAudio: Music, BgMusic: BgMusic });
    setTimeout(function(){_self.playAudioFile({ play: "play" }); _self.bgMusicPlay({ play: "play" });},1200)
  },
  /**
   * 选择列表改变背景音乐
   */
  ChangeBgMusic(e){
    var _self = this, Key = e.currentTarget.dataset.key, BgMusic = _self.data.BgMusic;
    let Music = BgMusic.list[Key];
    BgMusic.list.map(function(k,i){
      if (Music.id == k.id){
        BgMusic.list[i].radio = !BgMusic.list[i].radio;
        playBgMusic(BgMusic.list[i]);
      }else{
        BgMusic.list[i].radio = false;
      }
    })
    _self.setData({BgMusic: BgMusic});
    function playBgMusic(Music){
      BgMusic.active = 'slideOutDown';
      if (Music.radio){
        BgMusic.text = Music.title; BgMusic.clas = 'left'; 
        _self.setData({ PlayAudio: Music, BgMusic: BgMusic });
        _self.playAudioFile({ play: "play" });
      }else{
        BgMusic.text = '添加背景音乐'; BgMusic.clas = '';
        _self.setData({ PlayAudioAction: { method: 'pause' } });
      }
      _self.setData({ PlayAudio: Music, BgMusic: BgMusic });
    };
  },
  cancelBgMusic(e) {
    var _self = this, Music = "",BgMusic = _self.data.BgMusic;
    BgMusic.list.map(function (k, i) { if (k.radio) { Music = k } })
    if (Music == "") { 
      BgMusic.text = '添加背景音乐'; BgMusic.clas = '';
      _self.setData({ PlayAudioAction: { method: 'pause' } });
    };
    BgMusic.active = 'slideOutDown';
    _self.setData({ PlayAudio: Music, BgMusic: BgMusic });
  },
  closeBgMusicShield() {
    var _self = this, BgMusic = _self.data.BgMusic;BgMusic.active = 'slideOutDown';
    _self.setData({BgMusic: BgMusic });
  },
  PlayBgMusic(e){
    var _self = this, Key = e.currentTarget.dataset.key, BgMusic = _self.data.BgMusic
    _self.setData({ RecordPlayAudioAction: { method: 'pause' }, PlayAudioAction: { method: 'pause' } });
    let Music = BgMusic.list[Key];
    if (Music.play == "play"){
      Music.play = "pause"; BgMusic.list[Key] = Music;
      _self.setData({ PlayAudioAction: { method: 'pause' }, BgMusic: BgMusic });
    }else{
      _self.setData({ PlayAudio: Music });
      BgMusic.list.map(function(k,i){
        if (k.id == BgMusic.list[Key].id){BgMusic.list[i].play = "play";}else{ BgMusic.list[i].play = "pause";}
      });
      _self.setData({ PlayAudioAction: { method: 'play' }, BgMusic: BgMusic});
    };
  },
  /**
   * 添加滤镜效果
   */
  whineAdio() {
    var _self = this, params = _self.data.Params
    _self.getMusicwhineAdio(params);
  },
  getMusicwhineAdio(params) {
    var _self = this, whineAdio = _self.data.whineAdio;
    whineAdio.active = "slideInUp";
    setTimeout(function(){ _self.setData({ whineAdio: whineAdio });},100)
  },
  /**
   * 滤镜方式
   * 0 人声滤镜 , 1 环境滤镜
   * 需要后台处理音频返回
   */
  whineType(e){
    var _self = this, Type = e.currentTarget.dataset.type;
  },
  VoiceMusic(e){
    var _self = this, Key = e.currentTarget.dataset.key, whineAdio = _self.data.whineAdio, RecorderFile = _self.data.RecorderFile
    whineAdio.text = whineAdio.list[Key].text; whineAdio.filter = whineAdio.list[Key].type; 
    var Params = { filePath:RecorderFile.file, filter: whineAdio.list[Key].type}
    if (Params.filter){
      // 处理完音频
      /*
      RecorderFile.path = rst.result.newFilePath;
      _self.setData({ whineAdio: whineAdio, RecorderFile: RecorderFile });
      */
      _self.playAudioFile({ play: "play" });      
      _self.closeWhineShield()
      
    }else{
      RecorderFile.path = RecorderFile.file;
      _self.setData({ whineAdio: whineAdio, RecorderFile: RecorderFile });
      _self.playAudioFile({ play: "play" });
      _self.closeWhineShield()
    }
  },
  closeWhineShield(e){
    var _self = this, whineAdio = _self.data.whineAdio
    whineAdio.active = "slideOutDown";_self.setData({ whineAdio: whineAdio });
    setTimeout(function(){
      whineAdio.active = "u-hide"; _self.setData({ whineAdio: whineAdio });
    },1200)
  },

  /**
   * 播放音频文件
   */
  playAudioFile(param){
    var _self = this, recordPlayMusic = _self.data.recordPlayMusic,recordAudio = _self.data.recordAudio;
    recordAudio.audioUrl = _self.data.RecorderFile.path
    console.log(recordPlayMusic);
    if (recordPlayMusic.status == "play" && !param.hasOwnProperty('play')) {
      _self.bgMusicPlay({ play: "pause" })
      recordPlayMusic.status = "pause"; recordPlayMusic.duration = '00：00'
      _self.setData({ recordPlayMusic: recordPlayMusic, recordAudio: recordAudio })
      _self.setData({ RecordPlayAudioAction: { method: 'pause' }});
    }else{
      if (param.hasOwnProperty('play')){_self.recordAudioCtx.seek(0); _self.recordHearAudio.seek(0)};
      recordPlayMusic.status = "play";
      _self.bgMusicPlay({ play: "play" });
      _self.setData({ recordPlayMusic: recordPlayMusic, recordAudio: recordAudio })
      _self.setData({ RecordPlayAudioAction: { method: 'play' } });
    }
  },
  bgMusicPlay(param){
    var _self = this;
    if(_self.data.PlayAudio.audioUrl){
      if (param.play == "play"){
        _self.setData({ PlayAudioAction: { method: 'play' } });
      }else{
        _self.setData({ PlayAudioAction: { method: 'pause' }});
        _self.recordAudioCtx.seek(0)
      }
    };
  },
  /**
  * 试听播放时长控制内容
  */
  playDurationCtr: function (audio) {
    var _self = this, recordPlayMusic = _self.data.recordPlayMusic;
    recordPlayMusic.duration = Global.formatSeconds(audio.detail.duration-audio.detail.currentTime)
    _self.setData({ recordPlayMusic: recordPlayMusic })
  },
  RecordPlayEndAudio(e){
    var _self = this, recordPlayMusic = _self.data.recordPlayMusic;
    _self.bgMusicPlay({ play: "pause" })
    recordPlayMusic.status = "pause";
    recordPlayMusic.duration = Global.formatSeconds(parseInt(_self.data.RecorderFile.duration / 1000))
    _self.setData({ recordPlayMusic: recordPlayMusic });
  },
  /**
   * 生成录音
   */
  RecorderManager(e){
    var _self = this;
    wx.redirectTo({ url: '/src/pages/createRecord',})
    wx.hideLoading();
  },
})

var BgmusicList = {list:[
  {
    "id": 18,
    "themeId": 1,
    "title": "告白气球",
    "audioUrl": "2018/02/02/1517552167370.mp3"
  }, {
    "id": 19,
    "themeId": 1,
    "title": "最浪漫的事",
    "audioUrl": "2018/02/02/1517552153248.mp3"
  }, {
    "id": 32,
    "themeId": 2,
    "title": "花好月圆",
    "audioUrl": "2018/02/02/1517552366561.mp3"
  }, {
    "id": 46,
    "themeId": 4,
    "title": "生日快乐（合唱）",
    "audioUrl": "2018/02/02/1517552153248.mp3"
  }, {
    "id": 48,
    "themeId": 1,
    "title": "大话西游",
    "audioUrl": "2018/02/03/1517629464649.mp3"
  }
]}
