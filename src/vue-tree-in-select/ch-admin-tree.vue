<template>
  <section class="ch_tree_container">
    <Treenode
      v-for="(item, i) in treeData"
      :key="i"
      ref="treeRef"
      :treeEvents="treeEvents"
      :treenode="item"
      :inSelect="inSelect"
    ></Treenode>
    <div v-if="treeData.length === 0" class="txt_placeholder">
      暂无数据
    </div>
  </section>
</template>

<script>
import TreeEvents from './tree-events'
import Treenode from './tree-node.vue'

export default {
  inheritAttrs: false,
  components: {
    Treenode
  },
  provide() {
    return this.$props
  },
  props: {
    treeEvents: {
      default: () => new TreeEvents()
    },
    inSelect: Boolean,
    valKey: String,
    lazy: Boolean,
    load: Function,
    showCheckbox: {
      type: Boolean
    },
    treeData: {
      type: Array,
      required: !0
    }
  },
  data() {
    return {}
  },
  methods: {
    getCheckedNodes() {
      this.treeEvents.initChecked()
      this.$refs.treeRef.forEach((dom) => {
        dom.getCheckedNodes()
      })
      return treeEvents.checkedList
    },
    getHalfCheckedNodes() {
      this.treeEvents.initHalfChecked()
      this.$refs.treeRef.forEach((dom) => {
        dom.getHalfNodes()
      })
      return this.treeEvents.halfCheckedList
    }
  },
  created() {
    if (this.lazy && typeof this.load !== 'function') {
      throw new Error('lazy load function is required')
    }
  },
  beforeDestroy() {
    this.treeEvents.resetState()
  }
}
</script>
<style lang="less">
.ch_tree_container {
  .txt_placeholder {
    color: #777;
    font-size: 13px;
  }
}
</style>
