// pages/profit/profit.js
import { DISABLE_RECHARGE, CASH_LIST_URL, CASH_URL } from '../../config.js';
const app = getApp();
let money;
Page({

  data: {
    webUserInfo: null,
    loadingStatus: 1,
    isRecharge: true, //true 充值 false 提现
    lists: [],
    mask: {
      opacity: 0,
      display: 'none'
    },
    returnDeposit: {
      translateY: 'translateY(-1000px)',
      opacity: 1
    }
  },

  handleRecordMoeny(e) {
    money = e.detail.value;
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({
      webUserInfo: app.globalData.webUserInfo
    });

    wx.request({
      url: CASH_LIST_URL,
      data: {
        userId: app.globalData.userID
      },
      success: res => {
        console.log(res);
        if (!res.data.data || res.data.data.length <= 0) {
          this.setData({
            loadingStatus: 0,
            lists: []
          });
        } else {
          this.setData({
            lists: res.data.data,
            loadingStatus: 2
          });
        }
      }
    });

  },

  //点击确定
  handleConfirm() {
    if (this.data.isRecharge) { //充值

    } else { //提现
      if (money <= 0) {
        wx.showModal({
          content: '提现金额必须大于零',
          showCancel: false
        });
      } else if (money * 1 > this.data.webUserInfo.commission * 1) {
        wx.showModal({
          content: '余额不足',
          showCancel: false
        });
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '提现需要收取1%手续费',
          confirmText:'继续提现',
          cancelText:'取消',
          success: (res) => {
            if (res.confirm) {
              this.withdrawCash();
            }
          }
        });
      }
    }
  },

  //提现
  withdrawCash() {
    wx.showLoading({ title: '提交中', mask: true });
    wx.request({
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      url: CASH_URL,
      data: {
        userId: app.globalData.userID,
        money: money
      },
      success: res => {
        wx.hideLoading();
        console.log(app.globalData.userID, money);
        if (res.data.status == 1) {
          wx.showModal({
            content: '恭喜你提现成功，提现金额将在24小时之内发放至您的账户',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                wx.switchTab({
                  url: '../me/me'
                });
              }
            }
          });
          app.globalData.webUserInfo.commission = app.globalData.webUserInfo.commission * 1 - money * 1;
        } else {
          wx.showToast({
            title: '提现失败',
            image: '../../assets/warning.png',
            duration: 1500
          });
        }
      },
      fail() {
        wx.showToast({
          title: '网络异常',
          image: '../../assets/warning.png',
          duration: 1500
        });
      }
    });
  },

  //充值提现
  handleRechargeOrWithdrawals(e) {
    if (e.currentTarget.dataset.rel == 'recharge') { // 充值
      if (DISABLE_RECHARGE) {
        wx.showModal({
          content: '此功能暂未开放',
          showCancel: false
        });
      } else {
        this.showPopup();
        this.setData({
          isRecharge: true
        });
      }
    } else { //提现
      this.showPopup();
      this.setData({
        isRecharge: false
      });
    }
  },

  //显示弹窗
  showPopup() {
    let mask = this.data.mask,
      returnDeposit = this.data.returnDeposit;
    mask.display = 'block';
    this.setData({ mask });
    mask.opacity = 1;
    returnDeposit.translateY = 'translateY(0)';
    returnDeposit.opacity = 1;
    this.setData({ mask, returnDeposit });
  },

  //隐藏弹窗
  hidePopup() {
    let mask = this.data.mask,
      returnDeposit = this.data.returnDeposit;
    mask.opacity = 0;
    returnDeposit.opacity = 0;
    this.setData({ mask, returnDeposit });
    setTimeout(() => {
      mask.display = 'none';
      returnDeposit.translateY = 'translateY(-1000px)';
      this.setData({ mask, returnDeposit });
    }, 500);
  },

  //关闭弹窗
  handleClosePopup() {
    this.hidePopup();
  }
});