import { UPLOAD_IMG_URL } from '../config.js';
/**
 * [上传图片]
 * @param  {[Array]} files   [图片临时文件路径]
 * @return {[void]}         [无返回值]
 */
module.exports = (files, callback) => {
  wx.uploadFile({
    url: UPLOAD_IMG_URL,
    filePath: files,
    name: 'test',
    formData: {},
    success: res => {
        if(callback) callback(res);
    },
    fail: err => {
      wx.hideLoading();
      wx.showToast({
        title: '上传失败',
        image: '../../assets/warning.png',
        duration: 1500
      });
    }
  });
};