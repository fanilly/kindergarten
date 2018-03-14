// pages/addResume/addResume.js
Page({
  data: {
    quitTime: '请选择', //当前选中的毕业时间
    entryTime: '请选择' //当前选中的毕业时间
  },

  //显示提示信息
  showMsg(msg) {
    wx.showModal({
      content: msg,
      showCancel: false
    });
  },


  handleFormSubmit(e) {
    const data = e.detail.value;
    if (!data.corporateName) {
      this.showMsg('请输入公司名称');
    } else if (!data.job) {
      this.showMsg('请输入职位信息');
    } else if (this.data.entryTime == '请选择') {
      this.showMsg('请选择入职时间');
    } else if (this.data.quitTime == '请选择') {
      this.showMsg('请选择离职时间');
    } else if (!data.jobContent) {
      this.showMsg('请输入工作内容');
    } else {

    }
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