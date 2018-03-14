// pages/index/index.js
import { TASK_LIST_URL } from '../../config.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[]
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    wx.request({
      url: TASK_LIST_URL,
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        console.log(res);
        this.setData({
          lists:res.data.data || []
        });
      },
      fail: err => {

      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  // 用户点击右上角分享
  onShareAppMessage() {

  }
});