<template>
  <div class="history">
    <h4>History</h4>
    <div class="actions">
      <div class="action undo" @click="execute('undo')" :class="{valid: history.canUndo}">Undo</div>
      <div class="action redo" @click="execute('redo')" :class="{valid: history.canRedo}">Redo</div>
      <div class="action clear" @click="execute('clear')" :class="{valid: history.canClear}">Clear</div>
    </div>
    <transition-group name="flip-list" tag="ul" v-if="displaySnapshots.length">
      <li class="special" key="special-newest">NEWEST</li>
      <li
        v-for="item in displaySnapshots"
        :key="item.snapshot.uuid"
        :class="{current: item.index === history.cursor}"
        @click="moveCursor(item.index)"
      >
        <div class="key" v-for="key in keys" :key="key">
          <div class="result">{{ item.snapshot[key] |  numberBeautify}}</div>
          <div class="tag">{{ key.toUpperCase() }}</div>
        </div>
      </li>
      <li class="special" key="special-oldest">OLDEST</li>
    </transition-group>
    <div class="empty" v-else>empty snapshots</div>
  </div>
</template>

<script>
export default {
  props: {
    history: Object,
  },

  computed: {
    displaySnapshots() {
      return this.history.snapshots.map((snapshot, index) => ({
        snapshot,
        index,
      })).reverse()
    }
  },

  data() {
    return {
      keys: ['x', 'y', 'w', 'h', 'r'],
      snapshot: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        r: 0,
      }
    }
  },

  methods: {
    execute(cmd) {
      this.$emit('command', cmd)
    },
    moveCursor(cursor) {
      this.$emit('cursor', cursor)
    },
  }
}
</script>

<style lang="scss" scoped>
.flip-list-move {
  transition: transform 1s;
}
.flip-list-enter, .flip-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.history {
  flex: 1;
  display: flex;
  flex-direction: column;
  .actions {
    height: 35px;
    display: flex;
    justify-content: space-between;
    .action {
      flex: 1;
      color: #aaa;
      margin-bottom: 20px;
      cursor: not-allowed;
      &.valid {
        cursor: pointer;
        color: green;
        font-weight: bold;
      }
    }
  }
  h4 {
    height: 23px;
  }
  ul {
    flex: 1;
    list-style: none;
    overflow: auto;
    padding-bottom: 40px;
  }
  li {
    transition: all 1s;
  }
  li:not(.special) {
    display: flex;
    margin: 10px 0;
    margin-left: 20px;
    position: relative;
    border: 1px solid transparent;
    cursor: pointer;
    &::after {
      position: absolute;
      content: '';
      display: block;
      left: -20px;
      top: 50%;
      width: 10px;
      height: 10px;
      margin-top: -5px;
      background: #eee;
      border-radius: 50%;
      transition: background .5s;
    }
    &.current::after {
      background: green;
    }
    &:hover {
      border: 1px solid rgba(0, 200, 0, 0.5);
    }
  }
  li.special {
    font-size: 20px;
    opacity: 0.1;
  }
  .key {
    flex: 1;
    &:nth-child(odd) {
      background: #efefef;
    }
  }
  .result {
    text-align: center;
  }
  .tag {
    text-align: center;
    opacity: 0.6;
  }
  .empty {
    opacity: 0.6;
  }
}
</style>
