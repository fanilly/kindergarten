// pages/resumeCertification/resumeCertification.js
import { CERTIFICATION_URL, GET_CERTIFICATION_URL } from '../../config.js';
const app = getApp();
Page({
  data: {
    loaded: false,
    lists: [],
    loadData: { //加载模板需要的参数
      type: 1,
      msg: '数据加载中'
    }
  },

  handleGoEdit(e) {
    let msgID = e.currentTarget.dataset.msgid;
    wx.navigateTo({
      url: `../addResume/addResume?msgID=${msgID}`
    });
  },

  //生命周期函数--监听页面加载
  onLoad(options) {
    let webUserInfo = app.globalData.webUserInfo;
    console.log(1);
    if (webUserInfo.qualification != 0) {
      wx.request({
        url: GET_CERTIFICATION_URL,
        data: {
          type: 2,
          userId: app.globalData.userID
        },
        success: res => {
          console.log(res);
          this.setData({
            loaded: true,
            lists: res.data.data
          });
        }
      });
    } else {
      wx.navigateTo({
        url: '../addResume/addResume'
      });
    }
  },

  handleAddResume() {
    wx.navigateTo({
      url: '../addResume/addResume'
    });
  }
});