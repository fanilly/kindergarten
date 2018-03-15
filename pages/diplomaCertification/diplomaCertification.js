// pages/diplomaCertification/diplomaCertification.js
import { CERTIFICATION_URL, GET_CERTIFICATION_URL, USER_INFO_URL } from '../../config.js';
const app = getApp();
let msgID;
Page({
  data: {
    values: {
      school: '',
      major: '',
      desc: ''
    },
    descLen: 0,
    loaded: false,
    loadData: { //加载模板需要的参数
      type: 2,
      msg: '数据加载中'
    },
    diploma: ['大专', '本科', '硕士', '博士', '其它'],
    years: ['应届毕业生', '1年', '2年', '3年', '4年', '5年', '6年', '7年', '8年', '9年', '10年', '10年以上'],
    graduationTime: '请选择', //当前选中的毕业时间
    curDiplomaIndex: -1, //当前选中的最高学历的索引
    curYearIndex: -1 //当前选中的专业从事年限的索引
  },

  handleRecordDescLen(e) {
    //记录特长描述的长度
    this.setData({
      descLen: e.detail.value.length
    });
  },

  //生命周期函数--监听页面加载
  onLoad(options) {
    let webUserInfo = app.globalData.webUserInfo;
    //如果学历认证状态不为零 证明曾传入认证信息 本次为修改
    if (webUserInfo.education != 0) {
      console.log('-------- 判定本次为修改学历认证信息 开始获取历史信息');
      wx.request({
        url: GET_CERTIFICATION_URL,
        data: {
          type: 1,
          userId: app.globalData.userID
        },
        success: res => {
          console.log('-------- 成功获取到历史输入学历信息 并 渲染至页面');
          console.log(res);
          let diploma = res.data.data[0];
          msgID = diploma.id;
          let values = {
            school: diploma.data2,
            major: diploma.data3,
            desc: diploma.data6
          };
          this.setData({
            loaded: true,
            curDiplomaIndex: this.data.diploma.indexOf(diploma.data1),
            curYearIndex: this.data.years.indexOf(diploma.data5),
            graduationTime: diploma.data4,
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
      let temp = this.data,
        postData = {
          type: 1,
          userId: app.globalData.userID,
          data1: temp.diploma[temp.curDiplomaIndex],
          data2: data.school,
          data3: data.major,
          data4: temp.graduationTime,
          data5: temp.years[temp.curYearIndex],
          data6: data.specialty
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
                  wx.navigateBack({
                    delta: 1
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

  //选择专业从事年限
  handleYearsChange(e) {
    this.setData({
      curYearIndex: e.detail.value
    });
  }
});