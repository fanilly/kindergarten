import { CALENDAR_URL } from '../../config.js';
const app = getApp();
let tasks = [];
Page({

  data: {
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    nowYear: 0, //今天哪年
    nowMonth: 0, //今天哪月
    nowDay: 0, //今天哪天
    curYear: 0, //当前选择年份
    curMonth: 0, //当前选择月份
    hasEmptyGrid: false,
    showPicker: false
  },

  //生命周期函数--监听页面加载
  onLoad() {
    let date = new Date(),
      curYear = date.getFullYear(),
      curMonth = date.getMonth() + 1,
      today = date.getDate();
    console.log(curMonth);

    this.setData({
      curYear,
      curMonth,
      nowYear: curYear,
      nowMonth: curMonth,
      nowDay: today
    });

    this.renderTaskCalendar(curYear, curMonth);

  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    wx.showNavigationBarLoading();
    this.renderTaskCalendar(this.data.curYear, this.data.curMonth);
  },

  renderTaskCalendar(year, month) {
    wx.showLoading({ title: '加载中', mask: true });
    tasks = [];
    wx.request({
      url: CALENDAR_URL,
      data: {
        userId: app.globalData.userID,
        month: `${year}-${month}`
      },
      success: res => {
        console.log(res);
        tasks = res.data.data || [];

        this.calculateEmptyGrids(year, month);
        this.calculateDays(year, month);

        this.setData({
          curYear: year,
          curMonth: month
        });
        wx.hideNavigationBarLoading();
        wx.hideLoading();
      }
    });
  },

  //获取当天
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },

  //获取第一天是星期几
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },

  //计算当月一日之前需要空几格
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },

  //计算当月的天数
  calculateDays(year, month) {
    let days = [],
      tempTask = [];

    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let j = 0; j < tasks.length; j++) {
      let activeDays = parseInt(tasks[j].activeDays),
        activeTime = parseInt(tasks[j].activeTime.substr(-2));
      for (let i = 0; i < activeDays; i++) {
        tempTask.push({
          days: activeTime + i,
          id: tasks[j].activeId,
          status: tasks[j].taskStatus
        });
      }
    }

    console.log(tempTask);

    for (let i = 1; i <= thisMonthDays; i++) {
      let item = {
        day: i,
        choosed: false
      };
      for (let j = 0; j < tempTask.length; j++) {
        if (i == tempTask[j].days) {
          item.id = tempTask[j].id;
          item.status = tempTask[j].status;
          break;
        }
      }
      days.push(item);
    }

    this.setData({ days });
  },

  //月份切换
  handleSwitchMonth(e) {
    let newMonth, newYear,
      handle = e.currentTarget.dataset.handle, //标识 若为prev 上一月
      curYear = this.data.curYear,
      curMonth = this.data.curMonth;

    if (handle === 'prev') { //上一月
      newMonth = curMonth - 1;
      newYear = curYear;

      if (newMonth < 1) {
        newYear = curYear - 1;
        newMonth = 12;
      }

      //--------------------------------------
      this.renderTaskCalendar(newYear, newMonth);
    } else { //下一月
      newMonth = curMonth + 1;
      newYear = curYear;

      if (newMonth > 12) {
        newYear = curYear + 1;
        newMonth = 1;
      }

      this.renderTaskCalendar(newYear, newMonth);
    }
  },

  //点击某一天
  handleTapDayItem(e) {
    console.log(this.data);
    console.log(e);
    let taskID = e.currentTarget.dataset.id;
    if (taskID) {
      wx.navigateTo({
        url: `../orderHistoryDetail/orderHistoryDetail?taskID=${taskID}`
      });
    }
  },

  //使用日历选择器选择
  handleDateChange(e) {
    let curChooseDate = e.detail.value;
    curChooseDate = curChooseDate.split('-');

    let curYear = curChooseDate[0] * 1,
      curMonth = curChooseDate[1] * 1;

    this.calculateEmptyGrids(curYear, curMonth);
    this.calculateDays(curYear, curMonth);

    this.setData({ showPicker: false, curYear, curMonth });
  }
});