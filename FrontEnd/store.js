import { createStore } from 'vuex'

export default createStore({
  state: {
    userCredentials: null
  },
  mutations: {
    setUserCredentials(state, credentials) {
      state.userCredentials = credentials
    },
    clearUserCredentials(state) {
      state.userCredentials = null
    }
  }
})
