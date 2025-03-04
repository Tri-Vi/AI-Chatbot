import {createStore} from 'vuex';

export default createStore({
  state: {
    messages: [],
  },
  mutations: {
    ADD_MESSAGE(state, message){
      state.messages.push(message);
    },
  },  
  actions: {
    addMessage({commit}, message){
      commit('ADD_MESSAGE', message);
    }
  },
  getters: {
    allMessages: (state) => state.messages
  }
});