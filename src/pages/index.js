// src/pages/index.js

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
    Params:{},
    ThemeByList:{},
    Record: {},
    PlayAudio: {},
    PlayAudioAction: { method: 'pause' },
    bgPlayAudioAction: { method: 'pause' },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this
    _self.audioCtx = wx.createAudioContext('testHearMusic')
    _self.bgHearAudio = wx.createAudioContext('bgHearAudio')
    _self.setData({ Params: { themeId: parseInt(options.id), textIndex:1, pageNum: 1, pageSize:20} })
    GlobalConfig.setUserLogin(function (res) {
      _self.setData({ UserInfo: res})
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    var _self = this, params = _self.data.Params
    _self.getRandomTextByTheme(params);
  },
  onHide() { var _self = this; _self.setData({ PlayAudioAction: { method: 'pause' } });},
  onUnload() { var _self = this; _self.setData({ PlayAudioAction: { method: 'pause' } });},
  getRandomTextByTheme(params){
    var _self = this
    result.forEach(function (d,f) {
      if (d.theme.id == params.themeId){
        d.theme.textlist = d.theme.textContent.split('|');
        d.list.map(function (k, i){
          d.list[i].filterT = ' (' + _self.filterVoice(k.filter) + ')'
        })
        _self.setData({ ThemeByList: d});
        console.log(d, f);
      }
    })
  },
  /**
   * 类型
   */
  filterVoice(T){
    let Type = "";
    switch (T){
      case 0: return "原声"; case 1: return "男声";case 2: return "萝莉"; case 3: return "儿童";
      case 4: return "小黄人";case 5: return "怪兽";default: return "";
    };
  },
  /**
   * 点击播放试听
   */
  PlayAudio(e){
    var _self = this, Key = e.currentTarget.dataset.key, ThemeByList = _self.data.ThemeByList;
    if (ThemeByList.list[Key].play && ThemeByList.list[Key].play == "play"){
      ThemeByList.list[Key].play = "pause"
      Music(ThemeByList.list[Key]);
    }else{
      ThemeByList.list.map(function(k,i){
        if (k.id == ThemeByList.list[Key].id){
          ThemeByList.list[i].play = "play"
          Music(ThemeByList.list[Key]);
        }else{
          ThemeByList.list[i].play = "pause"
        }
      })
    }
    _self.setData({ ThemeByList: ThemeByList});
    function Music(audio){
      let bgAudioUrl = "";
      _self.setData({ PlayAudioAction: { method: 'pause' }, bgPlayAudioAction: { method: 'pause' }}); 
      if (audio.themeBackgroundMusicUrl) { bgAudioUrl = _self.data.Resource + audio.themeBackgroundMusicUrl}
      var PlayAudio = { recordUrl: _self.data.Resource + audio.recordUrl, bgAudioUrl: bgAudioUrl}
      _self.setData({ PlayAudio: PlayAudio}); 
      if (audio.play == "play"){
        _self.audioCtx.pause(); _self.bgHearAudio.pause();
        _self.setData({ PlayAudioAction: { method: 'play' }, bgPlayAudioAction: { method: 'play' } });
        _self.recordPlayCount(audio);
      }else{
        _self.audioCtx.pause(); _self.bgHearAudio.pause();
      }
    };
  },
  /**
   * 试听结束
   */
  endPlayAudio(){
    var _self = this,ThemeByList = _self.data.ThemeByList;
    ThemeByList.list.map(function (k, i) {
      ThemeByList.list[i].play = "pause"
    })
    _self.audioCtx.pause(); _self.bgHearAudio.pause();
    _self.setData({ ThemeByList: ThemeByList });
  },
  /**
   * 记录用户播放录音
   */
  recordPlayCount(audio){
    var _self = this,ThemeByList = _self.data.ThemeByList;
    ThemeByList.list.map(function (k, i) { if (k.id == audio.id) { ThemeByList.list[i].playCount++ } })
    _self.setData({ ThemeByList: ThemeByList });
  },
  /**
   * 试听播放时长控制内容
   */
  playDurationCtr(audio){
    var _self = this;
    // console.log(parseInt(audio.detail.currentTime));
  },
  /**
   * 换一换事件
   */
  exchangeOnce(e){
    var _self = this, params = _self.data.Params
    params.themeId = Math.round(Math.random() * (result.length - 1))
    _self.getRandomTextByTheme(params);
  },
  /**
   * 加载更多
   */
  MyRecordScroll(e) {
    var _self = this, params = _self.data.Params;
    if (params.pageNum < params.totalPage) {
      params.pageNum++;
      let ThemeByList = _self.data.ThemeByList;
      params.themeTextId = ThemeByList.entity.id

      var MyRecordList = res.result; //更多数据

      let resourceList = ThemeByList.list.reverse();
      resourceList.map(function (k, j) {
        MyRecordList.page.list.unshift(k);
      }); ThemeByList.list = MyRecordList.page
      ThemeByList.list.map(function (k, i) {
        ThemeByList.list[i].filterT = ' (' + _self.filterVoice(k.filter) + ')'
      })
      _self.setData({ ThemeByList: ThemeByList });
      
    };
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
    "textContent":"曾经有一份真诚的爱情放在我面前，我没有珍惜，等我失去的时候我才后悔莫及，人世间最痛苦的事莫过于此。如果上天能够给我一个再来一次的机会，我会对那个女孩子说三个字：我爱你。如果非要在这份爱上加上一个期限，我希望是……一万年！",
    "sort": 1
  },
  "list": [
    {
      "id": 170,
      "userId": 219,
      "themeId": 2,
      "duration": 7,
      "filter": 0,
      "playCount": 4287,
      "theme_text_id": 170,
      "title": "新年大礼包",
      "recordUrl": "records/219/2018/2/5/1517817613202.m4a",
      "bgAudioUrl": "2018/02/02/1517552355061.mp3",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLC6KxcHs6pkAbLhYBFpias4UEx85o2yb6OFYQjVrtwgWiaIfW5SicoE96etMdCTwvf0kuBgibribp6ntw/0",
      "nickName": "薄荷（芳芳）"
    }, {
      "id": 867,
      "userId": 2069,
      "themeId": 4,
      "duration": 6,
      "filter": 0,
      "playCount": 2323,
      "theme_text_id": 867,
      "title": "单身狗的伤害",
      "recordUrl": "records/2069/2018/2/15/1518678600759.m4a",
      "bgAudioUrl": "2018/02/03/1517627212760.mp3",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Hia8lGUNZ3xh7wU5kxXsfqgZq5ZskRibaS2AEiaoJGhS5hhnDRAge5Rv7w4whiagd231m6THlUEiakA24J4CzzzZEAw/0",
      "nickName": "一江水"
    }, {
      "id": 655,
      "userId": 1717,
      "themeId": 5,
      "duration": 10,
      "filter": 2,
      "playCount": 2280,
      "theme_text_id": 655,
      "title": "生日祝福",
      "recordUrl": "records/1717/2018/2/14/15185818610882.m4a",
      "bgAudioUrl": "2018/02/03/1517626970899.mp3",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eojmyRnAGkn1bX3dP4iaCyhRGrpD2qbwibkFYKcnFbiaRBCDEyoibFz5maVg2ib0VEdoKh5amJjkTD5K5A/0",
      "nickName": "向献荣"
    }, {
      "id": 794,
      "userId": 2091,
      "themeId": 2,
      "duration": 8,
      "filter": 0,
      "playCount": 1459,
      "theme_text_id": 794,
      "title": "新年快乐♪٩(´ω`)و♪",
      "recordUrl": "records/2091/2018/2/15/1518666444321.m4a",
      "bgAudioUrl": "2018/02/02/1517552382454.mp3",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erOXxuh3Xe4UtTRHXtFpic65h33hicjmvhmicsHXHo2DkMOl4MM7ovstt4X7sM4DBpabsSUYX2BdZPtA/0",
      "nickName": "王3"
    }, {
      "id": 693,
      "userId": 1791,
      "themeId": 4,
      "duration": 5,
      "filter": 0,
      "playCount": 965,
      "theme_text_id": 693,
      "title": "我想对你说",
      "recordUrl": "records/1791/2018/2/14/1518612793419.m4a",
      "bgAudioUrl": "2018/02/03/1517627212760.mp3",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/zSMrJzicPUSCQBu5qxYianGS5qIcR4ibudmfVVhBibibCgcmIOJO6D77DoE7FfhF33CJcZF5KlQicomPOJvzREXcmKXA/0",
      "nickName": "."
    }, {
      "id": 541,
      "userId": 1415,
      "themeId": 5,
      "duration": 6,
      "filter": 1,
      "playCount": 928,
      "theme_text_id": 541,
      "title": "生日快乐",
      "recordUrl": "records/1415/2018/2/12/1518419214631.m4a",
      "bgAudioUrl": "2018/02/03/1517627074499.mp3",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/RIRsz0GqzyytJcnna19iatj5QhRfWias23dpQbuOcTPMzrsJoBlfWjkT6bVEpLNf80SvSHS84CmaiaVoDluqWjNGw/0",
      "nickName": "A_"
    }, {
      "id": 790,
      "userId": 2042,
      "themeId": 2,
      "duration": 7,
      "filter": 0,
      "playCount": 796,
      "theme_text_id": 790,
      "title": "拜年啦～",
      "recordUrl": "records/2042/2018/2/15/1518666146298.m4a",
      "bgAudioUrl": "2018/02/02/1517552355061.mp3",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erialgIrAFYPTQ5XrzONFuVibkvES9W1cm6ggKLHnTVEy7Pnh1ViaK30GibnWwZ5ZByyABiaBiaicm3iay0mw/0",
      "nickName": "孙燕"
    }, {
      "id": 576,
      "userId": 1538,
      "themeId": 2,
      "duration": 6,
      "filter": 2,
      "playCount": 683,
      "theme_text_id": 576,
      "title": "狗年祝福",
      "recordUrl": "records/1538/2018/2/13/15185128326332.m4a",
      "bgAudioUrl": "2018/02/08/1518077614538.mp3",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/lJ3JO9S9HQOgHB8sI8tgMUE1kIY6e2U7Ijh0HCOCppOCEibzialicHlfTcLrdPlicghZ1XzUK1vb3Qg2YEGvDAiaK7g/0",
      "nickName": "Yang"
    }, {
      "id": 537,
      "userId": 1409,
      "themeId": 5,
      "duration": 10,
      "filter": 3,
      "playCount": 631,
      "theme_text_id": 537,
      "title": "生日祝福",
      "recordUrl": "records/1409/2018/2/12/15184162035053.m4a",
      "bgAudioUrl": "2018/02/03/1517626970899.mp3",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJMkN5ibbichvhDSeVLuWreg1rOJOyPEmpbUGWZKJXDOv3lrZ2TAphk2aFKqc4Vsg6nr3maamfAovQg/0",
      "nickName": "老王"
    }, {
      "id": 565,
      "userId": 1490,
      "themeId": 5,
      "duration": 15,
      "filter": 0,
      "playCount": 596,
      "theme_text_id": 565,
      "title": "本宝宝不开心",
      "recordUrl": "records/1490/2018/2/12/1518446836770.m4a",
      "bgAudioUrl": "2018/02/03/1517626970899.mp3",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/nAUerBSE0ARYaDJrlMxaTOia3YMzJ6DXRarJ3TQMSgFPSiabpiaITwhiaREdqgwFW9ZLe0HRS2A49kbvEUZod6KfXQ/0",
      "nickName": "娟娟"
    }, {
      "id": 173,
      "userId": 219,
      "themeId": 2,
      "duration": 13,
      "filter": 0,
      "playCount": 572,
      "theme_text_id": 173,
      "title": "新年祝福",
      "recordUrl": "records/219/2018/2/5/1517817991789.m4a",
      "bgAudioUrl": "2018/02/02/1517552408120.mp3",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLC6KxcHs6pkAbLhYBFpias4UEx85o2yb6OFYQjVrtwgWiaIfW5SicoE96etMdCTwvf0kuBgibribp6ntw/0",
      "nickName": "薄荷（芳芳）"
    }, {
      "id": 787,
      "userId": 87,
      "themeId": 2,
      "duration": 8,
      "filter": 0,
      "playCount": 526,
      "theme_text_id": 787,
      "title": "恭喜发财",
      "recordUrl": "records/87/2018/2/15/1518665952339.m4a",
      "bgAudioUrl": "2018/02/02/1517552408120.mp3",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJak8cc3Xol8gYbhwtJf8ZKyzu8lYPgTjhDHACZZu7fBWYldE1Oiav7uECgzhXTYye2TOUJu66dcyg/0",
      "nickName": "panda"
    }, {
      "id": 680,
      "userId": 1763,
      "themeId": 4,
      "duration": 6,
      "filter": 3,
      "playCount": 506,
      "theme_text_id": 680,
      "title": "真情告白",
      "recordUrl": "records/1763/2018/2/14/15186026582613.m4a",
      "bgAudioUrl": "2018/02/03/1517627212760.mp3",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/syprRnNGKqIKdRVd4DbQ038kJJFjtmLkylO8KNLiarDDO79c4ician2Tz8PibfTASb0JGx5pS3CvUXzicfJmI48IhRw/0",
      "nickName": "往事*如风"
    } 
  ]
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
    },
    "list": [
      {
        "id": 166,
        "userId": 219,
        "themeId": 4,
        "duration": 15,
        "filter": 0,
        "playCount": 491,
        "theme_text_id": 166,
        "title": "我愿意和你一起浪费",
        "recordUrl": "records/219/2018/2/5/1517815585632.m4a",
        "bgAudioUrl": "2018/02/03/1517629464649.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLC6KxcHs6pkAbLhYBFpias4UEx85o2yb6OFYQjVrtwgWiaIfW5SicoE96etMdCTwvf0kuBgibribp6ntw/0",
        "nickName": "薄荷（芳芳）"
      }, {
        "id": 664,
        "userId": 1749,
        "themeId": 4,
        "duration": 5,
        "filter": 0,
        "playCount": 480,
        "theme_text_id": 664,
        "title": "情人节红包",
        "recordUrl": "records/1749/2018/2/14/1518595238177.m4a",
        "bgAudioUrl": "2018/02/03/1517627212760.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Oh33bNAC2jicSRmO83cwEFAhuYia98v46iajKfJ81hE5NLtkdVwnz2cHf5p4vHkrngrq50oewTGibhs33lRCe6gHZg/0",
        "nickName": "黄家灿"
      }, {
        "id": 724,
        "userId": 1883,
        "themeId": 2,
        "duration": 14,
        "filter": 0,
        "playCount": 470,
        "theme_text_id": 724,
        "title": "高老师的2018",
        "recordUrl": "records/1883/2018/2/15/1518656581971.m4a",
        "bgAudioUrl": "2018/02/02/1517552408120.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/33mia79lwdjibjFAmPKunTJPu4HOE0A1k1MTXk8Hm3wc6hjKrbciab5Vsicjyibfw1pS7nlP7A8Zf2Z0zLQ2LuEbNSg/0",
        "nickName": "A??麦田高自立13521107553"
      }, {
        "id": 318,
        "userId": 566,
        "themeId": 5,
        "duration": 13,
        "filter": 2,
        "playCount": 442,
        "theme_text_id": 318,
        "title": "生日蜜语",
        "recordUrl": "records/566/2018/2/9/15181484037042.m4a",
        "bgAudioUrl": "2018/02/03/1517626970899.mp3",
        "avatarUrl": null,
        "nickName": "今非昔比"
      }, {
        "id": 648,
        "userId": 1706,
        "themeId": 4,
        "duration": 5,
        "filter": 5,
        "playCount": 421,
        "theme_text_id": 648,
        "title": "真情告白",
        "recordUrl": "records/1706/2018/2/14/15185767984515.m4a",
        "bgAudioUrl": "2018/02/03/1517627212760.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLDdBGLFIiaU9hJvOwaSa1ay23PI53rFIicSxiaFicQHErrM3OheG1swyZTFmwSkEDF7wbJlLy59jh5icQ/0",
        "nickName": "相约未来"
      }, {
        "id": 656,
        "userId": 1717,
        "themeId": 5,
        "duration": 11,
        "filter": 0,
        "playCount": 372,
        "theme_text_id": 656,
        "title": "生日祝福",
        "recordUrl": "records/1717/2018/2/14/1518581920984.m4a",
        "bgAudioUrl": "2018/02/03/1517626970899.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eojmyRnAGkn1bX3dP4iaCyhRGrpD2qbwibkFYKcnFbiaRBCDEyoibFz5maVg2ib0VEdoKh5amJjkTD5K5A/0",
        "nickName": "向献荣"
      }, {
        "id": 445,
        "userId": 1015,
        "themeId": 4,
        "duration": 6,
        "filter": 1,
        "playCount": 330,
        "theme_text_id": 445,
        "title": "没有你吃不下饭",
        "recordUrl": "records/1015/2018/2/11/15182811519791.m4a",
        "bgAudioUrl": "2018/02/03/1517627212760.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/PHxicwRWicribD4qiaBds7lMSVWg8pqMtcTatIZmdBF2XuhJtJdPJZObBcDteTK8KgYt26RBJ0a44O936vjsNupJWw/0",
        "nickName": "大丹"
      }, {
        "id": 316,
        "userId": 566,
        "themeId": 5,
        "duration": 12,
        "filter": 0,
        "playCount": 317,
        "theme_text_id": 316,
        "title": "生日幸福",
        "recordUrl": "records/566/2018/2/9/1518148266198.m4a",
        "bgAudioUrl": "2018/02/03/1517626970899.mp3",
        "avatarUrl": null,
        "nickName": "今非昔比"
      }, {
        "id": 644,
        "userId": 1693,
        "themeId": 4,
        "duration": 7,
        "filter": 0,
        "playCount": 307,
        "theme_text_id": 644,
        "title": "单身狗的伤害",
        "recordUrl": "records/1693/2018/2/14/1518573505366.m4a",
        "bgAudioUrl": "2018/02/03/1517627212760.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep28QR6goGBg1Pia6SMZvEAnB5wVRibS4eTea1l7XJ5rGftGPVV5GLqKsWJ9F8SQvaxnVmQoXl1bD5g/0",
        "nickName": "@"
      }, {
        "id": 500,
        "userId": 1262,
        "themeId": 4,
        "duration": 13,
        "filter": 0,
        "playCount": 291,
        "theme_text_id": 500,
        "title": "傻瓜，爱你",
        "recordUrl": "records/1262/2018/2/11/1518337159244.m4a",
        "bgAudioUrl": "2018/02/08/1518075695084.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/iaYWHJBbHA5e5cjn3iaO2o8icMunFp22aDKpD5r7TyicI8ia1dRfmnWxjp0ibk4gu2rDQyzaVNfvL0ic9gDvWwrw2VUwA/0",
        "nickName": "陌生人"
      }, {
        "id": 686,
        "userId": 1786,
        "themeId": 2,
        "duration": 9,
        "filter": 2,
        "playCount": 284,
        "theme_text_id": 686,
        "title": "新年问候",
        "recordUrl": "records/1786/2018/2/14/15186108890552.m4a",
        "bgAudioUrl": "2018/02/02/1517552355061.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/9oBhtfYNQmIJaQ18POgRGicUO0RxjXrsmHbCpFiaX7ztbT9p80CYG3EjtMmG3phQAK59Ns6z2RgRVtL9gf6tHpeA/0",
        "nickName": "静兒"
      }, {
        "id": 643,
        "userId": 530,
        "themeId": 4,
        "duration": 9,
        "filter": 0,
        "playCount": 259,
        "theme_text_id": 643,
        "title": "暖暖情话",
        "recordUrl": "records/530/2018/2/14/1518573117306.m4a",
        "bgAudioUrl": "2018/02/03/1517627212760.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/8DpT1vXbXSLNiaTHHDotQiaE2kkXn6nicHiaMYAO8Lo41wJItYzLrbRfXcg1icyPucaW4JIu2NFPvW3z3SFtr5aQSibg/0",
        "nickName": "T Y E E"
      }, {
        "id": 571,
        "userId": 1423,
        "themeId": 2,
        "duration": 36,
        "filter": 2,
        "playCount": 255,
        "theme_text_id": 571,
        "title": "小女子不才",
        "recordUrl": "records/1423/2018/2/13/15184953626462.m4a",
        "bgAudioUrl": "2018/02/02/1517550061672.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/K84ibNDDuAeffDGRNR89L9FiaRUuc8GUnGIv9qZyvIx7kSEROMQlnk8Qs6gETUKic7bGz8NvziazYnGo8E3gBNmtRA/0",
        "nickName": "南定楼佳人＊"
      }
    ]
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
    },
    "list": [
      {
        "id": 574,
        "userId": 1536,
        "themeId": 2,
        "duration": 9,
        "filter": 2,
        "playCount": 244,
        "theme_text_id": 574,
        "title": "新年悄悄话",
        "recordUrl": "records/1536/2018/2/13/15185122744592.m4a",
        "bgAudioUrl": "2018/02/08/1518077614538.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/YBdQKVRC5rwBjJFdaetIDXNzfYs7hSzSedSNs95M1CX8nnlmvTibfkyUnCKCGAT47G2lKgIvFdlibpVYIr8ClMLg/0",
        "nickName": "叶子文文"
      }, {
        "id": 564,
        "userId": 1490,
        "themeId": 2,
        "duration": 6,
        "filter": 2,
        "playCount": 233,
        "theme_text_id": 564,
        "title": "拜年祝福语",
        "recordUrl": "records/1490/2018/2/12/15184467094612.m4a",
        "bgAudioUrl": "2018/02/02/1517552335705.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/nAUerBSE0ARYaDJrlMxaTOia3YMzJ6DXRarJ3TQMSgFPSiabpiaITwhiaREdqgwFW9ZLe0HRS2A49kbvEUZod6KfXQ/0",
        "nickName": "娟娟"
      }, {
        "id": 793,
        "userId": 2069,
        "themeId": 2,
        "duration": 7,
        "filter": 0,
        "playCount": 223,
        "theme_text_id": 793,
        "title": "恭喜发财",
        "recordUrl": "records/2069/2018/2/15/1518666307949.m4a",
        "bgAudioUrl": "2018/02/02/1517552355061.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Hia8lGUNZ3xh7wU5kxXsfqgZq5ZskRibaS2AEiaoJGhS5hhnDRAge5Rv7w4whiagd231m6THlUEiakA24J4CzzzZEAw/0",
        "nickName": "一江水"
      }, {
        "id": 288,
        "userId": 460,
        "themeId": 5,
        "duration": 6,
        "filter": 1,
        "playCount": 219,
        "theme_text_id": 288,
        "title": "生日快乐",
        "recordUrl": "records/460/2018/2/8/15180808201921.m4a",
        "bgAudioUrl": "2018/02/03/1517626970899.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eraWkwsBjFicFSd3Upic8eqllQ798ezfW2jnAK5Sp5icGLibj25umFEQsDLlQJjw2TeAw7GSQUCdO6iaAw/0",
        "nickName": "Ahmed"
      }, {
        "id": 544,
        "userId": 1437,
        "themeId": 2,
        "duration": 6,
        "filter": 4,
        "playCount": 214,
        "theme_text_id": 544,
        "title": "新年祝福",
        "recordUrl": "records/1437/2018/2/12/15184284800724.m4a",
        "bgAudioUrl": "2018/02/02/1517552408120.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/kSKeGH3869XCos1FMjXO2rWsUaOx2DezPVLgmURYRfickxjvX9zkA2ys9icIWdtpanxJXiau63OJjS9Dm122OHHRA/0",
        "nickName": "有秀"
      }, {
        "id": 174,
        "userId": 219,
        "themeId": 2,
        "duration": 14,
        "filter": 0,
        "playCount": 213,
        "theme_text_id": 174,
        "title": "新年悄悄话",
        "recordUrl": "records/219/2018/2/5/1517818076829.m4a",
        "bgAudioUrl": "2018/02/02/1517552408120.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLC6KxcHs6pkAbLhYBFpias4UEx85o2yb6OFYQjVrtwgWiaIfW5SicoE96etMdCTwvf0kuBgibribp6ntw/0",
        "nickName": "薄荷（芳芳）"
      }, {
        "id": 567,
        "userId": 415,
        "themeId": 5,
        "duration": 11,
        "filter": 0,
        "playCount": 212,
        "theme_text_id": 567,
        "title": "生日祝福",
        "recordUrl": "records/415/2018/2/13/1518479858374.m4a",
        "bgAudioUrl": "2018/02/03/1517626970899.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/BL7ic7uQTibM0CQtloQiaZOkKXuHXGJv4FC0ctaqLnDjdNBodBePLUiabDcqgnKlZ769IgVRFLp9cAcdG1vecic5BPw/132",
        "nickName": "梦尼"
      }, {
        "id": 580,
        "userId": 1565,
        "themeId": 2,
        "duration": 10,
        "filter": 1,
        "playCount": 204,
        "theme_text_id": 580,
        "title": "新年祝福",
        "recordUrl": "records/1565/2018/2/13/15185235163361.m4a",
        "bgAudioUrl": "2018/02/08/1518077614538.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epSapWoTKAwRaajK0QvZEaulsGPEgHaBrFW3lQK8w69vFmTLguOvUgJxjNSic9mvmQr9wicFnGyWJeQ/0",
        "nickName": "微风波涛。"
      }, {
        "id": 460,
        "userId": 1120,
        "themeId": 2,
        "duration": 6,
        "filter": 4,
        "playCount": 199,
        "theme_text_id": 460,
        "title": "新年祝福语",
        "recordUrl": "records/1120/2018/2/11/15183092922924.m4a",
        "bgAudioUrl": "2018/02/08/1518077614538.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/LmRiaIQL30dWib1PjLz1ocmAf01hLOXbGHpqXsEWKcoZlsJBbKIspL1uzdY9apbhrS7GsfhiblmwvE8fGia8HzrJOA/0",
        "nickName": "山生有幸 刘丹萍"
      }, {
        "id": 156,
        "userId": 196,
        "themeId": 5,
        "duration": 9,
        "filter": 0,
        "playCount": 196,
        "theme_text_id": 156,
        "title": "生日蜜语",
        "recordUrl": "records/196/2018/2/4/1517759144433.m4a",
        "bgAudioUrl": "2018/02/03/1517627104699.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/v0JX7YwuIJJxmbpqaw5srmSBe65DIqxhFMRUicPPYtyVWReCAG3CUGibn5LA1dONWGlaia4jTxAVbDVWIekjibicwBg/0",
        "nickName": "傲娇girl~^o^"
      }, {
        "id": 603,
        "userId": 1603,
        "themeId": 4,
        "duration": 6,
        "filter": 0,
        "playCount": 194,
        "theme_text_id": 603,
        "title": "真挚告白",
        "recordUrl": "records/1603/2018/2/13/1518534935505.m4a",
        "bgAudioUrl": "2018/02/03/1517627212760.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJE6vGmmtDYviaNSwV6CJZDFoMPcqNsicCbpeOy8qfk7ACibP9hLZdP7GGJZ3VvMbgBricicOXTibXLTIJg/132",
        "nickName": "PENNY ?"
      }, {
        "id": 706,
        "userId": 1820,
        "themeId": 2,
        "duration": 7,
        "filter": 0,
        "playCount": 185,
        "theme_text_id": 706,
        "title": "新年小惊喜",
        "recordUrl": "records/1820/2018/2/15/1518625028584.m4a",
        "bgAudioUrl": "2018/02/08/1518077614538.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/wLEPpv6VzggQFtCicNC0AMEESaw5a7sN98KPDRpNmLI2ibJ20W5AjBAWNzj29qal4KuwNUBLhpHgtib1ELRicYW3UQ/0",
        "nickName": "胡春燕"
      }
    ]
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
    },
    "list": [
      {
        "id": 127,
        "userId": 6,
        "themeId": 5,
        "duration": 11,
        "filter": 0,
        "playCount": 183,
        "theme_text_id": 127,
        "title": "生日蜜语",
        "recordUrl": "records/6/2018/2/3/1517637289161.m4a",
        "bgAudioUrl": "2018/02/03/1517627009325.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/7kFLZEHqticdtxZf39iaW4wRTOYVhYJVr0UNljicKRefQrz9fXTdsLeGSY5TVtlgGXvsheQwIc9IkYGMdpv5oOorw/0",
        "nickName": "DⅦ⑺"
      }, {
        "id": 587,
        "userId": 1582,
        "themeId": 5,
        "duration": 13,
        "filter": 0,
        "playCount": 181,
        "theme_text_id": 587,
        "title": "生日快乐",
        "recordUrl": "records/1582/2018/2/13/1518528287513.m4a",
        "bgAudioUrl": "2018/02/03/1517626970899.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Gv6CRB7PUMvAjwNib8wOQXHgRC4dibQKMperxmTickaDdgz1WFhPQYmGmzjqM54bX7tMpQGIvet2ONb282eXACPfQ/0",
        "nickName": "Flowers"
      }, {
        "id": 187,
        "userId": 261,
        "themeId": 4,
        "duration": 11,
        "filter": 0,
        "playCount": 171,
        "theme_text_id": 187,
        "title": "我想对你说",
        "recordUrl": "records/261/2018/2/5/1517840088885.m4a",
        "bgAudioUrl": "2018/02/02/1517552041326.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/BavOCiaT6LVpbibGgiaxJOZSJRWmQkRMtGoHCiaYFhtKUZgZDwgGXico7J43wlE4N2t33rYstePkqxMibUq1EibrlcYpg/0",
        "nickName": "对方正在输入..."
      }, {
        "id": 649,
        "userId": 1711,
        "themeId": 4,
        "duration": 15,
        "filter": 0,
        "playCount": 170,
        "theme_text_id": 649,
        "title": "亲爱的于，我爱你?",
        "recordUrl": "records/1711/2018/2/14/1518579331882.m4a",
        "bgAudioUrl": "2018/02/02/1517552191838.mp3",
        "avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/KNmVd2yl1J8xnZhkGtfkOUS2ysTNgMLujGUwZFEV85AxpE5lzJ3EjaSFLORibHVjWmCoUjXk6v4HhUic9icqoThtQ/132",
        "nickName": "佳玮"
      }, {
        "id": 125,
        "userId": 6,
        "themeId": 5,
        "duration": 9,
        "filter": 1,
        "playCount": 169,
        "theme_text_id": 125,
        "title": "生日祝福",
        "recordUrl": "records/6/2018/2/3/15176366813961.m4a",
        "bgAudioUrl": "2018/02/03/1517626970899.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/7kFLZEHqticdtxZf39iaW4wRTOYVhYJVr0UNljicKRefQrz9fXTdsLeGSY5TVtlgGXvsheQwIc9IkYGMdpv5oOorw/0",
        "nickName": "DⅦ⑺"
      }, {
        "id": 579,
        "userId": 1550,
        "themeId": 4,
        "duration": 4,
        "filter": 2,
        "playCount": 167,
        "theme_text_id": 579,
        "title": "暖暖情话",
        "recordUrl": "records/1550/2018/2/13/15185192875262.m4a",
        "bgAudioUrl": "2018/02/03/1517627212760.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLeEv8Zjm3DgRGSXanvL55MibEj6VeHLcUH66DHgBOwzpun3u0RVCx43MZibnFia6UJkoYD0JC6d5ROg/0",
        "nickName": "小蓉"
      }, {
        "id": 261,
        "userId": 415,
        "themeId": 5,
        "duration": 11,
        "filter": 0,
        "playCount": 166,
        "theme_text_id": 261,
        "title": "生日祝福",
        "recordUrl": "records/415/2018/2/8/1518058260554.m4a",
        "bgAudioUrl": "2018/02/03/1517626970899.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/BL7ic7uQTibM0CQtloQiaZOkKXuHXGJv4FC0ctaqLnDjdNBodBePLUiabDcqgnKlZ769IgVRFLp9cAcdG1vecic5BPw/132",
        "nickName": "梦尼"
      }, {
        "id": 637,
        "userId": 1684,
        "themeId": 4,
        "duration": 7,
        "filter": 0,
        "playCount": 166,
        "theme_text_id": 637,
        "title": "暖暖情话",
        "recordUrl": "records/1684/2018/2/14/1518571348222.m4a",
        "bgAudioUrl": "2018/02/03/1517627212760.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eraYbaM2lNBuQezAOolI3J7qYHwPtZjnLU5ichDK8bAuD3nYicHKJq3QNSfwzguDUuNKFNto6AF5ibYQ/0",
        "nickName": "Coral"
      }, {
        "id": 184,
        "userId": 249,
        "themeId": 5,
        "duration": 9,
        "filter": 2,
        "playCount": 156,
        "theme_text_id": 184,
        "title": "生日祝福",
        "recordUrl": "records/249/2018/2/5/15178307998512.m4a",
        "bgAudioUrl": "2018/02/03/1517626970899.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/egFQ0Mp98U2gDTCicGBTWjkEdsbdlBnlSONxfg2AASJq9icDCZpggewt2WqD9tXia95S60Z3p1xrsib2ia7s0l7jibJw/0",
        "nickName": "Jason"
      }, {
        "id": 230,
        "userId": 24,
        "themeId": 5,
        "duration": 8,
        "filter": 0,
        "playCount": 152,
        "theme_text_id": 230,
        "title": "生日祝福",
        "recordUrl": "records/24/2018/2/6/1517912250563.m4a",
        "bgAudioUrl": "2018/02/03/1517626970899.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL2u0ichh3GdMpCYh4sHhgOvjqXZOTWxEgAemqzqCEb8D7Jsc4WAh8icEU21kYiagnHFBY9ae0h5Bv9w/132",
        "nickName": "欧欧"
      }, {
        "id": 621,
        "userId": 1643,
        "themeId": 4,
        "duration": 5,
        "filter": 0,
        "playCount": 150,
        "theme_text_id": 621,
        "title": "暖暖情话",
        "recordUrl": "records/1643/2018/2/13/1518536763593.m4a",
        "bgAudioUrl": "2018/02/02/1517552041326.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEKH5CwUicfAGc1B3mzc59ibNNYdCPMcGjicEpGQyuOEvZDXU5fRrbUu4XOHibtWqQWuYAribKpCicfX64Kw/0",
        "nickName": "朵耳"
      }, {
        "id": 563,
        "userId": 1490,
        "themeId": 4,
        "duration": 5,
        "filter": 4,
        "playCount": 149,
        "theme_text_id": 563,
        "title": "本宝宝不服",
        "recordUrl": "records/1490/2018/2/12/15184464754334.m4a",
        "bgAudioUrl": "2018/02/03/1517627212760.mp3",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/nAUerBSE0ARYaDJrlMxaTOia3YMzJ6DXRarJ3TQMSgFPSiabpiaITwhiaREdqgwFW9ZLe0HRS2A49kbvEUZod6KfXQ/0",
        "nickName": "娟娟"
      }
      ]
  }]