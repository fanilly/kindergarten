// pages/deposit/deposit.js
Page({

  data: {
    mask: {
      opacity: 0,
      display: 'none'
    },
    returnDeposit: {
      translateY: 'translateY(-1000px)',
      opacity: 1
    },
    deposit: true //true代表已缴押金
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {

  },

  //支付押金或退还押金
  handlePaymentOrReturn() {
    if (this.data.deposit) { //弹出退还押金窗口
      this.showPopup();
    }
  },

  test(e) {
    console.log(e);
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
    }, 600);
  },

  //关闭弹窗
  handleClosePopup() {
    this.hidePopup();
  }
});