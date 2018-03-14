// pages/diplomaCertification/diplomaCertification.js
import { CERTIFICATION_URL } from '../../config.js';
const app = getApp();
Page({
  data: {
    diploma: ['大专', '本科', '硕士', '博士', '其它'],
    years: ['应届毕业生', '1年', '2年', '3年', '4年', '5年', '6年', '7年', '8年', '9年', '10年', '10年以上'],
    graduationTime: '请选择', //当前选中的毕业时间
    curDiplomaIndex: -1, //当前选中的最高学历的索引
    curYearIndex: -1 //当前选中的专业从事年限的索引
  },

  //生命周期函数--监听页面加载
  onLoad(options) {

  },

  //选择最高学历
  handleDiplomaChange(e) {
    this.setData({
      curDiplomaIndex: e.detail.value
    });
  },

  //选择毕业时间
  handleDateChange(e) {
    this.setData({
      graduationTime: e.detail.value
    });
  },

  //显示提示信息
  showMsg(msg) {
    wx.showModal({
      content: msg,
      showCancel: false
    });
  },

  handleFormSubmit(e) {
    console.log(e);
    const data = e.detail.value;
    if (this.data.curDiplomaIndex == 11) {
      this.showMsg('请选择毕业时间');
    } else if (!data.school) {
      this.showMsg('请填写毕业院校');
    } else if (!data.major) {
      this.showMsg('请填写所学专业');
    } else if (this.data.graduationTime == '请选择') {
      this.showMsg('请选择毕业时间');
    } else if (this.data.curYearIndex == -1) {
      this.showMsg('请选择专业从事年限');
    } else {
      wx.showLoading({ title: '正在提交', mask: true });
      let temp = this.data;
      wx.request({
        method: 'POST',
        url: CERTIFICATION_URL,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          type: 1,
          userId: app.globalData.userID,
          data1: temp.diploma[data.curDiplomaIndex],
          data2: data.school,
          data3: data.major,
          data4: temp.graduationTime,
          data5: temp.years[data.curYearIndex],
          data6: data.specialty
        },
        success: res => {
          console.log(res);
          // if (res.data.status == 1) {
          //   console.log('-------- 成功上传用户信息,开始更新本地用户信息');
          //   wx.request({
          //     url: USER_INFO_URL,
          //     data: {
          //       userId: app.globalData.userID
          //     },
          //     success: res => {
          //       let datas = res.data.data;
          //       app.globalData.webUserInfo = datas;
          //       wx.setStorage({
          //         key: 'IDENTITY',
          //         data: datas.roleType
          //       });
          //       wx.hideLoading();
          //       console.log('-------- 成功更新本地，该用户已实名认证');
          //       wx.showToast({
          //         title: '提交成功',
          //         image: './assets/success.png',
          //         duration: 1500
          //       });
          //       setTimeout(() => {
          //         wx.navigateBack({
          //           delta: 1
          //         });
          //       }, 600);
          //     },
          //     fail: err => {
          //       wx.hideLoading();
          //       wx.showToast({
          //         title: `网络异常`,
          //         image: './assets/warning.png',
          //         duration: 1500
          //       });
          //     }
          //   });
          // } else {
          //   wx.hideLoading();
          //   wx.showToast({
          //     title: '网络异常',
          //     image: '../../assets/warning.png',
          //     duration: 1500
          //   });
          // }
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

  //选择专业从事年限
  handleYearsChange(e) {
    this.setData({
      curYearIndex: e.detail.value
    });
  }
});