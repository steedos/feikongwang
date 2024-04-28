/*
 * @Date: 2023-08-10 14:50:32
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-15 11:10:03
 */
const moment = require('moment')
const _ = require('lodash')
module.exports = {
	/**
	 * 根据传入的用户id，和 obj（要查的对象）与工作时间段计算用户的（外出,请假，出差）时间（小时）// 如果obj传入的是请假对象 那么就获取该用户的 请假时长
	 * @param {} userId 用户id
	 * @param {*} workStart 开始（外出，请假，出差）的时间
	 * @param {*} workEnd 结束（外出，请假，出差）时间
	 * @returns  用户（外出，请假，出差）时间（小时）
	 */
	handler: async function (userId, { workStart, workEnd, restStart, restEnd },obj,todayAtt) {
		console.log("userId",userId);
		console.log("上班开始时间",workStart);
		console.log("上班结束时间",workEnd);
		console.log("休息开始时间",restStart);
		console.log("休息结束时间",restEnd);
		console.log("查询对象名",obj);
		console.log("每日考勤的考勤状态",todayAtt.status)
		var outMornings = await broker.call('objectql.find', {
			objectName: obj,
			query: {
				//2023-08-09 09:00  2023-08-10 14:00
				//2023-08-08 10:05  2023-08-11 14:00
				filters: [
					['applicant', '=', userId],
					// ['start_time', '<=', workStart],//0809 9:00 18:00
					// ['end_time', '<=', workEnd],
					['instance_state', '=', 'approved']
				]
			}
		});
		console.log("查询日期中的外出记录",outMornings);
		var outMorningTime = 0;
		var going_out_ref = [];
		var status = todayAtt.status
		if(status==undefined || status == ""){
			status = []
		}
		for(var outMorning of outMornings){
			if(outMorning.start_time<=workStart && outMorning.end_time<=restStart){  //外出开始时间在上班开始时间之前，外出结束时间在午休开始时间之前
				outMorningTime = (outMorning.end_time-workStart)/3600000;
				console.log("外出时间1",outMorningTime);
				going_out_ref.push(outMorning._id);
				if(status.includes('late')){
					status=status.filter(item => item !== "late"); //移除迟到状态
				}
				console.log("考勤状态",status)
				continue;
			}
			if(outMorning.start_time<=workStart && outMorning.end_time>=restStart && outMorning.end_time<=restEnd){  //外出开始时间在上班开始时间之前，外出结束时间在午休时间之内
				outMorningTime = (restStart-workStart)/3600000;
				console.log("外出时间2",outMorningTime);
				going_out_ref.push(outMorning._id);
				if(status.includes('late')){
					status=status.filter(item => item !== "late"); //移除迟到状态
				}
				continue;
			}
			if(outMorning.start_time<=workStart && outMorning.end_time>=restEnd && outMorning.end_time<=workEnd){  //外出开始时间在上班开始时间之前，外出结束时间在午休时间之后
				outMorningTime = ((outMorning.end_time-workStart)-(restEnd-restStart))/3600000;
				console.log("外出时间3",outMorningTime);
				going_out_ref.push(outMorning._id);
				if(status.includes('late')){
					status=status.filter(item => item !== "late"); //移除迟到状态
				}
				continue;
			}
			if(outMorning.start_time<=workStart && outMorning.end_time>=workEnd){  //外出开始时间在上班开始时间之前，外出结束时间在下班之后
				outMorningTime = ((workEnd-workStart)-(restEnd-restStart))/3600000;
				console.log("外出时间4",outMorningTime);
				going_out_ref.push(outMorning._id);
				if(status.includes('late')){
					status=status.filter(item => item !== "late"); //移除迟到状态
				}
				if(status.includes('early')){
					status=status.filter(item => item !== "early"); //移除早退状态
				}
				continue;
			}
			 if(outMorning.start_time>=workStart && outMorning.end_time<=restStart){ //外出开始时间在上班开始时间之后，外出结束时间在午休开始时间之前
				outMorningTime += (outMorning.end_time-outMorning.start_time)/3600000;
				console.log("外出时间5",outMorningTime);
				going_out_ref.push(outMorning._id)
				continue;
			}
			if(outMorning.start_time>=workStart && outMorning.end_time>=restStart && outMorning.end_time<=restEnd){ //外出开始时间在上班开始时间之后，外出结束时间在午休时间之内
				outMorningTime += (restStart - outMorning.start_time)/3600000
				console.log("外出时间6",outMorningTime);
				going_out_ref.push(outMorning._id)
				continue;
			}
			if(outMorning.start_time>=workStart && outMorning.end_time>=restEnd && outMorning.end_time<=workEnd){ //外出开始时间在上班开始时间之后，外出结束时间在午休时间之后
				outMorningTime += ((utMorning.end_time - outMorning.start_time)-(restEnd-restStart))/3600000
				console.log("外出时间7",outMorningTime);
				going_out_ref.push(outMorning._id)
				continue;
			}
			if(outMorning.start_time>=workStart && outMorning.end_time>=workEnd){ //外出开始时间在上班开始时间之后，外出结束时间在下班之后
				outMorningTime += ((workEnd - outMorning.start_time)-(restEnd-restStart))/3600000
				console.log("外出时间8",outMorningTime);
				if(status.includes('early')){
					status=status.filter(item => item !== "early"); //移除早退状态
				}
				going_out_ref.push(outMorning._id)
				continue;
			}
			if(outMorning.start_time>=restStart && outMorning.start_time<=restEnd && outMorning.end_time>=restStart && outMorning.end_time <= restEnd){  //外出开始时间在午休时间之内，外出结束时间在午休时间之内
				outMorningTime +=0 ;
				continue;
			}
			if(outMorning.start_time>=restStart && outMorning.start_time<=restEnd && outMorning.end_time >= restEnd && outMorning.end_time<=workEnd){ //外出开始时间在午休时间之内，外出结束时间在上班时间之内
				outMorningTime+=(outMorning.end_time-restEnd)/3600000
				console.log("外出时间9",outMorningTime);
				going_out_ref.push(outMorning._id)
				continue;
			}
			if(outMorning.start_time>=restStart && outMorning.start_time<=restEnd && outMorning.end_time>=workEnd){ //外出开始时间在午休时间之内，外出结束时间在下班之后
				outMorningTime+=(workEnd-restEnd)/3600000
				console.log("外出时间10",outMorningTime);
				if(status.includes('early')){
					status=status.filter(item => item !== "early"); //移除早退状态
				}
				going_out_ref.push(outMorning._id)
				continue;
			}
			if(outMorning.start_time>=restEnd && outMorning.end_time >= restEnd && outMorning.end_time<=workEnd){ //外出开始时间在午休时间之后，外出结束时间在上班时间之内
				outMorningTime+=(outMorning.end_time-outMorning.start_time)/3600000
				console.log("外出时间11",outMorningTime);
				going_out_ref.push(outMorning._id)
				continue;
			}
			if(outMorning.start_time>=restEnd && outMorning.end_time >= restEnd && outMorning.end_time<=workEnd){ //外出开始时间在午休时间之后，外出结束时间在下班之后
				outMorningTime+=(workEnd-outMorning.start_time)/3600000
				console.log("外出时间12",outMorningTime);
				if(status.includes('early')){
					status=status.filter(item => item !== "early"); //移除早退状态
				}
				going_out_ref.push(outMorning._id)
				continue;
			}
			
		}
		console.log("外出总时间",outMorningTime);
		console.log("外出总记录",going_out_ref);
		console.log("考勤状态",status)
		return {
			time:outMorningTime,
			obj_ref:going_out_ref,
			status:status
		}
		// let going_out_ref = [];//
		// let outMorningTime = 0;
		// if (outMorning.length > 0) {
		// 	// ['start_time', '<=', workStart] // 外出开始时间 小于 上班开始时间，默认外出时间为上班开始时间;
		// 	const { start_time, end_time,autonumber ,_id} = outMorning[0];
		// 	if(!_.isDate(end_time)){
		// 		end_time = new Date(end_time);
		// 	}
		// 	// 如果外出结束时间为午休范围内
		// 	if (end_time > restStart && end_time < restEnd) {
		// 		outMorningTime = restEnd - workStart;
		// 	}else if (end_time > restStart){ // 外出结束时间在上午
		// 		outMorningTime += end_time - workStart;
		// 	}else {
		// 		// 如果外出结束时间在午休结束后，并且在下班结束前
		// 		outMorningTime += restStart - workStart + end_time - restEnd;
		// 	}
		// 	going_out_ref.push(_id)
		// }
		// /**
		// 	当天实际外出时间段：workStart ~ end_time
		// 	当天实际外出小时：上午 workStart到restStart 如果为负数，表示早上没有外出 下午： restEnd 到 end_time
		//  *
		//  */
		// const outAfternoon = await broker.call('objectql.find', {
		// 	objectName: obj,
		// 	query: {
		// 		filters: [
		// 			['applicant', '=', userId],
		// 			['start_time', '>=', workStart],
		// 			['start_time', '<=', workEnd],
		// 			['end_time', '>=', workEnd],
		// 			['instance_state', '=', 'approved']
		// 		]
		// 	}
		// })

		// let outAfternoonTime = 0;
		// if (outAfternoon.length > 0) { // 下午外出,end_time >= workEnd ， 默认为下班结束时间
		// 	const { start_time, end_time,autonumber ,_id} = outAfternoon[0];
		// 	if(!_.isDate(start_time)){
		// 		start_time = new Date(start_time);
		// 	}
		// 	if (start_time < restStart) { // 上午外出
		// 		outAfternoonTime = restStart - start_time + workEnd - restStart;
		// 	} else if (start_time > restStart && start_time < restEnd) { // 午休范围内外出
		// 		outAfternoonTime += workEnd - restEnd;
		// 	} else {
		// 		outAfternoonTime += workEnd - start_time;
		// 	}
		// 	going_out_ref.push(_id)

		// }

		// //2023-08-09 09:00  2023-08-10 14:00   //0809 9:00 18:00
		// const outInWorkTime = await broker.call('objectql.find', {
		// 	objectName: obj,
		// 	query: {
		// 		filters: [
		// 			['applicant', '=', userId],
		// 			['start_time', '>=', workStart],
		// 			['end_time', '<=', workEnd],
		// 			['instance_state', '=', 'approved']
		// 		],
		// 		fields: ['start_time', 'end_time'],
		// 		sort: 'start_time asc'
		// 	}
		// })
		// let outInWorkTimeTime = 0;
		// if (outInWorkTime.length > 0) {
		// 	const { start_time:start_time, end_time:end_time ,autonumber,_id} = outInWorkTime[0];
		// 	if(!_.isDate(start_time)){
		// 		start_time = new Date(start_time);
		// 	}
		// 	if(!_.isDate(end_time)){
		// 		end_time = new Date(end_time);
		// 	}
		// 	// 上午外出，上午回来
		// 	if (start_time <= restStart && end_time <= restStart) {
		// 		outInWorkTimeTime = end_time - start_time;
		// 	}
		// 	// 上午外出，午休回来
		// 	if (start_time <= restStart && (end_time >= restStart && end_time <= restEnd)) {
		// 		outInWorkTimeTime += restStart - start_time;
		// 	}
		// 	// 上午外出，下午回来
		// 	if (start_time <= restStart && end_time >= restEnd) {
		// 		outInWorkTimeTime += end_time - start_time - (restEnd - restStart);// 减去午休时间
		// 	}
		// 	// 午休范围内外出，午休范围内回来
		// 	if (start_time >= restStart && start_time <= restEnd && end_time >= restStart && end_time <= restEnd) {
		// 		outInWorkTimeTime = 0;
		// 	}
		// 	// 下午外出，下午回来
		// 	if (start_time >= restEnd && end_time >= restEnd) {
		// 		outInWorkTimeTime += end_time - start_time;
		// 	}
		// 	going_out_ref.push(_id)

		// }

		// // 考虑跨天的情况  //2023-08-09 09:00 18:00 2023-08-11 14:00   //0809 9:00 18:00
		// const timeRange = await broker.call('objectql.find', {
		// 	objectName: obj,
		// 	query: {
		// 		filters: [
		// 			['applicant', '=', userId],
		// 			['start_time', '>=', workStart],
		// 			['end_time', '>=', workEnd],
		// 			['instance_state', '=', 'approved']
		// 		]
		// 	}
		// })
		// let timeRangeTime = 0;
		// /**
		//  * start_time 到 workEnd
		//  * 上午： start_time 到 restStart  为负
		//  * 下午：start_time 大于 restEnd 开始 start_time 到workEnd 否则就restend 到 workEnd
		//  */
		// if (timeRange.length > 0) { // 跨天
		// 	const { start_time, end_time,autonumber ,_id} = timeRange[0];
		// 	if(!_.isDate(start_time)){
		// 		start_time = new Date(start_time);
		// 	}
		// 	//上班开始之后 午休之前外出
		// 	if (start_time <= restStart) {
		// 		timeRangeTime += restStart - start_time + workEnd - restEnd;
		// 	}
		// 	// 午休范围内外出
		// 	if (start_time >= restStart && start_time <= restEnd) {
		// 		timeRangeTime += workEnd - restEnd;
		// 	}
		// 	// 下午外出
		// 	if (start_time >= restEnd) {
		// 		timeRangeTime += workEnd - start_time;
		// 	}
		// 	going_out_ref.push(_id);
		// }

		// return {
		// 	time:outMorningTime+outAfternoonTime+outInWorkTimeTime+timeRangeTime,
		// 	obj_ref:going_out_ref
		// }
	}
}
