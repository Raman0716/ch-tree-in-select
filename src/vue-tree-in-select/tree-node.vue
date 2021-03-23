<template>
  <div class="ch_node_item">
    <div class="ch_node_title">
      <template v-if="_showCaret">
        <span
          class="ch-icon-caret-bottom"
          :class="{ 'ch-icon-caret-right': showChild }"
          @click="toggleChildren"
        />
      </template>

      <template v-if="!inSelect && showCheckbox">
        <TreeCheckbox
          :disabled="treenode.disabled"
          v-model="listenObj.value"
          :indeterminate="listenObj.indeterminate"
        ></TreeCheckbox>
      </template>

      <slot name="loading">
        <span class="ch_circular" v-if="loading" />
      </slot>
      <div
        class="node_label"
        :class="{
          in_select: inSelect,
          select_active: inSelect && selectedVal[valKey] === treenode[valKey]
        }"
        @click.stop="chooseNode"
      >
        <slot>{{ treenode.label }}</slot>
      </div>
    </div>

    <div v-if="treenode.children" class="kid_node" v-show="showChild">
      <Treenode
        v-for="(item, i) in treenode.children"
        :key="i"
        ref="kidNodeRef"
        :treenode="item"
        :treeEvents="treeEvents"
        :parentId="kidSubscribleId"
        :parentListen="listenObj"
        :inSelect="inSelect"
      ></Treenode>
    </div>
  </div>
</template>

<script>
import { countVal } from './tree-events'
import TreeCheckbox from './tree-checkbox.vue'

export default {
  inheritAttrs: false,
  name: 'Treenode',
  components: {
    TreeCheckbox
  },
  inject: ['valKey', 'showCheckbox', 'load', 'lazy'],
  props: {
    treeEvents: {
      required: !0
    },
    inSelect: Boolean,
    parentId: {
      default: () => countVal.getNodeId()
    },
    treenode: {
      type: Object,
      required: true
    },
    parentListen: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const nodeId = countVal.getNodeId()
    return {
      nodeId,
      showCaret: true,
      lazyLoaded: false,
      loading: false,
      showChild: false,
      selectedVal: {},
      listenObj: {
        nodeId,
        value: false,
        indeterminate: false
      }
    }
  },
  computed: {
    _showCaret() {
      const { inSelect, treenode, showCaret, lazyLoaded, lazy } = this
      if (inSelect && treenode.children) {
        return true
      } else if (!inSelect) {
        if (lazy && lazyLoaded && !treenode.children){
          return false
        } else if (!lazy && !treenode.children) {
          return false
        } else {
          return showCaret
        }
      }
      return false
    },
    kidSubscribleId() {
      if (this.treenode.disabled) {
        return this.parentId
      }
      return this.nodeId
    }
  },
  watch: {
    'listenObj.value'(v) {
      this.changeCheck(v)
    },
    'listenObj.indeterminate'(v) {
      this.changeIntmte(v)
    }
  },
  methods: {
    /**
     * @param {state} enum { checked, half }
     */
    getNodes(state = 'checked') {
      const { listenObj, treenode } = this
      if (state === 'checked' && listenObj.value) {
        this.treeEvents.addChecked(treenode)
      }
      if (state === 'half' && listenObj.indeterminate) {
        this.treeEvents.addHalfChecked(treenode)
      }
      const kidNodes = this.$refs.kidNodeRef || []
      kidNodes.forEach((dom) => {
        dom.getNodes(state)
      })
    },
    getCheckedNodes() {
      this.getNodes('checked')
    },
    getHalfNodes() {
      this.getNodes('half')
    },
    async toggleChildren() {
      if (this.load && !this.treenode.children) {
        this.loading = true
        const res = await this.load(this.treenode).finally(() => {
          this.loading = false
          this.lazyLoaded = true
        })
        if (res.length) {
          this.treenode.children = res
        } else {
          this.showCaret = false
        }
      }
      this.showChild = !this.showChild
    },
    bindListen() {
      if (this.treenode.disabled) return
      const { listenObj, parentId: pId } = this
      const { listenMap } = this.treeEvents
      listenMap[pId] = listenMap[pId] || []
      listenMap[pId].push(listenObj)
    },
    changeCheck(curVal) {
      const { parentListen, parentId, nodeId, listenObj } = this
      this.treeEvents.dispatchEvt({ curVal, evId: nodeId, listenObj })
      this.treeEvents.emitEvt({ parentListen, parentId })
    },
    changeIntmte() {
      const { parentListen, parentId } = this
      this.treeEvents.emitEvt({ parentListen, parentId })
    },
    chooseNode() {
      this.treeEvents.next(this.treenode)
    }
  },
  created() {
    this.bindListen()
    this.treeEvents.subscrible((val) => {
      this.selectedVal = val
    })
  },
  beforeDestroy() {
    this.treeEvents.removeNodeListen(this.nodeId)
  }
}
</script>
<style lang="less">
.ch_node_item {
  .ch_node_title {
    display: flex;
    align-items: center;
  }
  .node_label {
    flex-grow: 1;
    text-align: left;
  }
  .ch-icon-caret-bottom {
    position: relative;
    width: 0;
    height: 0;
    margin-right: 5px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #999;
    cursor: pointer;
    display: inline-block;
    transition: transform 0.08s ease-in 0.05s;
    transform-origin: center;
    transform: rotateZ(-90deg);
  }
  .in_select {
    cursor: pointer;
  }
  .select_active {
    color: rgb(64, 158, 255);
    font-weight: bold;
  }
  .ch-icon-caret-right {
    transform: rotateZ(0);
  }
  .ch_circular {
    display: inline-block;
    margin-right: 4px;
    animation: ani-circle 1.5s linear infinite;
    &::after {
      content: '';
      width: 12px;
      height: 12px;
      border-radius: 50%;
      vertical-align: middle;
      border-top: 2px solid #409eff;
      border-bottom: 2px solid #409eff;
      display: inline-block;
    }
  }
  @keyframes ani-circle {
    100% {
      transform: rotateZ(360deg);
    }
  }
  .kid_node {
    padding-left: 15px;
  }
}
</style>
