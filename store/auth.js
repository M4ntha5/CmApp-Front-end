import Cookies from 'js-cookie'

const state = () => ({
  token: null,
  user: null,
})

const mutations = {
  setUser(state, value) {
    state.user = value
  },
  setToken(state, token) {
    state.token = token
  },
}

const getters = {
  getUser(state) {
    return state.user
  },
}

const actions = {
  setUser({ commit }, value) {
    commit('setUser', value)
  },
  setToken({ commit }, value) {
    commit('setToken', value)
  },
  logout({ commit }) {
    Cookies.remove('token', { domain: process.env.COOKIE_DOMAIN })
    commit('setToken', null)
    commit('setUser', null)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}