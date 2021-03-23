## ch-tree-in-select
```
import ChTreeInSelect from 'vue-tree-in-select'
import 'vue-tree-in-select/index.css'
Vue.use(ChTreeInSelect)

```
#### Vue components  
- `<ChAdminTree />`   props
```
  lazy: Boolean,
  load: Function,
  showCheckbox: {
    type: Boolean
  },
  treeData: {
    type: Array,
    required: !0
  }
```
- `<ChTreeSelect />`   props
```javascript
  lazy: Boolean,
  load: Function,
  showCheckbox: Boolean,
  value: { // v-model
    required: true,
    default: null
  },
  valKey: {
    type: String,
    default: () => 'id'
  },
  labelKey: {
    type: String,
    default: () => 'label'
  },
  treeData: {
    type: Array,
    default: () => []
  }
```
