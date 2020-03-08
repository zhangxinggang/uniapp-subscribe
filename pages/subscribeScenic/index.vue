<template>
	<view>
		<cu-custom bgColor="bg-blue" :isBack="false">
			<block slot="backText">返回</block>
			<block slot="content">预约</block>
		</cu-custom>
		<form @submit="saveData">
			<view class="cu-form-group margin-top">
				<view class="title">*游客姓名：</view>
				<input placeholder="请输入" name="RealName" :value="RealName"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">*手机号码</view>
				<input placeholder="请输入" name="MobilePhone" :value="MobilePhone"></input>
				<view class="cu-capsule radius">
					<view class='cu-tag bg-blue '>
						+86
					</view>
					<view class="cu-tag line-blue">
						中国大陆
					</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">*身份证号码</view>
				<input placeholder="请输入" name="IdCardNum" :value="IdCardNum"></input>
			</view>

			<view class="cu-form-group">
				<view class="title">日期选择</view>
				<picker mode="date" :value="date" start="2015-09-01" end="2020-09-01" @change="DateChange">
					<view class="picker">
						{{date}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">时间选择</view>
				<picker mode="time" :value="time" start="09:01" end="21:01" @change="TimeChange">
					<view class="picker">
						{{time}}
					</view>
				</picker>
			</view>
			<radio-group class="block">
				<view class="cu-form-group margin-top yisiyesOrNosPanel" style="display: flex;justify-content: space-between;">
					<view class="yisiyesOrNosTitle">你是否有疑似症状：</view>
					<view class="yisiyesOrNos">
						<radio-group name="yisiradio">
							<label>
								<radio value="1" /><text>是</text>
							</label>
							<label>
								<radio value="0" checked="true" /><text>否</text>
							</label>
						</radio-group>
					</view>
				</view>
			</radio-group>
			<radio-group class="block">
				<view class="cu-form-group margin-top yisiyesOrNosPanel" style="display: flex;justify-content: space-between;">
					<view class="yisiyesOrNosTitle">是否接触过确诊或者疑似病例人员：</view>
					<view class="yisiyesOrNos">
						<radio-group name="jiechuradio">
							<label>
								<radio value="1" /><text>是</text>
							</label>
							<label>
								<radio value="0" checked="true" /><text>否</text>
							</label>
						</radio-group>
					</view>
				</view>
			</radio-group>
			<view class="uni-btn-v submitInfoBtn">
				<button form-type="submit" type="primary">提交</button>
			</view>
		</form>
	</view>
</template>

<script>
	export default {
		onLoad:function(options){
			var ScenicinfoID=options.ScenicinfoID;
			if(!ScenicinfoID){
				console.error('无ScenicinfoID')
				return;
			}
		},
		data() {
			return {
				RealName:'',
				MobilePhone:'',
				IdCardNum:'',
				time: '12:01',
				date: '2018-12-25'
			};
		},
		methods: {
			saveData:function(e){
				console.log(e.detail.value)
				var value=e.detail.value;
				if(!value['RealName']){
					uni.showModal({
						title:'提示',
						content:'请输入姓名！'
					})
				}
				if(!(/^1[3456789]\d{9}$/.test(value['MobilePhone']))){
					uni.showModal({
						title:'提示',
						content:'手机号码输入有误！'
					})
				}
				if(!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/).test(value['IdCardNum'])){
					uni.showModal({
						title:'提示',
						content:'身份证输入有误！'
					})
				}
			},
			TimeChange(e) {
				this.time = e.detail.value
			},
			DateChange(e) {
				this.date = e.detail.value
			}
		}
	}
</script>

<style>
	.yisiyesOrNos label{
		margin-left: 50upx;
	}
	.submitInfoBtn{
		margin-top:100upx
	}
</style>
