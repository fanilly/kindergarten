// pages/skillCertification/skillCertification.js
import { BASE_URL, CERTIFICATION_URL, GET_CERTIFICATION_URL, USER_INFO_URL } from '../../config.js';
import uploadImg from '../../request/uploadImg.js';
let recordCarCertification;
const app = getApp();
Page({

  data: {
    loaded: false,
    loadData: { //加载模板需要的参数
      type: 2,
      msg: '数据加载中'
    },
    delIndex: -1, //当前显示删除按钮的图片在files数组中的索引
    files: [{
      url: '',
      isNews: true,
      showControl: false
    }, {
      url: '',
      isNews: true,
      showControl: false
    }, {
      url: '',
      isNews: true,
      showControl: false
    }]
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    let webUserInfo = app.globalData.webUserInfo;
    if (webUserInfo.education != 0) {
      console.log('-------- 判定本次为修改车辆认证信息 开始获取历史信息');
      wx.request({
        url: GET_CERTIFICATION_URL,
        data: {
          type: 3,
          userId: app.globalData.userID
        },
        success: res => {
          console.log('-------- 成功获取到历史提交的车辆认证信息 并 渲染至页面');
          console.log(res);
          recordCarCertification = res.data.data[0];
          let files = this.data.files;
          files[0].url = recordCarCertification.data1;
          files[0].thubms = recordCarCertification.data2;
          files[0].isNews = false;
          files[1].url = recordCarCertification.data3;
          files[1].thubms = recordCarCertification.data4;
          files[1].isNews = false;
          files[2].url = recordCarCertification.data5;
          files[2].thubms = recordCarCertification.data6;
          files[2].isNews = false;
          this.setData({
            files,
            loaded: true
          });
        }
      });
    } else {
      this.setData({
        loaded: true
      });
    }
  },

  //显示提示信息
  showMsg(msg) {
    wx.showModal({
      content: msg,
      showCancel: false
    });
  },

  showErr() {
    wx.hideLoading();
    wx.showToast({
      title: '网络异常',
      image: '../../assets/warning.png',
      duration: 1500
    });
  },

  //提交认证
  handleConfirm() {
    let files = this.data.files,
      uploadFiles = [],
      postData = {
        type: 3,
        userId: app.globalData.userID
      };
    if (recordCarCertification) postData.dataId = recordCarCertification.id;
    if (recordCarCertification && files[0].url == recordCarCertification.data1 && files[1].url == recordCarCertification.data3 && files[2].url == recordCarCertification.data5) {
      this.showMsg('信息未发生改变，无需重复上传！');
    } else {
      if (!files[0].url) {
        this.showMsg('请上传行驶证照片');
      } else if (!files[1].url) {
        this.showMsg('请上传车辆头部照片');
      } else if (!files[2].url) {
        this.showMsg('请上传车辆侧面照片（车门方向）');
      } else {
        wx.showLoading({ title: '上传中', mask: true });
        if (files[0].isNews) {
          uploadImg(files[0].url, res => {
            console.log('-------- 开始上传行驶证照片');
            let result = JSON.parse(res.data);
            console.log(result);
            if (result.status == 1) {
              postData.data1 = BASE_URL + result.data.Image;
              postData.data2 = BASE_URL + result.data.Thumbs;
              if (files[1].isNews) {
                console.log('');
                uploadImg(files[1].url, res => {
                  console.log('-------- 开始上传车头照片');
                  let result = JSON.parse(res.data);
                  console.log(result);
                  if (result.status == 1) {
                    postData.data3 = BASE_URL + result.data.Image;
                    postData.data4 = BASE_URL + result.data.Thumbs;
                    if (files[2].isNews) {
                      uploadImg(files[2].url, res => {
                        console.log('-------- 开始上传车侧面照片');
                        let result = JSON.parse(res.data);
                        console.log(result);
                        if (result.status == 1) {
                          postData.data5 = BASE_URL + result.data.Image;
                          postData.data6 = BASE_URL + result.data.Thumbs;

                          this.certification(postData);
                        } else {
                          this.showErr();
                        }
                      });
                    } else {
                      postData.data5 = files[2].url;
                      postData.data6 = files[2].thubms;
                      this.certification(postData);
                    }
                  } else {
                    this.showErr();
                  }
                });
              } else {
                postData.data3 = files[1].url;
                postData.data4 = files[1].thubms;
                if (files[2].isNews) {
                  uploadImg(files[2].url, res => {
                    console.log('-------- 开始上传车侧面照片');
                    let result = JSON.parse(res.data);
                    console.log(result);
                    if (result.status == 1) {
                      postData.data5 = BASE_URL + result.data.Image;
                      postData.data6 = BASE_URL + result.data.Thumbs;
                      this.certification(postData);
                    } else {
                      this.showErr();
                    }
                  });
                } else {
                  postData.data5 = files[2].url;
                  postData.data6 = files[2].thubms;
                  this.certification(postData);
                }
              }
            } else {
              this.showErr();
            }
          });
        } else {
          postData.data1 = files[0].url;
          postData.data2 = files[0].thubms;
          if (files[1].isNews) {
            uploadImg(files[1].url, res => {
              console.log('-------- 开始上传车头照片');
              let result = JSON.parse(res.data);
              console.log(result);
              if (result.status == 1) {
                postData.data3 = BASE_URL + result.data.Image;
                postData.data4 = BASE_URL + result.data.Thumbs;
                if (files[2].isNews) {
                  uploadImg(files[2].url, res => {
                    console.log('-------- 开始上传车侧面照片');
                    let result = JSON.parse(res.data);
                    console.log(result);
                    if (result.status == 1) {
                      postData.data5 = BASE_URL + result.data.Image;
                      postData.data6 = BASE_URL + result.data.Thumbs;

                      this.certification(postData);
                    } else {
                      this.showErr();
                    }
                  });
                } else {
                  postData.data5 = files[2].url;
                  postData.data6 = files[2].thubms;
                  this.certification(postData);
                }
              } else {
                this.showErr();
              }
            });
          } else {
            if (files[2].isNews) {
              uploadImg(files[2].url, res => {
                console.log('-------- 开始上传车侧面照片');
                let result = JSON.parse(res.data);
                console.log(result);
                if (result.status == 1) {
                  postData.data5 = BASE_URL + result.data.Image;
                  postData.data6 = BASE_URL + result.data.Thumbs;
                  this.certification(postData);
                } else {
                  this.showErr();
                }
              });
            } else {
              postData.data5 = files[2].url;
              postData.data6 = files[2].thubms;
              this.certification(postData);
            }
          }
        }
      }
    }

  },

  certification(postData) {
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
              this.showErr();
            }
          });
        } else {
          this.showErr();
        }
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
        files[index].isNews = true;
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
      tempFiles = [];
    files.forEach(function(item) {
      tempFiles.push(item.url);
    });
    wx.previewImage({
      current: e.currentTarget.dataset.index, // 当前显示图片的http链接
      urls: tempFiles // 需要预览的图片http链接列表
    });
  }
});