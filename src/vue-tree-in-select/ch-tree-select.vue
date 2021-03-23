<template>
  <div ref="selectRef" class="ch_select" @click="isFocus = true">
    <div class="ch-input ch-input--suffix" :class="{ 'is-focus': isFocus }">
      <div class="ch-input__inner" :class="{ 'has-val': value !== undefined }">
        <div class="ch-content">
          {{ placeholder }}
        </div>
        <span class="ch-input__suffix"></span>
      </div>
      <input type="hidden" readonly="readonly" v-model="_value" />
    </div>
    <SelectTree
      v-show="isFocus"
      :treeEvents="treeEvents"
      class="fix_select"
      :treeData="treeData"
      :valKey="valKey"
      inSelect
    />
  </div>
</template>

<script>
import TreeEvents from './tree-events'
import SelectTree from './ch-admin-tree.vue'

export default {
  inheritAttrs: false,
  name: 'ChSelect',
  components: { SelectTree },
  props: {
    lazy: Boolean,
    load: Function,
    showCheckbox: Boolean,
    value: {
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
  },
  computed: {
    _value: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  },
  data() {
    return {
      treeEvents: new TreeEvents(),
      isFocus: false,
      placeholder: '请选择'
    }
  },
  methods: {
    onListen({ target }) {
      let inner = false
      while (target && target.tagName !== 'HTML') {
        if (target.parentNode === this.$refs.selectRef) {
          inner = true
          target = null
        } else {
          target = target.parentNode
        }
      }
      if (!inner) {
        this.isFocus = false
      }
    }
  },
  created() {
    window.addEventListener('click', this.onListen)
    this.treeEvents.subscrible((item) => {
      this._value = item[this.valKey]
      this.placeholder = item[this.labelKey]
      this.isFocus = false
    })
  },
  beforeDestroy() {
    window.removeEventListener('click', this.onListen)
    this.treeEvents.unSubscrible()
  }
}
</script>

<style lang="less">
.ch_select {
  position: relative;
  width: 260px;
  .ch-input__inner {
    background: rgb(255, 255, 255);
    border-radius: 4px;
    border: 1px solid rgb(220, 223, 230);
    color: rgb(96, 98, 102);
    height: 40px;
    padding: 0px 20px 0 12px;
    box-sizing: border-box;
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
  }
  .has-val {
    color: #222;
  }
  .is-focus .ch-input__inner {
    border-color: rgb(64, 158, 255);
  }
  .ch-content {
    width: 100%;
    height: 40px;
    line-height: 40px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .ch-input__suffix {
    position: absolute;
    right: 6px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #999;
    color: rgb(192, 196, 204);
    pointer-events: none;
    transition: all 0.3s ease 0s;
  }
  .fix_select {
    position: absolute;
    padding: 5px;
    left: 0;
    top: 45px;
    min-width: 100%;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 2px;
    box-shadow: 0 5px 5px #eee;
    &::after {
      content: '';
      width: 0;
      height: 0;
      position: absolute;
      top: -5px;
      left: 5px;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 4px solid #ddd;
    }
  }
}
</style>
