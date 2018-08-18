//获取应用实例
const GlobalConfig = require('../../../config');
class Global {
  constructor() {
    var _self = this
  }
  GlobalConfig() {
    return GlobalConfig;
  }
  /**
   * 获取数据内容
   */
  GetData(url, data, type, fun, param) {
    var Type = type != "" ? type : "GET"
    var params = {
      url: url, method: Type, data: data,
      success: function (res) {
        if (typeof fun == 'function') { fun(res.data) }
      },
      fail: function (error) {
        console.log('获取数据错误::', error);
      }
    };
    if (param) {
      param = {}
      param['content-type'] = 'application/json'
      params.header = param;
    };
    wx.request(params);
  }
  /**
 * 格式化时间
 */
  formatSeconds(t) {
    var MM = Math.floor(t / 60);
    var SS = t % 60;
    if (MM < 10) { MM = "0" + MM; }
    if (SS < 10) { SS = "0" + SS; }
    var min = MM + "：" + SS;
    if (MM && SS) { return min.split('.')[0]; } else { return ''; };
  }
}
module.exports = Global