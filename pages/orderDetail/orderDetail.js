// pages/orderDetail/orderDetail.js
import { TASK_INFO_URL, TASK_GO_URL, TASK_URL } from '../../config.js';
let activeId;
const app = getApp();
Page({
  data: {
    webUserInfo: null,
    curChooseIndex: -1,
    datas: null,
    loaded: false,
    taskComm:'',
    loadData: { //加载模板需要的参数
      type: 1,
      msg: '数据加载中'
    }
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    activeId = options.activeId;
    console.log(activeId);

    //匹配身份
    let webUserInfo = app.globalData.webUserInfo,
      roleName, //身份
      roleLevel = webUserInfo.roleLevel * 1;
    if (webUserInfo.roleType == 1) {
      switch (roleLevel) {
        case 1:
          roleName = '一星教练';
          break;
        case 2:
          roleName = '二星教练';
          break;
        case 3:
          roleName = '三星教练';
          break;
        case 4:
          roleName = '四星教练';
          break;
        case 5:
          roleName = '五星教练';
          break;
        default:
          roleName = '..';
          break;
      }
    } else if (webUserInfo.roleType == 2) {
      roleName = '司机';
    }
    this.setData({ webUserInfo });

    wx.request({
      url: TASK_INFO_URL,
      data: {
        activeId: activeId
      },
      success: res => {
        console.log(res);
        let datas = res.data.data,
          curChooseIndex = -1;
        if (!datas.roleList) datas.roleList = [];
        for (let i = 0; i < datas.roleList.length; i++) {
          if (datas.roleList[i].roleName == roleName) {
            curChooseIndex = i;
            break;
          }
        }
        this.setData({
          loaded: true,
          datas,
          curChooseIndex,
          taskComm:datas.roleList[curChooseIndex].taskComm
        });
      },
      fail: err => {
        wx.showToast({
          title: '网络异常',
          image: '../../assets/warning.png',
          duration: 1500
        });
      }
    });
  },

  handleChoose(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      curChooseIndex: index,
      taskComm:this.data.datas.roleList[index].taskComm
    });
  },

  //点击确认抢单
  handleConfirmGrab() {
    //如果是教练需实名认证通过方可抢单
    //如果是司机 需实名认证+技能认证+车辆认证皆通过
    const webUserInfo = app.globalData.webUserInfo;
    if (webUserInfo.roleType == 1) { //教练
      if (webUserInfo.veracity != 2) {
        wx.showModal({
          content: '实名认证未完成（实名认证完成后方可抢单）',
          showCancel: false
        });
      } else if (this.data.curChooseIndex == -1) {
        wx.showModal({
          content: '点击人员配置，选择完对应身份才能抢单呦',
          showCancel: false
        });
      } else {
        this.startGrab();
      }
    } else if (webUserInfo.roleType == 2) { //司机
      if (webUserInfo.veracity != 2) {
        wx.showModal({
          content: '实名认证未完成（实名认证、技能认证、车辆认证都完成后方可抢单）',
          showCancel: false
        });
      } else if (webUserInfo.qualification != 2) {
        wx.showModal({
          content: '车辆认证未完成（实名认证、技能认证、车辆认证都完成后方可抢单）',
          showCancel: false
        });
      } else if (webUserInfo.education != 2) {
        wx.showModal({
          content: '技能认证未完成（实名认证、技能认证、车辆认证都完成后方可抢单）',
          showCancel: false
        });
      } else {
        this.startGrab();
      }
    }

  },

  startGrab() {
    wx.showLoading({ title: '抢单中' });
    wx.request({
      url: TASK_GO_URL,
      data: {
        userId: app.globalData.userID,
        activeId: activeId,
        roleName: this.data.datas.roleList[this.data.curChooseIndex].roleName
      },
      success: res => {
        console.log(activeId, app.globalData.userID, this.data.datas.roleList[this.data.curChooseIndex].roleName);
        console.log(res);
        let goRes = res;
        wx.hideLoading();
        wx.showModal({
          content: res.data.msg,
          showCancel: false,
          success: res => {
            if (res.confirm && goRes.data.msg == '抢单成功') {
              app.globalData.webUserInfo.taskNum = app.globalData.webUserInfo.taskNum * 1 + 1;
              wx.switchTab({
                url: '../calendar/calendar'
              });
            }
          }
        });
      },
      fail: err => {
        wx.showToast({
          title: '网络异常',
          image: '../../assets/warning.png',
          duration: 1500
        });
      }
    });
  }

});