// pages/realNameCertification/realNameCertification.js
import { VER_CODE_URL, BASE_URL, MODIFY_INFO_URL, USER_INFO_URL, BIND_PHONE_URL } from '../../config.js';
import uploadImg from '../../request/uploadImg.js';
const app = getApp();
let timer, //定时器
  phoneNumber, //记录手机号
  roleType, //身份1教练 2 司机
  source; //来源
Page({
  data: {
    imgUrl: '', //头像地址
    being: false,
    time: 90,
    phoneNumber: '',
    userInfo: null,
    curInfo: {
      realName: '',
      IDNumber: '',
      phoneNumber: '',
      desc: ''
    }
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    source = options.source;
    roleType = options.type;
    if (options.source == 'no') {
      this.setData({
        userInfo: app.globalData.userInfo,
        imgUrl: app.globalData.userInfo.avatarUrl
      });
    } else if (options.source == 'yes') {
      let webUserInfo = app.globalData.webUserInfo;
      let curInfo = {
        realName: webUserInfo.trueName,
        IDNumber: webUserInfo.idCode,
        phoneNumber: webUserInfo.phone,
        desc: webUserInfo.desc
      };
      this.setData({
        curInfo: curInfo,
        userInfo: webUserInfo,
        imgUrl: webUserInfo.userPhoto.startsWith('http') ? webUserInfo.userPhoto : BASE_URL + webUserInfo.userPhoto
      });
    }
  },

  //选择图片
  chooseImage(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        let imgUrl = res.tempFilePaths[0];
        wx.showLoading({ title: '上传中', mask: true });
        uploadImg(imgUrl, res => {
          wx.hideLoading();
          let result = JSON.parse(res.data);
          console.log(result);
          if (result.status == 1) {
            // 如果当前本次传输完成的不是最后一张图片 继续下一张
            wx.showToast({
              title: '上传成功',
              image: '../../assets/success.png',
              duration: 1500
            });

            this.setData({
              imgUrl: BASE_URL + result.data.Thumbs
            });
          } else {
            wx.showToast({
              title: '网络异常',
              image: '../../assets/warning.png',
              duration: 1500
            });
          }
        });
        // this.setData({ imgUrl });
      }
    });
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
    const data = e.detail.value;
    console.log('-------- 用户点击了提交按钮');
    if (source == 'no') {
      console.log('-------- 分析该用户为初次提交实名认证信息');
      this.startRelNameCertification(data);
    } else if (source == 'yes') {
      console.log('-------- 分析该用户为修改认证信息');
      if (data.phoneNumber == app.globalData.webUserInfo.phone) {
        if (!data.realName) {
          this.showMsg('请输入真实姓名');
        } else if (!data.IDNumber) {
          this.showMsg('请输入身份证号');
        } else {
          wx.showLoading({ title: '正在提交', mask: true });
          this.submitInfo(data);
        }
      } else {
        this.startRelNameCertification(data);
      }
    }

  },

  startRelNameCertification(data) {
    if (!data.realName) {
      this.showMsg('请输入真实姓名');
    } else if (!data.IDNumber) {
      this.showMsg('请输入身份证号');
    } else if (!data.phoneNumber) {
      this.showMsg('请输入手机号');
    } else if (!data.verificationCode) {
      this.showMsg('请输入短信验证码');
    } else {
      wx.showLoading({ title: '正在提交', mask: true });
      this.bindPhone(data, () => {
        this.submitInfo(data);
      });
    }
  },

  //绑定手机号
  bindPhone(data, fn) {
    console.log('-------- 开始绑定手机号');
    //绑定手机号
    wx.request({
      url: BIND_PHONE_URL,
      data: {
        userId: app.globalData.userID,
        mobile: data.phoneNumber,
        passcode: data.verificationCode
      },
      success: res => {
        console.log(res);
        if (res.data.status * 1 == 1) {
          console.log('-------- 成功绑定手机号');
          if (fn) fn();
        } else {
          wx.showToast({
            title: '验证码不正确',
            image: '../../assets/warning.png',
            duration: 1500
          });
        }
      }
    });
  },

  //提交信息
  submitInfo(data) {
    console.log('-------- 开始上传用户信息');
    wx.request({
      method: 'POST',
      url: MODIFY_INFO_URL,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userID,
        nickName: app.globalData.userInfo.nickName,
        gender: app.globalData.userInfo.gender, //性别
        roleType: roleType, //身份
        avatarUrl: this.data.imgUrl,
        city: app.globalData.userInfo.city,
        idCode: data.IDNumber, //身份证号
        trueName: data.realName, //真实姓名
        desc: data.personalProfile //个人简介
      },
      success: res => {
        if (res.data.status == 1) {
          console.log('-------- 成功上传用户信息,开始更新本地用户信息');
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
              wx.hideLoading();
              console.log('-------- 成功更新本地，该用户已实名认证');
              wx.showToast({
                title: '提交成功',
                image: './assets/success.png',
                duration: 1500
              });
              if (source == 'no') {
                wx.switchTab({
                  url: `/pages/index/index`
                });
              } else if (source == 'yes') {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  });
                }, 600);
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
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '网络异常',
            image: '../../assets/warning.png',
            duration: 1500
          });
        }
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