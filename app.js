//app.js
import login from './request/login.js';
import { LOGIN_URL, USER_INFO_URL } from './config.js';
App({
  loginIn() {
    login(LOGIN_URL, (user, userInfo) => {
      //授权之后
      wx.hideLoading();
    }, (user) => {
      wx.hideLoading();
      console.log('-------- 打开设置引导用户授权');
      //未受援 必须授权
      wx.openSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            this.loginIn(user);
          }
        }
      });
    });
  },
  loginAfter(user) {
    //获取用户信息
    wx.request({
      url: USER_INFO_URL,
      data: {
        userId: user.userId
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        this.globalData.commission = res.data.data;
      }
    });
  },
  onLaunch() {
    // wx.showLoading({ title: '加载中', mask: true });
    console.log('-------- 开始登陆');
    this.loginIn();
  },
  globalData: {
    identity: 1,
    userInfo: {
      nickName: '卮言',
      // avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/ywFvlKF6uhng0HAv4Aa53NHfrxStvT9ftibFCSeOP1zxmLq9iaTVSDgkCdtD3taQIGibibhMl03Xz08EDTy7f4w5rw/0"
      avatarUrl: "../../assets/head.jpg"
    }
  }
});