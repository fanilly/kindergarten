// pages/index/index.js
import { TASK_LIST_URL } from '../../config.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingStatus: 1,
    lists: []
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    wx.showLoading({ title: '加载中', mask: true });
    wx.request({
      url: TASK_LIST_URL,
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        console.log(res);
        this.setData({
          lists: res.data.data || []
        });
        wx.hideLoading();
        if (this.data.lists.length <= 0) {
          this.setData({
            loadingStatus: 0
          });
        }
      }
    });
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh(); //停止微信默认下拉刷新动画
    this.setData({
      lists: [],
      loadingStatus: 1
    });
    wx.request({
      url: TASK_LIST_URL,
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        console.log(res);
        this.setData({
          lists: res.data.data || []
        });
        if (this.data.lists.length <= 0) {
          this.setData({
            loadingStatus: 0
          });
        }
      }
    });
  },

  // 生命周期函数--监听页面显示
  onShow() {

  }
});