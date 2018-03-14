import { DISABLE_RECHARGE } from '../../config.js';
const app = getApp();
Component({
  properties: {

  },
  data: {
    webUserInfo: null,
    DISABLE_RECHARGE: DISABLE_RECHARGE,
    IDENTITY: '',
    lv: '..'
  },
  attached() {
    wx.getStorage({
      key: 'IDENTITY',
      success: res => {
        console.log(res.data);
        this.setData({
          IDENTITY: res.data
        });
      }
    });
    if (app.globalData.webUserInfo) {
      this.updatePageData();
    } else {
      app.getComponentsRequiredInfo = res => {
        this.updatePageData();
      };
    }
  },
  methods: {
    handleGoToDeposit() {
      wx.navigateTo({
        url: '../deposit/deposit'
      });
    },
    updatePageData() {
      let webUserInfo = app.globalData.webUserInfo,
        lv, roleLevel = webUserInfo.roleLevel * 1;
      switch (roleLevel) {
        case 0:
          lv = '五';
          break;
        case 1:
          lv = '四';
          break;
        case 2:
          lv = '三';
          break;
        case 3:
          lv = '二';
          break;
        case 4:
          lv = '一';
          break;
        default:
          lv = '..';
          break;
      }
      this.setData({
        webUserInfo,
        lv,
        IDENTITY: webUserInfo.roleType
      });
    }
  }
});