// pages/realNameCertification/realNameCertification.js
import { SIGN_UP_ACTIVE_URL, SIGN_UP_PAY_URL } from '../../config.js';
const app = getApp();
Page({
  data: {

  },

  onLoad(options) {
    console.log(options);
    wx.showLoading({ title: '加载中', mask: true });
    if (!options.scene) { //不是扫码进入
      wx.showToast({
        title: '非法进入',
        image: '../../assets/warning.png',
        duration: 1500
      });
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 500);
    } else {
      let getedScene = decodeURIComponent(options.scene);
      // SIGN_UP_ACTIVE_URL
      wx.request({
        url: SIGN_UP_ACTIVE_URL,
        data: {
          activeId: getedScene
        },
        success: res => {
          wx.hideLoading();
          this.setData({
            content: res.data.data
          });
        }
      });
    }
  },

  //显示提示信息
  showMsg(msg) {
    wx.showModal({
      content: msg,
      showCancel: false
    });
  },

  //表单提交
  handleFormSubmit(e) {
    //用户点击提交 验证音信完善度
    const data = e.detail.value;
    if (!data.yourName) {
      this.showMsg('请输入姓名');
    } else if (!data.phone) {
      this.showMsg('请输入您的联系方式');
    } else {
      //信息已完善 友情提醒用户检查信息是否正确
      wx.showModal({
        title: '温馨提示',
        content: '请确认您输入提交信息是否正确！',
        success: function(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '提交中',
              mask: true
            });
            wx.login({
              success: res => {
                let resCode = res.code;
                wx.request({
                  method: 'POST',
                  url: SIGN_UP_PAY_URL,
                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                  data: {
                    fname: data.yourName,
                    phone: data.phone,
                    code: resCode,
                    activeId: 16
                  },
                  success: res => {
                    console.log(res);
                    wx.hideLoading();
                    //此处的res应返回调起支付所需要的参数
                    let result = res.data;
                    wx.requestPayment({
                      timeStamp: result.timeStamp.toString(),
                      nonceStr: result.nonceStr,
                      paySign: result.paySign,
                      package: result.package,
                      signType: 'MD5',
                      success: res => {
                        if (res.errMsg == 'requestPayment:ok') {
                          //支付成功
                          wx.showModal({
                            content: '恭喜您付款成功',
                            showCancel: false
                          });
                        } else {
                          //支付失败
                          wx.showToast({
                            title: '支付失败',
                            image: '../../assets/warning.png',
                            duration: 1500
                          });
                        }

                      },
                      fail: res => {
                        if (res.errMsg == 'requestPayment:fail cancel') {
                          wx.showToast({
                            title: '取消支付',
                            image: '../../assets/warning.png',
                            duration: 1500
                          });
                        }
                      }
                    });
                  },
                  fail: err => {
                    wx.hideLoading();
                    wx.showToast({
                      title: '网络异常',
                      image: '../../assets/warning.png',
                      duration: 1500
                    });
                  }
                });
              }
            });

          }
        }
      });
    }
  }
});