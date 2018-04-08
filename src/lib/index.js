import VueTable from './table';
const table = {
  install: function(Vue) {
    Vue.component(VueTable.name, VueTable)
  }
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(table)
}
export default table
