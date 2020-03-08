<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		created() {
			location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+
			"wxbba57d512720cd37"
			+"&redirect_uri="+
			"https%3A%2F%2Fwww.ningshanlvyou.com%2Fsubscribe%2Findex.html"
			+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
		}
	}
</script>

<style>

</style>
