import ChAdminTree from './ch-admin-tree.vue'
import ChTreeSelect from './ch-tree-select.vue'
// install function executed by Vue.use()
export function install(Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component('ChAdminTree', ChAdminTree)
  Vue.component('ChTreeSelect', ChTreeSelect)
  if (process.env.NODE_ENV !== 'production') {
    console.warn('%c <ChAdminTree /> <ChTreeSelect /> are installed', 'color: #555')
  }
}

// Create module definition for Vue.use()
const Plugin = {
  install
}

// To auto-install when vue is found
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(Plugin)
}

// To allow use as module (npm/webpack/etc.) export component
export default Plugin
