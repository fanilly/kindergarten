// pages/authorization/authorization.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false
  },

  authorizationSuccess() {
    app.loginIn();
    wx.redirectTo({
      url: '../identity/identity'
    });
  },

  onLoad(options) {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          this.authorizationSuccess();
        } else {
          this.setData({
            showModal: true
          });
        }
      }
    });
  },

  onGotUserInfo(e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      this.authorizationSuccess();
    }
  }
});