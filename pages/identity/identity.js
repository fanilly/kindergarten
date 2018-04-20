// pages/identity/identity.js
const app = getApp();
Page({

  data: {
    loadData: { //加载模板需要的参数
      type: 2,
      msg: '身份识别中'
    },
    loaded: false
  },

  handleGoToRealName(e) {
    //type = 1教练   2 司机
    let type = e.currentTarget.dataset.flag;
    wx.redirectTo({
      url: `../realNameCertification/realNameCertification?type=${type}&source=no`
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    //获取信息成功的回调函数
    app.getUserInfoSuccessCallback = res => {
      this.setData({
        loaded: true
      });
    };

    //如果身份验证成功还留来本页面 证明用户为实名认证
    //未实名认证的用户有选择身份的权利
    if (app.globalData.distinguish) {
      this.setData({
        loaded: true
      });
    }

    //如果缓存中已经存在用户的身份信息
    //证明该用户已经提交过实名认证 应跳转至首页
    wx.getStorage({
      key: 'IDENTITY',
      success: res => {
        console.log('-------- 成功从缓存中提取身份信息');
        app.globalData.isRedirect = true;
        wx.switchTab({
          url: `/pages/index/index`
        });
      },
      fail() {
        app.testSwitchTab = () => {
          wx.switchTab({
            url: `/pages/index/index`
          });
        };
      }
    });
  }
});