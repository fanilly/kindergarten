/**
 * @Author:      allenAugustine
 * @Email:       iallenaugustine@gmail.com  -  misterji0708@qq.com
 * @DateTime:    2018-03-13 17:08:42
 * @Description: 小程序配置文件
 */

const HOST = 'tzn.honghuseo.cn',
  API = `https://${HOST}/index.php/api`,
  SIGN_UP = `https://${HOST}/index.php/baoming`,
  CONFIG = {

    //禁用押金
    DISABLE_DEPOSIT: true,

    //禁用充值
    DISABLE_RECHARGE: true,

    //资源根路径
    BASE_URL: `https://${HOST}/`,

    // 登录地址，用于建立会话
    LOGIN_URL: `${API}/user/get_openid`,

    //获取验证码
    VER_CODE_URL: `${API}/user/get_yzm`,

    //上传照片
    UPLOAD_IMG_URL: `${API}/base/uploadGoodsPic`,

    //获取用户信息
    USER_INFO_URL: `${API}/user/user_info`,

    //修改用户信息
    MODIFY_INFO_URL: `${API}/user/modify_info`,

    //认证信息
    CERTIFICATION_URL: `${API}/user/certification`,

    //认证信息
    GET_CERTIFICATION_URL: `${API}/user/getCertification`,

    //绑定手机号
    BIND_PHONE_URL: `${API}/user/mobile`,

    //获取活动列表
    TASK_LIST_URL: `${API}/task/activeList`,

    //获取活动详情
    TASK_INFO_URL: `${API}/task/activeInfo`,

    //抢单
    TASK_GO_URL: `${API}/task/GO`,

    //日历
    CALENDAR_URL: `${API}/task/calendar`,

    //流水列表
    CASH_LIST_URL: `${API}/user/cashList`,

    //提现
    CASH_URL: `${API}/user/cash`,

    //历史任务列表
    OLD_TASK_URL: `${API}/task/oldTask`,

    //某活动下的人物列表
    TASK_URL: `${API}/task/taskList`,

    //报名页面活动详情
    SIGN_UP_ACTIVE_URL: `${SIGN_UP}/index/index`,

    //报名页面活动支付
    SIGN_UP_PAY_URL: `${SIGN_UP}/index/pay`

  };

module.exports = CONFIG;