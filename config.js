/**
 * 配置文件
 */ 
const host = `https://api.pigbanker.com`, Path = `record-applet`;
class ConfigGlobal {
  constructor(){
    var _self = this
    _self.URL = _self.URLS()
    _self.Resource = `${host}/audioRecordingResource/` //资源地址配置
  }
  // 接口地址
  URLS(){
    return {
      getData: `${host}/${Path}/示例而已别当真`,         //获取数据接口
    };
  }
  /**
 * 获取数据
 */
  GetData(url, data, type, fun) {
    var Type = type != "" ? type : "GET"
    wx.request({
      url: url,
      method: Type,
      data: data,
      success: function (res) {
        if (typeof fun == 'function') { fun(res.data) }
      },
      fail: function (error) {
        console.log('获取数据错误', error);
      },
    });
  }
  /**
   * 获取用户信息
   */
  setUserLogin(ReadyCallback){
    var _self = this
    // 登录
    wx.login({
      success: res => {
        getUserInfo(res);
      },
      fail: res => {
        console.log('login++fail::', res);
      }
    })
    //检测当前用户登录态是否有效
    wx.checkSession({
      success: function (e) {
        var UserOpenId = wx.getStorageSync('UserOpenId') ;
        if (UserOpenId) { JSON.parse(UserOpenId);};
      },
      fail: function (e) {
      }
    })
    function getUserInfo(UserOpenId) {
      var UserInfo;
      wx.getUserInfo({
        success: res => {
          if (typeof ReadyCallback == 'function') {
            ReadyCallback(JSON.parse(res.rawData))
          };
        }
      })
    };
  }
}
module.exports = ConfigGlobal