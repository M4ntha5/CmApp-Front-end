export default function({ $axios, store, route, redirect }) {
  $axios.onRequest((config) => {
    config.headers.common['Authorization'] = 'Bearer ' + store.state.auth.token
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if(code == 401) {
      window.location.href = `${process.env.serverBaseUrl}/login`
    }
  })
}
