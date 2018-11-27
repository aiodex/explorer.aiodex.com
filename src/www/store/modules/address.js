import api from "./../../api";


export default {
    state: {
        data: {},
        info: {},
        chart: {
            name: 'Rich List',
            colorByPoint: true,
            data: []
        }
    },
    mutations: {
        ADDRESS_FETCH(state, data) {
            state.data = data;
        },
        ADDRESS_INFO(state, data) {
            state.info = data;
        },
        ADDRESS_TOP100_FETCH(state, data) {

            state.data = data;
            // var sum = 0;
            // var count = 0;
            // console.log(coin);
            // var supply = state.coin.info.supply;



            // var series = [];
            // state.chart.data = [];

            // data.rows.forEach(wallet => {
            //     count++;
            //     wallet.percent = (wallet.bl / supply) * 100
            //     sum += wallet.bl
            //     if (count == 10) {

            //         var percent = (sum / supply) * 100;
            //         // state.chart.top10 = {
            //         //     value: sum,
            //         //     percent: (sum / supply) * 100
            //         // }

            //         ['Top 1-10', state.char.top10.percent],
            //             ['Top 11-50', state.char.top50.percent],
            //             {
            //                 name: 'Top 51-75',
            //                 y: state.char.top75.percent,
            //                 sliced: true,
            //                 selected: true
            //             },
            //             ['Top 76-100', (sum / supply) * 100],
            //             ['Others', state.char.other.percent]

            //         series.push(['Top 1-10', percent]);
            //         sum = 0;
            //     } else if (count == 50) {
            //         var percent = (sum / supply) * 100;
            //         sum = 0;
            //         series.push(['Top 11-50', percent]);

            //     } else if (count == 75) {
            //         var percent = (sum / supply) * 100;
            //         sum = 0;
            //         series.push(['Top 51-75', percent]);
            //     } else if (count == 100) {
            //         var percent = (sum / supply) * 100;
            //         series.push(['Top 76-100', percent]);

            //         var otherValue = supply - (state.chart.top10.value + state.chart.top50.value + state.chart.top75.value + state.chart.top100.value)

            //         percent = (otherValue / supply) * 100;
            //         series.push(['Others', percent]);
            //         sum = 0;
            //         count = 0;
            //     }

            //     state.chart.data = series;
            // });
        }


    },

    getters: {
        address_data: state => state.data,
        address_info: state => state.info       
    },

    actions: {
        ADDRESS_FETCH({ commit }, payload) {
            return api.post("address/fetch", payload).then(({ data }) => {
                commit("ADDRESS_FETCH", data);
                return data;
            });
        },
        // ADDRESS_TOP100_FETCH({ commit }, payload) {
        //     return api.post("/address/fetch", payload).then(( res ) => {
        //         commit("ADDRESS_TOP100_FETCH", res.data);
        //         return res;
        //     });
        // },
        ADDRESS_INFO({ commit }, payload) {
            return api.post("address/info", payload).then(({ data }) => {
                commit("ADDRESS_INFO", data);
                return data;
            });
        },
    }


};