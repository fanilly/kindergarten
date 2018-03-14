/**
 * [用户登陆]
 * @param  {[String]}   LOGIN_URL [登陆地址]
 * @param  {Function} fn  [获取用户信息成功的回调]
 * @param  {[Function]}   err [获取用户信息失败的回调]
 * @return {[void]}       [description]
 */
module.exports = (LOGIN_URL, fn, err) => {
  console.log(LOGIN_URL);
  // 调用微信授权弹窗
  wx.login({
    success: res => {
      console.log('-------- 成功获取res.code');
      console.log('-------- 开始向后台换取userID');
      //如果点击授权 向服务器发送res.code 换取userID
      wx.request({
        method: 'GET',
        url: LOGIN_URL,
        data: {
          code: res.code
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          let user = res.data;
          console.log('-------- 成功换取userID');
          console.log('-------- 弹出获取用户信息授权');
          //成功获取user之后获取用户微信信息
          wx.getUserInfo({
            success: res => {
              console.log('-------- 用户点击了确认授权');
              let userInfo = res.userInfo;
              fn(user, userInfo);
            },
            fail() {
              console.log('-------- 用户点击了拒绝');
              err(user);
            }
          });
        }
      });
    }
  });
};