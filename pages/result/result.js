// pages/result/result.js
Page({

  data: {
    flag: true //true 支付成功
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({
      flag: options.flag == 1 ? true : false
    });
  }
});