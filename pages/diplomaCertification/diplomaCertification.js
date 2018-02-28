// pages/diplomaCertification/diplomaCertification.js
Page({
  data: {
    diploma: ['大专', '本科', '硕士', '博士', '其它'],
    years: ['应届毕业生', '1年', '2年', '3年', '4年', '5年', '6年', '7年', '8年', '9年', '10年', '10年以上'],
    graduationTime: '请选择',//当前选中的毕业时间
    curDiplomaIndex: -1, //当前选中的最高学历的索引
    curYearIndex: -1 //当前选中的专业从事年限的索引
  },

  //生命周期函数--监听页面加载
  onLoad(options) {

  },

  //选择最高学历
  handleDiplomaChange(e) {
    this.setData({
      curDiplomaIndex: e.detail.value
    });
  },

  //选择毕业时间
  handleDateChange(e) {
    this.setData({
      graduationTime: e.detail.value
    });
  },

  //选择专业从事年限
  handleYearsChange(e) {
    this.setData({
      curYearIndex: e.detail.value
    });
  }
});