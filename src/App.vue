<template>
  <div class="content">
    <Controller :rect="rect" @transformed="onTransformed" @record="record"/>
    <div class="side-panel absolute">
      <Info :rect="rect" @transformed="onTransformed" @record="record"/>
      <History :history="history" @command="execute" @cursor="moveCursor"/>
    </div>
  </div>
</template>

<script>
import Controller from './components/Controller.vue'
import History from './components/History.vue'
import Info from './components/Info.vue'
import HistoryStack from './components/History.js'
import { roughlyToPlain } from './components/utils'

export default {
  name: 'app',

  components: {
    Controller,
    History,
    Info,
  },

  data() {
    return {
      history: new HistoryStack(20),
      rect: {
        x: 100,
        y: 100,
        w: 100,
        h: 100,
        r: 0
      }
    }
  },

  mounted() {
    this.record()
  },

  methods: {
    onTransformed(rectEnd) {
      const keys = ['x', 'y', 'w', 'h', 'r']
      keys.forEach(key => {
        if (key in rectEnd) {
          this.rect[key] = rectEnd[key]
        }
      })
    },

    record() {
      this.history.record(roughlyToPlain(this.rect))
    },

    execute(cmd) {
      let snapshot = null
      switch(cmd) {
        case 'undo':
          snapshot = this.history.undo()
          break
        case 'redo':
          snapshot = this.history.redo()
          break
        case 'clear':
          this.history.clear()
          break
        default:
          // pass
      }
      if (snapshot) {
        this.onTransformed(snapshot)
      }
    },

    moveCursor(cursor) {
      const snapshot = this.history.move(cursor)
      if (snapshot) {
        this.onTransformed(snapshot)
      }
    }
  }
}
</script>

<style>
:root {
  --control-color: #5188f1;
  --info-bd-color: #eee;
  --grid-color: rgba(0, 0, 0, 0.05);
}
* {
  margin: 0;
  padding: 0;
  font-family: monospace;
}
:not(input) {
  user-select: none;
}
.content {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-image: repeating-linear-gradient(
    180deg,
    transparent,
    transparent 9px,
    var(--grid-color) 9px,
    var(--grid-color) 10px
  ),
  repeating-linear-gradient(
    90deg,
    transparent,
    transparent 9px,
    var(--grid-color) 9px,
    var(--grid-color) 10px
  );
}
.absolute {
  position: absolute;
}

.side-panel {
  height: 100vh;
  width: 280px;
  right: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-left: 1px solid blue;
}
h4 {
  margin-bottom: 20px;
  font-size: 20px;
}
</style>
