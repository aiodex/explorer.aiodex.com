import api from "./../../api";

export default {
    state: {
        data:{},
        info:{
            img:'https://i.imgur.com/EY7TUtz.png',
            name:'Aiodex Explorer'
        }
    },
    mutations: {
        COIN_FETCH(state, data) {
            state.data = data;
        },
        COIN_INFO(state, data) {
            state.info = data;
        },  
        
    },

    getters: {
        coin_data: state => state.data,
        coin_info: state => state.info        
    },

    actions: {
        COIN_FETCH({ commit }, payload) {
            return api.post("coin/fetch", payload).then(({ data}) => {
                
                commit("COIN_FETCH", data);
            });
        },
        COIN_INFO({ commit }, payload) {
            return api.post("coin/info", payload).then(({ data}) => {
                commit("COIN_INFO", data);
                return data;
            });
        },
    }

        
};