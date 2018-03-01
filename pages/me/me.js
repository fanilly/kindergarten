// pages/me/me.js
const app = getApp();
Page({

  data: {
    userInfo: app.globalData.userInfo,
    btns: [{
      name: '已接单',
      value: 99,
      url: '../orderHistory/orderHistory'
    }, {
      name: '教练等级',
      value: 'III',
      url: '../rank/rank'
    }, {
      name: '诚信度',
      value: 66,
      url: '../credit/credit'
    }, {
      name: '收益',
      value: 99785,
      url: '/'
    }]
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {

  },

  //生命周期函数--监听页面初次渲染完成
  onReady: function() {

  },

  // 生命周期函数--监听页面显示
  onShow: function() {

  },

  //跳转至押金页面
  handleGoToDeposit() {
    wx.navigateTo({
      url: '../deposit/deposit'
    });
  }
});