<template>
  <div class="content">
    <Controller :rect="rect" @transformed="onTransformed" @record="record"/>
    <div class="side-panel absolute">
      <Info :rect="rect" @transformed="onTransformed" @record="record"/>
      <History :history="history" @command="execute" @cursor="moveCursor"/>
    </div>
    <div class="ctrl-guide">
      <p>Mousedown any control points to resize or rotate.</p>
      <p>To resize with fixed ratio, hold <kbd>Shift</kbd> key.</p>
      <p><a href="https://github.com/ioslh/undo-redo" target="_blank">https://github.com/ioslh/undo-redo</a></p>
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
        r: 0,
        animation: false,
      }
    }
  },

  mounted() {
    this.record()
  },

  methods: {
    onTransformed(rectEnd, animation = false) {
      const rect = {}
      const keys = ['x', 'y', 'w', 'h', 'r']
      keys.forEach(key => {
        if (key in rectEnd) {
          rect[key] = rectEnd[key]
        }
      })
      rect.animation = animation
      this.rect = rect
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
        this.onTransformed(snapshot, true)
      }
    },

    moveCursor(cursor) {
      const snapshot = this.history.move(cursor)
      if (snapshot) {
        this.onTransformed(snapshot, true)
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
  border-left: 1px solid #aaa;
}
h4 {
  margin-bottom: 20px;
  font-size: 20px;
}
.ctrl-guide {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 10px;
}
kbd {
  background-color: rgb(238, 238, 238);
  border-radius: 3px;
  border: 1px solid rgb(180, 180, 180);
  box-shadow: 0 1px 1px rgba(0,0,0,.2), 0 2px 0 0 rgba(255,255,255,.7) inset;
  color: rgb(51, 51, 51);
  display: inline-block;
  font-family: consolas,"Liberation Mono",courier,monospace;
  font-size: .85em;
  font-weight: 700;
  line-height: 1;
  padding: 2px 4px;
  white-space: nowrap;
}
</style>
