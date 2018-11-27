import api from "./../../api";

export default {
    state: {
        data: {},
        info: {}
    },
    mutations: {
        MN_FETCH(state, data) {
            state.data = data;
        },
        MN_INFO(state, data) {
            state.info = data;
        },

    },

    getters: {
        mn_data: state => state.data,
        mn_info: state => state.info
    },

    actions: {
        MN_FETCH({ commit }, payload) {
            return api.post("mn/fetch", payload).then(({ data }) => {
                commit("MN_FETCH", data);
            });
        },
        MN_INFO({ commit }, payload) {
            return api.post("mn/info", payload).then(({ data }) => {
                commit("MN_INFO", data);
                return data;
            });
        },
    }


};