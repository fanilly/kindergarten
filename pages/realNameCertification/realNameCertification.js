// pages/realNameCertification/realNameCertification.js
import { VER_CODE_URL } from '../../config.js';
const app = getApp();
let timer, //定时器
  phoneNumber; //记录手机号
Page({
  data: {
    being: false,
    time: 90,
    phoneNumber: '',
    userInfo: app.globalData.userInfo
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {

  },

  //记录手机号
  recordPhoneNumber(e) {
    phoneNumber = e.detail.value;
  },

  //显示提示信息
  showMsg(msg) {
    wx.showModal({
      content: msg,
      showCancel: false
    });
  },

  //绑定倒计时事件
  handleGetVerf() {
    console.log('-------- 用户点击了获取验证码按钮');
    let self = this;
    if (!this.data.being) {
      //验证手机号码是否正确
      if (!(/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(phoneNumber))) {
        this.showMsg('请输入正确的手机号');
      } else {
        //显示倒计时
        this.setData({
          being: true
        });
        console.log('-------- 开始发送获取验证码请求');
        // 发送获取验证码请求
        wx.request({
          url: VER_CODE_URL,
          data: {
            mobile: phoneNumber
          },
          success: res => {
            console.log('-------- 成功获取验证码');
            console.log(res);
          }
        });

        //开始倒计时
        timer = setInterval(function() {
          let tempTime = self.data.time;
          if (tempTime == 0) {
            //倒计时结束
            clearInterval(timer);
            self.setData({
              being: false
            });
            return;
          }
          self.setData({
            time: tempTime - 1
          });
        }, 1000);
      }
    }
  },

  //表单提交
  handleFormSubmit(e) {
    console.log(e);
    console.log('-------- 用户点击了提交按钮');
    const data = e.detail.value;
    if (!data.realName) {
      this.showMsg('请输入真实姓名');
    } else if (!data.IDNumber) {
      this.showMsg('请输入身份证号');
    } else if (!data.phoneNumber) {
      this.showMsg('请输入手机号');
    } else if (!data.verificationCode) {
      this.showMsg('请输入短信验证码');
    } else {

    }
  }
});