// pages/orderHistory/orderHistory.js
import { OLD_TASK_URL } from '../../config.js';
const app = getApp();
Page({

  data: {
    webUserInfo: app.globalData.webUserInfo,
    loadingStatus: 1,
    lists: []
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({
      webUserInfo: app.globalData.webUserInfo
    });
    wx.request({
      url: OLD_TASK_URL,
      data: {
        userId: app.globalData.userID
      },
      success: res => {
        console.log(res);
        if (!res.data.data || res.data.data.length <= 0) {
          this.setData({
            loadingStatus: 0,
            lists: []
          });
        } else {
          this.setData({
            lists: res.data.data,
            loadingStatus: 2
          });
        }
      }
    });
  },

  //生命周期函数--监听页面隐藏
  onHide() {

  }
});