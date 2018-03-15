// pages/rank/rank.js
const app = getApp();
Page({

  data: {
    webUserInfo: null
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({
      webUserInfo: app.globalData.webUserInfo
    });
  }
});