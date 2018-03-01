const app = getApp();
Component({
  properties:{

  },
  data:{
  	userInfo:app.globalData.userInfo
  },
  methods:{
  	handleGoToDeposit(){
  		wx.navigateTo({
  			url:'../deposit/deposit'
  		});
  	}
  }
});