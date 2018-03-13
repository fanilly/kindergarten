// pages/skillCertification/skillCertification.js
Page({

  data: {
    delIndex: -1, //当前显示删除按钮的图片在files数组中的索引
    files: [{
      url: '',
      isNews: false,
      showControl: false
    }, {
      url: '',
      isNews: false,
      showControl: false
    }]
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {

  },
  //长按选择删除图片
  handleShowDelImage(e) {
    this.setData({
      delIndex: e.currentTarget.id
    });
  },

  //选择图片
  chooseImage(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        let index = e.currentTarget.dataset.index;
        let files = this.data.files;
        files[index].url = res.tempFilePaths[0];
        this.setData({ files });
      }
    });
  },

  //长按图片显示操作按钮
  handleShowControl(e) {
    let index = e.currentTarget.dataset.index;
    let files = this.data.files;
    files[index].showControl = true;
    this.setData({ files });
  },

  //点击删除按钮下的遮罩层 隐藏删除按钮
  handleHideDelImage(e) {
    let index = e.currentTarget.dataset.index;
    let files = this.data.files;
    files[index].showControl = false;
    this.setData({ files });
  },

  //点击按钮删除图标
  handleDelImage(e) {
    let index = e.currentTarget.dataset.index;
    let files = this.data.files;
    files[index].url = '';
    files[index].showControl = false;
    this.setData({ files });
  },

  //预览图片
  previewImage(e) {
    let files = this.data.files,
      tempFiles = [],
      baseUrl = this.data.baseUrl;
    files.forEach(function(item) {
      tempFiles.push(item.isNews ? item.url : baseUrl + item.url);
    });
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: tempFiles // 需要预览的图片http链接列表
    });
  }
});