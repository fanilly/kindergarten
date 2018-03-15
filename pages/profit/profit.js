// pages/profit/profit.js
import { DISABLE_RECHARGE } from '../../config.js';
const app = getApp();
let money;
Page({

  data: {
    webUserInfo: null,
    isRecharge: true, //true 充值 false 提现
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
        
      }
    }
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