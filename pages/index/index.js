// pages/index/index.js
import { TASK_LIST_URL } from '../../config.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingStatus: 1,
    lists: [],
    startX: '',
    txtStyle: '',
    curIndex: -1
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
  	// console.log(decodeURIComponent(options.scene));
    wx.showLoading({ title: '加载中', mask: true });
    wx.request({
      url: TASK_LIST_URL,
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        console.log(res);
        this.setData({
          lists: res.data.data || [],
          loadingStatus: 2
        });
        wx.hideLoading();
        if (this.data.lists.length <= 0) {
          this.setData({
            loadingStatus: 0
          });
        }
      }
    });
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh(); //停止微信默认下拉刷新动画
    this.setData({
      lists: [],
      loadingStatus: 1,
      curIndex: -1
    });
    wx.request({
      url: TASK_LIST_URL,
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        console.log(res);
        this.setData({
          lists: res.data.data || [],
          loadingStatus: 2
        });
        if (this.data.lists.length <= 0) {
          this.setData({
            loadingStatus: 0
          });
        }
      }
    });
  },

  handleTouchStart(e) {
    console.log(e);
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },

  handleTouchMove(e) {
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = this.data.startX - moveX;
      var txtStyle = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= 500) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + 500 + "px";
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      //更新列表的状态
      this.setData({
        txtStyle,
        curIndex: index
      });
    }
  },

  handleTouchEnd(e) {
    console.log(this.data.lists);
    if (e.changedTouches.length == 1) {

      let curIndex = this.data.curIndex,
        lists = this.data.lists,
        endX = e.changedTouches[0].clientX, //手指移动结束后触摸点位置的X坐标
        disX = this.data.startX - endX; //触摸开始与结束，手指移动的距离
      if (disX > 120) {
        lists.push(lists.splice(curIndex, 1)[0]);
        this.setData({
          lists,
          curIndex: -1,
          txtStyle: ''
        });
        console.log(this.data.lists);
      } else {
        console.log('no');
        this.setData({
          curIndex: -1
        });
      }
    }
  },

  // 生命周期函数--监听页面显示
  onShow() {

  }
});