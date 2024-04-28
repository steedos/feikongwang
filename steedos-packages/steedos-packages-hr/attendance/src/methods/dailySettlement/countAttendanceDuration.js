module.exports = {
    handler: async function (start, end, rule, workDay) {
        // 正常上班开始时间
        const workStart = this.generateDateTimeByDateAndTime(workDay, rule.work_start)
        // 正常上班结束时间
        const workEnd = this.generateDateTimeByDateAndTime(workDay, rule.work_end)
        // 午休开始时间
        const restStart = this.generateDateTimeByDateAndTime(workDay, rule.rest_start)
        // 午休结束时间
        const restEnd = this.generateDateTimeByDateAndTime(workDay, rule.rest_end)
        var attendanceDuration = 0;
        if (!start && end) {   
            if (end <= restStart) { //下班时间在午休之前
                attendanceDuration = workEnd - end - (restEnd - restStart)
            }
            if (end > restStart && end <= restEnd) { //下班时间在午休之内
                attendanceDuration = workEnd - restEnd
            }
            if (end >= restEnd && end <= workEnd) { //下班时间在午休之后
                attendanceDuration = workEnd - end
            }

        }else if(start && end){
            if(start<=workStart && end<=restStart){ //上班打卡时间在正常上班开始时间之前，下班打卡时间在午休开始时间
                attendanceDuration = end - workStart
            }
            if(start<=workStart && end>=restStart && end<=restEnd){ //上班打卡时间在正常上班开始时间之前,下班打卡时间在午休之内
                attendanceDuration = restStart - workStart
            }
            if(start<=workStart && end>=restEnd && end<=workEnd){ //上班打卡时间在正常上班开始时间之前,下班打卡时间在午休之后
                attendanceDuration = end - workStart-(restEnd-restStart)
            }
            if(start<=workStart && end>=workEnd){ //上班打卡时间在正常上班开始时间之前,下班打卡时间在正常上班结束时间之后
                attendanceDuration = workEnd - workStart-(restEnd-restStart)
            }
        }else if(start && !end){
            attendanceDuration = 0;
        }
        
         attendanceDuration = this.millisecondToMinites(attendanceDuration) //转为分钟
        return attendanceDuration;
    }
}