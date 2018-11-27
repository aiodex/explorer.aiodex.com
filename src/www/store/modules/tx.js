import api from "./../../api";

export default {
    state: {
        data:{},
        info:{}
    },
    mutations: {
        TX_FETCH(state, data) {
            state.data = data;
        },
        TX_INFO(state, data) {
            state.info = data;
        },  
        
    },

    getters: {
        tx_data: state => state.data,
        tx_info: state => state.info        
    },

    actions: {
        TX_FETCH({ commit }, payload) {
            return api.post("tx/fetch", payload).then(({ data}) => {
                commit("TX_FETCH", data);
            });
        },
        TX_INFO({ commit }, payload) {
            return api.post("tx/info", payload).then(({ data}) => {
                commit("TX_INFO", data);
                return data;
            });
        },

        TRANSACTION_FETCH({commit} , payload) {
            return api.post("transaction/fetch", payload).then(({ data }) => {
                commit("TX_FETCH", data);
            })
        },
    }

        
};