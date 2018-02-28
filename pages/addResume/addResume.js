// pages/addResume/addResume.js
Page({
  data: {

    quitTime: '请选择', //当前选中的毕业时间
    entryTime: '请选择' //当前选中的毕业时间
  },

  //生命周期函数--监听页面加载
  onLoad(options) {

  },

  //选择毕业时间
  handleQuitTimeChange(e) {
    this.setData({
      quitTime: e.detail.value
    });
  },

  //选择毕业时间
  handleEntryTimeChange(e) {
    this.setData({
      entryTime: e.detail.value
    });
  }

});