// pages/orderHistoryDetail/orderHistoryDetail.js
import { TASK_INFO_URL } from '../../config.js';
let activeId;
const app = getApp();
Page({
  data: {
    webUserInfo: null,
    datas: null,
    loaded: false,
    loadData: { //加载模板需要的参数
      type: 1,
      msg: '数据加载中'
    }
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    activeId = options.taskID;
    this.setData({
      webUserInfo: app.globalData.webUserInfo
    });
    wx.request({
      url: TASK_INFO_URL,
      data: {
        activeId: activeId,
        userId:app.globalData.userID
      },
      success: res => {
        console.log(res);
        this.setData({
          loaded: true,
          datas: res.data.data || []
        });
      },
      fail: err => {
        wx.showToast({
          title: '网络异常',
          image: '../../assets/warning.png',
          duration: 1500
        });
      }
    });
  }

});