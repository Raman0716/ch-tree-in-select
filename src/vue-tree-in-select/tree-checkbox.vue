<template>
  <label class="ch_node_checkbox">
    <span
      class="ch-checkbox__input"
      :class="{
        'is-checked': value,
        'is-indeterminate': indeterminate,
        'is-disabled': disabled
      }"
    >
      <span class="ch-checkbox__inner"></span>
      <input
        type="checkbox"
        class="ch-checkbox__original"
        v-model="_value"
        :disabled="disabled"
      />
    </span>
  </label>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: Boolean,
    disabled: Boolean,
    indeterminate: Boolean
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
  }
}
</script>

<style lang="less">
.ch_node_checkbox {
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  user-select: none;
  margin-right: 8px;
  .ch-checkbox__inner {
    display: inline-block;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #fff;
    z-index: 1;
    &:after {
      box-sizing: content-box;
      content: '';
      border: 1px solid #fff;
      border-left: 0;
      border-top: 0;
      height: 7px;
      left: 4px;
      position: absolute;
      top: 1px;
      transform: rotate(45deg) scaleY(0);
      width: 3px;
      transition: transform 0.15s ease-in 0.05s;
      transform-origin: center;
    }
  }
  .ch-checkbox__input {
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
    &.is-disabled .ch-checkbox__inner {
      background-color: #edf2fc;
      border-color: #dcdfe6;
      cursor: not-allowed;
    }
    &.is-checked,
    &.is-indeterminate {
      .ch-checkbox__inner {
        background-color: #409eff;
        border-color: #409eff;
      }
    }
    &.is-checked .ch-checkbox__inner:after {
      transform: rotate(45deg) scaleY(1);
    }
    &.is-indeterminate .ch-checkbox__inner:after {
      transform: rotate(0);
      background-color: #edf2fc;
      height: 1px;
      top: 5px;
      width: 6px;
      left: 2px;
    }
  }
  .ch-checkbox__original {
    opacity: 0;
    outline: none;
    position: absolute;
    margin: 0;
    width: 0;
    height: 0;
    z-index: -1;
  }
}
</style>
