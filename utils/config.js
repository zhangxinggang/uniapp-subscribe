let productUrl="https://www.ningshanlvyou.com";
let baseUrl="http://127.0.0.1";
if(process.env.NODE_ENV === 'development'){  
    baseUrl+="/api"; 
}else{  
    baseUrl=productUrl;  
}
let urlJson={
	"wxConfig":"/LNBiz/servers/background/weixin/gzh/wxConfig", 
	"getUserinfo":"/LNBiz/servers/background/weixin/gzh/getUserinfo", //获取用户信息
	"myReserverRecords":"/NSBiz/subscribe/reserver/myReserverRecords",
	"loadScenics":"/NSBiz/subscribe/scenic/loadScenics",
	"loadScenicTime":"/NSBiz/subscribe/scenic/loadScenicTime",
	"saveReserverRecord":"/NSBiz/subscribe/reserver/saveReserverRecord",
	"delMyReserverRecord":"/NSBiz/subscribe/reserver/delMyReserverRecord",
	"saveScenicRecord":"/NSBiz/subscribe/scenic/saveScenicRecord",
	"delSubscribe":"/NSBiz/subscribe/scenic/delSubscribe"
}
uni.$serverURI=baseUrl;
uni.decorateRequest=function(json){
	let data=json.data?json.data:{};
	data.LNDeviceType="app";
	if(getApp().globalData.userInfo && getApp().globalData.userInfo.access_token){
		data.access_token=getApp().globalData.userInfo.access_token;
	}
	if(json.showLoad){
		uni.showLoading({title:"加载中...",mask:true});
	}
	uni.request({
		url:baseUrl+urlJson[json.url],
		method:json.method?json.method:"GET",
		data:data,
		success: (res) => {
			let result=res.data;
			if(Object.prototype.toString.call(result)=='[object Object]'){
				if(result.status==1){
					json.success(result.data)
				}else if(json.fail){
					json.fail(result.msg)
				}
			}else{
				console.error('接口'+urlJson[json.url]+'返回错误:\n'+result)
			}
		},
		fail: (err) => {
			if(json.fail){
				json.fail(err);
			}
		},
		complete: ()=>{
			if(json.complete){
				json.complete();
			}
			if(json.showLoad){
				uni.hideLoading();
			}
		}
	});
}