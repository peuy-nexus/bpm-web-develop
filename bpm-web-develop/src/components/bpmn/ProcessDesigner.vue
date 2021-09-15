<template>
  <div class="progress-designer">
    <div class="progress-designer__canvas" ref="canvas"></div>
  </div>
</template>

<script lang="ts" src="./ProcessDesigner.ts"></script>

<style lang="scss">
.progress-designer {
  height: 100%;
  &__canvas {
    height: 100%;
    background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+");
  }

  .djs-direct-editing-parent {
    border-radius: 10px;
  }

  .djs-context-pad {
    background-color: $--color-white;
    border: $--border-base;
    box-shadow: 0 0 6px #eeeeee;
    > .group {
      display: flex;
    }
  }

  .djs-context-pad .entry {
    width: 32px;
    height: 32px;
    padding: 4px;
    font-size: 24px;
  }
  //侧边栏配置
  .djs-palette.open {
    .djs-palette-entries {
      div[class^="bpmn-icon-"]:before,
      div[class*="bpmn-icon-"]:before {
        line-height: unset;
      }
      div.entry {
        position: relative;
      }
      div.entry:hover {
        &::after {
          width: max-content;
          content: attr(data-title);
          vertical-align: text-bottom;
          position: absolute;
          right: -10px;
          top: 0;
          bottom: 0;
          overflow: hidden;
          transform: translateX(100%);
          font-size: 0.5em;
          display: inline-block;
          text-decoration: inherit;
          font-variant: normal;
          text-transform: none;
          background: #fafafa;
          box-shadow: 0 0 6px #eeeeee;
          border: 1px solid #cccccc;
          box-sizing: border-box;
          padding: 0 16px;
          border-radius: 4px;
          z-index: 100;
        }
      }
    }
  }
}
</style>
