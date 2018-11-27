import api from "./../../api";

export default {
    state: {
        data: {},
        info: {}
    },
    mutations: {
        BLOCK_FETCH(state, data) {
            state.data = data;
        },
        BLOCK_INFO(state, data) {
            state.info = data;
        },

    },

    getters: {
        block_data: state => state.data,
        block_info: state => state.info
    },

    actions: {
        BLOCK_FETCH({ commit }, payload) {
            return api.post("block/fetch", payload).then(({ data }) => {
                commit("BLOCK_FETCH", data);
            });
        },
        BLOCK_INFO({ commit }, payload) {
            return api.post("block/info", payload).then(({ data }) => {
                commit("BLOCK_INFO", data);
                return data;
            });
        },
    }


};