/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 16:20:22
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 16:20:57
 * @FilePath: /steedos-ee-gitlab/steedos-packages-oa/okr/src/methods/caculateProcess.js
 * @Description: 
 */
module.exports = {
    async handler(key_result) {
        if (!key_result) {
            return;
        }
        let krObj = this.getObject('okr_key_results');

        let kr = await krObj.findOne(key_result);
        if (!kr) {
            console.error(`未找到Key Results：${key_result}`);
            return;
        }

        let last_updated_date = new Date();
        last_updated_date.setFullYear(2000, 1, 1)
        let most_recent_progress_made = 0;
        let progress = 0;
        let confidence = "3";

        (await this.getObject('okr_kr_progress').find({ filters: [['key_result', '=', key_result]] })).forEach(function (thisline) {
            //    console.error(`${thisline.update_date}`);
            //    console.error(`${last_updated_date}`);
            if (thisline.update_date > last_updated_date) {
                last_updated_date = thisline.update_date;
                most_recent_progress_made = thisline.current_progress;
                progress = thisline.progress;
                confidence = thisline.confidence;
            }
        });

        let calculated_objective_progress = progress * kr.weight;

        await krObj.directUpdate(key_result, { last_updated_date: last_updated_date, most_recent_progress_made: most_recent_progress_made, progress: progress, confidence: confidence, calculated_objective_progress: calculated_objective_progress });

    }
}

/**
 * async function caculateProcess(key_result) {
 if (!key_result) {
    return;
  }
  const steedosSchema = objectql.getSteedosSchema();
  let krObj = steedosSchema.getObject('okr_key_results');

  let kr = await krObj.findOne(key_result);
  if (!kr) {
    console.error(`未找到Key Results：${key_result}`);
    return;
  }

  let last_updated_date = new Date();
  last_updated_date.setFullYear(2000, 1, 1)
  let most_recent_progress_made  = 0;
  let progress = 0;
  let confidence = "3";

   (await steedosSchema.getObject('okr_kr_progress').find({ filters: [['key_result', '=', key_result]] })).forEach(function (thisline) {
//    console.error(`${thisline.update_date}`);
//    console.error(`${last_updated_date}`);
    if (thisline.update_date > last_updated_date) {
        last_updated_date = thisline.update_date;
        most_recent_progress_made = thisline.current_progress;
        progress = thisline.progress;
        confidence = thisline.confidence;
    }
  });

  let calculated_objective_progress = progress * kr.weight;

  await krObj.directUpdate(key_result, { last_updated_date: last_updated_date , most_recent_progress_made: most_recent_progress_made , progress: progress , confidence: confidence , calculated_objective_progress: calculated_objective_progress }); 

}
 */