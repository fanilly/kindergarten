// pages/orderHistory/orderHistory.js
import { OLD_TASK_URL } from '../../config.js';
const app = getApp();
Page({

  data: {

  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    wx.request({
      url: OLD_TASK_URL,
      data: {
        userId: app.globalData.userID
      },
      success: res => {
        console.log(res);

      }
    });
  },

  //生命周期函数--监听页面隐藏
  onHide() {

  }
});