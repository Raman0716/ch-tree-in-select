class SelectModel {
  selectedItem = {}
  subCallbacks = []
  subscrible(fn) {
    this.subCallbacks.push(fn)
  }
  next(val) {
    this.selectedItem = val || {}
    this.subCallbacks.forEach((fn) => fn(val))
  }
  unSubscrible() {
    this.subCallbacks = []
    this.selectedItem = {}
  }
}

class HalfCheckedNodes extends SelectModel {
  halfCheckedList = []
  initHalfChecked() {
    this.halfCheckedList = []
  }
  addHalfChecked(item) {
    this.halfCheckedList.push(item)
  }
}

class CheckedNodes extends HalfCheckedNodes {
  checkedList = []
  initChecked() {
    this.checkedList = []
  }
  addChecked(item) {
    this.checkedList.push(item)
  }
}

class CountModel {
  nodeId = -1
  getNodeId() {
    this.nodeId++
    return `__${this.nodeId}`
  }
}
export const countVal = new CountModel()
export default class TreeEvents extends CheckedNodes {
  listenMap = {}

  resetState() {
    this.listenMap = {}
  }
  removeNodeListen(id) {
    Reflect.deleteProperty(this.listenMap, id)
  }

  dispatchEvt({ evId = '', curVal, listenObj }) {
    const { indeterminate } = listenObj
    if (this.listenMap[evId]) {
      if (curVal || !indeterminate) {
        this.listenMap[evId].forEach((e) => {
          e.value = curVal
        })
      }
    }
  }
  emitEvt({ parentListen, parentId }) {
    const isAll = this.listenMap[parentId].every(
      (e) => !e.indeterminate && e.value
    )
    const isNone = this.listenMap[parentId].every(
      (e) => !e.indeterminate && !e.value
    )
    const parentImt = this.listenMap[parentId].some(
      (e) => e.indeterminate || e.value
    )
    parentListen.indeterminate = false
    if (!isAll && !isNone && parentImt) {
      parentListen.value = false
      parentListen.indeterminate = true
      return
    }
    if (isAll) {
      parentListen.value = true
    } else if (isNone) {
      parentListen.value = false
    }
  }
}

