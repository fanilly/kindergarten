// pages/profit/profit.js
Page({

  data: {
    isRecharge:true, //true 充值 false 提现
    mask: {
      opacity: 0,
      display: 'none'
    },
    returnDeposit: {
      translateY: 'translateY(-1000px)',
      opacity: 1
    }
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {

  },

  //点击确定
  handleConfirm(){
    if(this.data.isRecharge){ //充值

    }else{ //提现

    }
  },

  //充值提现
  handleRechargeOrWithdrawals(e) {
    this.showPopup();
    if (e.currentTarget.dataset.rel == 'recharge') { // 充值
      this.setData({
        isRecharge: true
      });
    } else { //提现
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