<script>
	import Vue from 'vue'
	export default {
		globalData:{
			userInfo:{}
		},
		onLaunch: function() {
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif       
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
			if(!uni.getUpdateManager){
				this.globalData.platform="h5";
				return;
			}
		},
		onShow: function() {
			let userInfo=uni.getStorageSync("userInfo");
			if(userInfo && userInfo.UserOID){
				getApp().globalData.userInfo=userInfo;
				return
			}
			let pageUrl=location.href.split('#')[1];
			if(pageUrl!="pages/authorize/authorize" && pageUrl!="pages/index/index" && pageUrl!="/"){
				uni.redirectTo({
					url:"/pages/authorize/authorize"
				})
			}
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "components/colorui/main.css";
	@import "components/colorui/icon.css";
</style>
