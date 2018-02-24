Page({

  data: {
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    curYear: 0, //当前年份
    curMonth: 0, //当前月份
    hasEmptyGrid: false,
    showPicker: false
  },

  //生命周期函数--监听页面加载
  onLoad() {
    let date = new Date(),
      curYear = date.getFullYear(),
      curMonth = date.getMonth() + 1;

    this.calculateEmptyGrids(curYear, curMonth);
    this.calculateDays(curYear, curMonth);
    this.setData({ curYear, curMonth });
  },
  //获取当天
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  //获取第一天是星期几
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
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
  calculateDays(year, month) {
    let days = [];

    const thisMonthDays = this.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({
        day: i,
        choosed: false
      });
    }

    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const curYear = this.data.curYear;
    const curMonth = this.data.curMonth;
    if (handle === 'prev') {
      let newMonth = curMonth - 1;
      let newYear = curYear;
      if (newMonth < 1) {
        newYear = curYear - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        curYear: newYear,
        curMonth: newMonth
      });

    } else {
      let newMonth = curMonth + 1;
      let newYear = curYear;
      if (newMonth > 12) {
        newYear = curYear + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        curYear: newYear,
        curMonth: newMonth
      });
    }
  },

  tapDayItem(e) {
    const idx = e.currentTarget.dataset.idx;
    const days = this.data.days;
    days[idx].choosed = !days[idx].choosed;
    this.setData({
      days,
    });
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