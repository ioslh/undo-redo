<template>
  <div class="info">
    <h4>Rectangle</h4>
    <ul>
      <li v-for="field in displayKeys" :key="field">
        <label>{{ field.toUpperCase() }}</label>
        <div :class="field">
          <input
            type="number" 
            :value="rect[field] | numberBeautify" 
            @change="onValueChange(field, $event)"
            @input="onValueChange(field, $event)"
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props:{
    rect: Object
  },

  computed: {
    displayKeys() {
      return Object.keys(this.rect)
    }
  },

  methods: {
    onValueChange(field, e) {
      let value = Number(e.target.value)
      if (field === 'r') {
        value = value > 180 ? 180 : (value < -180 ? -180 : value)
      } else {
        value = value < 0 ? 0 : value
      }
      this.$emit('transformed', {[field]: value})
      this.$nextTick(() => {
        this.$emit('record')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  height: 280px;
  ul {
    list-style: none;
    background: #fff;
    font-family: monospace;
  }
  li {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-top: 1px solid var(--info-bd-color);
    padding: 10px;
    &:last-child {
      border-bottom: 1px solid var(--info-bd-color);
    }
    label {
      width: 30px;
      text-align: center;
      font-size: 0.8em;
      font-weight: bold;
    }
    div {
      padding-left: 10px;
      position: relative;
      &::after {
        content: 'PX';
        display: block;
        position: absolute;
        right: 12px;
        top: 0;
        color: #bbb;
      }
      &.r::after {
        content: 'DEG'
      }
    }
    input {
      width: 120px;
      outline: none;
      border: 0;
      background: transparent;
      font-size: 14px;
    }
  }
}
</style>
