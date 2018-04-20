// pages/me/me.js
import { DISABLE_RECHARGE, USER_INFO_URL } from '../../config.js';
const app = getApp();
Page({

  data: {
    webUserInfo: null, //用户信息
    DISABLE_RECHARGE: DISABLE_RECHARGE, //是否禁用押金选项
    IDENTITY: '', //用户身份
    lv: '..', //用户等级
    surplus: 0, //剩余几项未认证
    btns: [],
    cerBtns: []
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {

  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    wx.showNavigationBarLoading();
    wx.request({
      url: USER_INFO_URL,
      data: {
        userId: app.globalData.userID
      },
      success: res => {
        let datas = res.data.data;
        app.globalData.webUserInfo = datas;
        wx.setStorage({
          key: 'IDENTITY',
          data: datas.roleType
        });
        this.setData({
          webUserInfo: datas
        });
        wx.hideLoading();
        this.verfInfo();
        console.log('-------- 成功更新本地，该用户已实名认证');
        wx.hideNavigationBarLoading();
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: `网络异常`,
          image: '../../assets/warning.png',
          duration: 1500
        });
      }
    });
  },

  // 生命周期函数--监听页面显示
  onShow() {
    this.verfInfo();
  },

  verfInfo() {
    let lv = '..',
      btns,
      cerBtns,
      surplus = 0, //剩余几项未认证
      webUserInfo = app.globalData.webUserInfo,
      roleLevel = webUserInfo.roleLevel * 1;
    if (webUserInfo.roleType == 1) { //教练
      //匹配等级
      switch (roleLevel) {
        case 1:
          lv = 'I';
          break;
        case 2:
          lv = 'II';
          break;
        case 3:
          lv = 'III';
          break;
        case 4:
          lv = 'IV';
          break;
        case 5:
          lv = 'V';
          break;
        default:
          lv = '..';
          break;
      }
      btns = [{
        name: '已接单',
        value: webUserInfo.taskNum,
        url: '../orderHistory/orderHistory'
      }, {
        name: '教练等级',
        value: lv,
        url: '../rank/rank'
      }, {
        name: '诚信度',
        value: webUserInfo.honest,
        url: '../credit/credit'
      }, {
        name: '收益',
        value: webUserInfo.commission,
        url: '../profit/profit'
      }];
      cerBtns = [{
        name: '实名认证',
        status: webUserInfo.veracity == 0 ? '未认证' : webUserInfo.veracity == 1 ? '审核中' : webUserInfo.veracity == 2 ? '已完成' : '未通过',
        icon: `../../assets/me_icon03${webUserInfo.veracity == 2 ?'_c':''}.png`,
        url: '../realNameCertification/realNameCertification?type=1&source=yes'
      }, {
        name: '学历认证',
        status: webUserInfo.education == 0 ? '未认证' : webUserInfo.education == 1 ? '审核中' : webUserInfo.education == 2 ? '已完成' : '未通过',
        icon: `../../assets/me_icon04${webUserInfo.education == 2 ?'_c':''}.png`,
        url: '../diplomaCertification/diplomaCertification'
      }, {
        name: '履历认证',
        status: webUserInfo.qualification == 0 ? '未认证' : webUserInfo.qualification == 1 ? '审核中' : webUserInfo.qualification == 2 ? '已完成' : '未通过',
        icon: `../../assets/me_icon05${webUserInfo.qualification == 2 ?'_c':''}.png`,
        url: '../resumeCertification/resumeCertification'
      }];
      cerBtns.forEach(item => {
        if (item.status == '未认证' || item.status == '审核中' || item.status == '未通过') surplus++;
      });
    } else if (webUserInfo.roleType == 2) { //司机
      btns = [{
        name: '已接单',
        value: webUserInfo.taskNum,
        url: '../orderHistory/orderHistory'
      }, {
        name: '诚信度',
        value: webUserInfo.honest,
        url: '../credit/credit'
      }, {
        name: '收益',
        value: webUserInfo.commission,
        url: '../profit/profit'
      }];
      cerBtns = [{
        name: '实名认证',
        status: webUserInfo.veracity == 0 ? '未认证' : webUserInfo.veracity == 1 ? '审核中' : webUserInfo.veracity == 2 ? '已完成' : '未通过',
        icon: `../../assets/me_icon03${webUserInfo.veracity == 2 ?'_c':''}.png`,
        url: '../realNameCertification/realNameCertification?type=1&source=yes'
      }, {
        name: '车辆认证',
        status: webUserInfo.education == 0 ? '未认证' : webUserInfo.education == 1 ? '审核中' : webUserInfo.education == 2 ? '已完成' : '未通过',
        icon: `../../assets/me_icon08${webUserInfo.education == 2 ?'_c':''}.png`,
        url: '../carCertification/carCertification'
      }, {
        name: '技能认证',
        status: webUserInfo.qualification == 0 ? '未认证' : webUserInfo.qualification == 1 ? '审核中' : webUserInfo.qualification == 2 ? '已完成' : '未通过',
        icon: `../../assets/me_icon09${webUserInfo.qualification == 2 ?'_c':''}.png`,
        url: '../skillCertification/skillCertification'
      }];
      cerBtns.forEach(item => {
        if (item.status == '未认证' || item.status == '审核中' || item.status == '未通过') surplus++;
      });
    }
    this.setData({
      webUserInfo,
      lv,
      btns,
      cerBtns,
      surplus,
      IDENTITY: webUserInfo.roleType
    });
  },

  //跳转至押金页面
  handleGoToDeposit() {
    wx.navigateTo({
      url: '../deposit/deposit'
    });
  }
});