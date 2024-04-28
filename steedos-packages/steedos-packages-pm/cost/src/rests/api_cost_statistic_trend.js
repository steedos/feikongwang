
const fetch = require('node-fetch');
const moment = require('moment')

module.exports = {
    rest: {
        method: 'GET',
        fullPath: '/api/cost/statistic/trend'
    },
    params: {
        datetime: { type: 'string', optional: true },
        owner: { type: 'string', optional: true }
    },
    async handler(ctx) {
        const config = {
            "tooltip": {
                "trigger": "axis"
            },
            "xAxis": {
                "type": "category",
                "data": [
                    // "2022/01",
                    // "2022/02",
                    // "2022/03",
                    // "2022/04",
                    // "2022/05",
                    // "2022/06",
                    // "2022/07"
                ],
                "boundaryGap": false
            },
            "yAxis": {
                "type": "value"
            },
            "toolbox": {
                "feature": {
                    "saveAsImage": {}
                }
            },
            "series": [
                // {
                //     // "data": [
                //     //     20,
                //     //     132,
                //     //     101,
                //     //     134,
                //     //     90,
                //     //     230,
                //     //     210
                //     // ],
                //     "type": "line",
                //     "smooth": true,
                //     "name": "对公付款"
                // },
                {
                    "name": "日常",
                    "type": "line",
                    "smooth": true,
                    // "data": [
                    //     220,
                    //     82,
                    //     91,
                    //     234,
                    //     190,
                    //     330,
                    //     310
                    // ]
                },
                {
                    "name": "个人借款",
                    "type": "line",
                    // "data": [
                    //     320,
                    //     132,
                    //     301,
                    //     334,
                    //     390,
                    //     30,
                    //     880
                    // ],
                    "smooth": true
                },
                {
                    "name": "差旅",
                    "type": "line",
                    "smooth": true,
                    // "data": [
                    //     150,
                    //     332,
                    //     601,
                    //     154,
                    //     10,
                    //     330,
                    //     410
                    // ]
                }
            ],
            "title": {
                "text": ""
            },
            "legend": {
                "data": [
                    // "对公付款",
                    "日常",
                    "个人借款",
                    "差旅"
                ]
            },
            "grid": {
                "left": "3%",
                "right": "4%",
                "bottom": "3%",
                "containLabel": true
            }
        };

        const datetimes = ctx.params.datetime && ctx.params.datetime.split(",") || [];
        const owner = ctx.params.owner;
        if (!datetimes.length) {
            return {
                "status": 0,
                "msg": '',
                "data": config
            }
        }

        let start = datetimes[0];
        let end = datetimes[1];

        const requestData = {
            parameters: {
                owner,
                datetime: { start: start, end: end }
            }
        };

        let mStart = moment(start);
        let mEnd = moment(end);
        let xAxisData = [];
        while (mStart.toDate().getTime() < mEnd.toDate().getTime()) {
            xAxisData.push(mStart.format('YYYY-MM'));
            mStart.add(1, "M");
        }
        let endFormat = mEnd.format('YYYY-MM');
        if (xAxisData[xAxisData.length - 1] !== endFormat) {
            xAxisData.push(endFormat);
        }

        config.xAxis.data = xAxisData;

        const userSession = ctx.meta.user;
        const spaceId = userSession.spaceId;
        const authToken = userSession.authToken;
        const authorization = "Bearer " + spaceId + "," + authToken;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': authorization
        };

        const rootURL = process.env.ROOT_URL;

        // 借款核销应付
        // const trendLoanReimburseUrl = "/service/api/~packages-@steedos/service-charts/queries/cost_trend_loan_reimburse/results";
        // const trendLoanReimburseRes = await fetch(rootURL + trendLoanReimburseUrl, {
        //     method: 'post',
        //     body: JSON.stringify(requestData),
        //     headers: headers
        // });
        // const trendLoanReimburseResult = await trendLoanReimburseRes.json();

        // const trendLoanReimburseRows = trendLoanReimburseResult.query_result.data.rows;
        // const trendLoanReimburseData = xAxisData.map(function(item){
        //     let currentRow = trendLoanReimburseRows.find(function(row){
        //         return row._id === item;
        //     });
        //     return currentRow && currentRow.amount || 0;;
        // });

        // config.series[0].data = trendLoanReimburseData;

        // 对公付款每月合计
        // const trendFinancePaymentUrl = "/service/api/~packages-@steedos/service-charts/queries/cost_trend_finance_payment/results";
        // const trendFinancePaymentRes = await fetch(rootURL + trendFinancePaymentUrl, {
        //     method: 'post',
        //     body: JSON.stringify(requestData),
        //     headers: headers
        // });
        // const trendFinancePaymentResult = await trendFinancePaymentRes.json();

        // const trendFinancePaymentRows = trendFinancePaymentResult.query_result.data.rows;
        // const trendFinancePaymentData = xAxisData.map(function(item){
        //     let currentRow = trendFinancePaymentRows.find(function(row){
        //         return row._id === item;
        //     });
        //     return currentRow && currentRow.amount || 0;;
        // });
        // // console.log('0==>',trendFinancePaymentData)
        // config.series[0].data = trendFinancePaymentData;

        // 日常
        const trendDailyExpenseReimburseUrl = "/service/api/~packages-@steedos/service-charts/queries/cost_trend_daily_expense_reimburse/results";

        const trendDailyExpenseReimburseRes = await fetch(rootURL + trendDailyExpenseReimburseUrl, {
            method: 'post',
            body: JSON.stringify(requestData),
            headers: headers
        });

        const trendDailyExpenseReimburseResult = await trendDailyExpenseReimburseRes.json();

        const trendDailyExpenseReimburseRows = trendDailyExpenseReimburseResult.query_result.data.rows;
        const trendDailyExpenseReimburseData = xAxisData.map(function (item) {
            let currentRow = trendDailyExpenseReimburseRows.find(function (row) {
                return row._id === item;
            });
            return currentRow && currentRow.amount || 0;;
        });

        config.series[0].data = trendDailyExpenseReimburseData;

        // 个人借款
        const trendPersonalLoanUrl = "/service/api/~packages-@steedos/service-charts/queries/cost_trend_personal_loan/results";

        const trendPersonalLoanRes = await fetch(rootURL + trendPersonalLoanUrl, {
            method: 'post',
            body: JSON.stringify(requestData),
            headers: headers
        });
        const trendPersonalLoanResult = await trendPersonalLoanRes.json();


        const trendPersonalLoanRows = trendPersonalLoanResult.query_result.data.rows;
        const trendPersonalLoanData = xAxisData.map(function (item) {
            let currentRow = trendPersonalLoanRows.find(function (row) {
                return row._id === item;
            });
            return currentRow && currentRow.amount || 0;;
        });

        config.series[1].data = trendPersonalLoanData;

        // 差旅
        const trendOutExpenseReimburseUrl = "/service/api/~packages-@steedos/service-charts/queries/cost_trend_out_expense_reimburse/results";

        const trendOutExpenseReimburseRes = await fetch(rootURL + trendOutExpenseReimburseUrl, {
            method: 'post',
            body: JSON.stringify(requestData),
            headers: headers
        });
        const trendOutExpenseReimburseResult = await trendOutExpenseReimburseRes.json();


        const trendOutExpenseReimburseRows = trendOutExpenseReimburseResult.query_result.data.rows;
        const trendOutExpenseReimburseData = xAxisData.map(function (item) {
            let currentRow = trendOutExpenseReimburseRows.find(function (row) {
                return row._id === item;
            });
            return currentRow && currentRow.amount || 0;;
        });

        config.series[2].data = trendOutExpenseReimburseData;


        return {
            "status": 0,
            "msg": '',
            "data": config
        }
    }
}