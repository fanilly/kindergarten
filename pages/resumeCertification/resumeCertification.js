// pages/resumeCertification/resumeCertification.js
Page({
  data: {
    
  },

  //生命周期函数--监听页面加载
  onLoad(options) {

  },

  handleAddResume(){
  	wx.navigateTo({
  		url:'../addResume/addResume'
  	});
  }
});