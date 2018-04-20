//app.js
import login from './request/login.js';
import { LOGIN_URL, USER_INFO_URL } from './config.js';
App({
  loginIn() {
    login(LOGIN_URL, (user, userInfo) => {
      console.log(user, userInfo);
      //授权之后
      this.loginAfter(user);
      this.globalData.userID = user.userId;
      this.globalData.userInfo = userInfo;
    }, (user) => {
      console.log('-------- 打开设置引导用户授权');
      this.globalData.userID = user.userId;
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
    wx.showLoading({ title: '获取用户信息', mask: true });
    // 获取用户信息
    console.log('-------- 开始获取用户信息');
    wx.request({
      url: USER_INFO_URL,
      data: {
        userId: user.userId
      },
      success: res => {
        let data = res.data.data;
        this.globalData.webUserInfo = data;
        console.log(data);
        wx.hideLoading();
        if (data.roleType != 0 && !this.globalData.isRedirect) {
          console.log('-------- 成功获取到信息，该用户以实名认证');
          wx.setStorage({
            key: 'IDENTITY',
            data: data.roleType
          });
          if (this.testSwitchTab) this.testSwitchTab();
          // wx.switchTab({
          //   url: `/pages/index/index`
          // });
        } else {
          console.log('-------- 成功获取到信息');
          if (this.getUserInfoSuccessCallback) this.getUserInfoSuccessCallback();
          if (this.getComponentsRequiredInfo) this.getComponentsRequiredInfo();
          this.globalData.distinguish = true;
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: `网络异常`,
          image: './assets/warning.png',
          duration: 1500
        });
      }
    });
  },
  onLaunch(e) {
    if (e.path == 'pages/grab/grab') {

    } else {
      wx.showLoading({ title: '身份识别中', mask: true });
      console.log('-------- 开始登陆');
      this.loginIn();
    }

  },
  globalData: {
    webUserInfo: null, //服务器端的用户信息
    isRedirect: false, //是否已经跳转页面
    distinguish: false, //身份识别 true 已识别
    identity: 1,
    userInfo: null
  }
});