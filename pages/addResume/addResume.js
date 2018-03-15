// pages/addResume/addResume.js
import { CERTIFICATION_URL, GET_CERTIFICATION_URL, USER_INFO_URL } from '../../config.js';
const app = getApp();
let msgID;
Page({
  data: {
    descLen: 0,
    quitTime: '请选择', //当前选中的毕业时间
    entryTime: '请选择' //当前选中的毕业时间
  },

  //显示提示信息
  showMsg(msg) {
    wx.showModal({
      content: msg,
      showCancel: false
    });
  },

  handleRecordDescLen(e) {
    //记录特长描述的长度
    this.setData({
      descLen: e.detail.value.length
    });
  },


  handleFormSubmit(e) {
    const data = e.detail.value;
    if (!data.corporateName) {
      this.showMsg('请输入公司名称');
    } else if (!data.job) {
      this.showMsg('请输入职位信息');
    } else if (this.data.entryTime == '请选择') {
      this.showMsg('请选择入职时间');
    } else if (this.data.quitTime == '请选择') {
      this.showMsg('请选择离职时间');
    } else if (!data.jobContent) {
      this.showMsg('请输入工作内容');
    } else {
      wx.showLoading({ title: '正在提交', mask: true });
      let temp = this.data,
        postData = {
          type: 2,
          userId: app.globalData.userID,
          data1: data.corporateName,
          data2: data.job,
          data3: temp.entryTime,
          data4: temp.quitTime,
          data5: data.jobContent
        };
      console.log('-------- 开始上传学历信息');
      //如果存在msgID 为修改
      if (msgID) postData.dataId = msgID;
      wx.request({
        method: 'POST',
        url: CERTIFICATION_URL,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: postData,
        success: res => {
          console.log(res);
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
                  image: '../../assets/success.png',
                  duration: 1500
                });
                setTimeout(() => {
                  wx.switchTab({
                    url: '/pages/index/index'
                  });
                }, 1000);
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
  },

  //生命周期函数--监听页面加载
  onLoad(options) {
    if (options.msgID) {
      msgID = options.msgID;
      wx.request({
        url: GET_CERTIFICATION_URL,
        data: {
          type: 2,
          userId: app.globalData.userID,
          dataId: msgID
        },
        success: res => {
          console.log('-------- 成功获取到历史输入履历信息 并 渲染至页面');
          console.log(res);
          let resume = res.data.data[0];
          let values = {
            corporateName: resume.data1,
            job: resume.data2,
            jobContent: resume.data5
          };
          this.setData({
            loaded: true,
            descLen: values.jobContent.length,
            quitTime: resume.data3,
            entryTime: resume.data4,
            values
          });
        }
      });
    } else {
      this.setData({
        loaded: true
      });
    }
  },

  //选择毕业时间
  handleQuitTimeChange(e) {
    this.setData({
      quitTime: e.detail.value
    });
  },

  //选择毕业时间
  handleEntryTimeChange(e) {
    this.setData({
      entryTime: e.detail.value
    });
  }

});