// components/theader/theader.js
import { DISABLE_RECHARGE } from '../../config.js';
const app = getApp();
Component({
  properties: {

  },
  data: {
    DISABLE_RECHARGE: DISABLE_RECHARGE,
    userInfo: app.globalData.userInfo
  },
  attached() {
    this.setData({
      webUserInfo: app.globalData.webUserInfo
    });
  },
  methods: {
    handleGoToDeposit() {
      wx.navigateTo({
        url: '../deposit/deposit'
      });
    }
  }
});