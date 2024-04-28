module.exports = {
    /**
     * 
     * @param {string} key_result 
     */
    async handler(objective_id) {
        if (!objective_id) {
            return;
        }
        let oObj = this.getObject('okr_objective');

        let obj = await oObj.findOne(objective_id);
        if (!obj) {
            console.error(`未找到Objective：${objective_id}`);
            return;
        }

        let o_progress = 0;
        (await this.getObject('okr_key_results').find({ filters: [['objective', '=', objective_id]] })).forEach(function (thisline) {
            o_progress += thisline.calculated_objective_progress;
        });
        await oObj.directUpdate(objective_id, { progress: o_progress });
    }
}

/**
 * async function caculateObjective(objective_id) {
 if (!objective_id) {
    return;
  }
  const steedosSchema = objectql.getSteedosSchema();
  let oObj = steedosSchema.getObject('okr_objective');

  let obj = await oObj.findOne(objective_id);
  if (!obj) {
    console.error(`未找到Objective：${objective_id}`);
    return;
  }

  let o_progress = 0;
  (await steedosSchema.getObject('okr_key_results').find({ filters: [['objective', '=', objective_id]] })).forEach(function (thisline) {
    o_progress += thisline.calculated_objective_progress ;
  });
  await oObj.directUpdate(objective_id, {  progress: o_progress }); 

}
 */