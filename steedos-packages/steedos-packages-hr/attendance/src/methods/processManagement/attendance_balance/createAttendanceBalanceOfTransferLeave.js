// 创建关于调休假的假期余额
module.exports = {
    handler: async function (workOvertimeTrip,leavetypeId,year,working_hour) {
        let balanceDoc = {
            "staff":workOvertimeTrip.staff,
            "company":workOvertimeTrip.company,
            "department":workOvertimeTrip.department,
            "leave_type":leavetypeId,
            "leave_year":year,
            "leave_days":workOvertimeTrip.hours/working_hour,
            "leave_used_days":0,
            "freeze_days":0,
            "leave_remain_days":workOvertimeTrip.hours/working_hour,
            "owner":workOvertimeTrip.staff,
            "created_by":workOvertimeTrip.staff,
            "created":new Date(),
            "modified":new Date(),
            "modified_by":workOvertimeTrip.staff,
            "space":workOvertimeTrip.space
        }
        console.log("创建假期余额，balanceDoc",balanceDoc)
          await this.broker.call("objectql.insert", {
            objectName: "attendance_balance",
            doc:balanceDoc
        });
    }
}
