import { wrapFunctional } from './utils'

export { default as Logo } from '../..\\components\\Logo.vue'
export { default as VuetifyLogo } from '../..\\components\\VuetifyLogo.vue'
export { default as CarsCarCard } from '../..\\components\\cars\\car-card.vue'
export { default as CarsList } from '../..\\components\\cars\\list.vue'

export const LazyLogo = import('../..\\components\\Logo.vue' /* webpackChunkName: "components/logo" */).then(c => wrapFunctional(c.default || c))
export const LazyVuetifyLogo = import('../..\\components\\VuetifyLogo.vue' /* webpackChunkName: "components/vuetify-logo" */).then(c => wrapFunctional(c.default || c))
export const LazyCarsCarCard = import('../..\\components\\cars\\car-card.vue' /* webpackChunkName: "components/cars-car-card" */).then(c => wrapFunctional(c.default || c))
export const LazyCarsList = import('../..\\components\\cars\\list.vue' /* webpackChunkName: "components/cars-list" */).then(c => wrapFunctional(c.default || c))
