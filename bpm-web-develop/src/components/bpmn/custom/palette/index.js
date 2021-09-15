import { domify, query as domQuery, attr as domAttr, clear as domClear, classes as domClasses } from "min-dom";
import { forEach, isArray } from "min-dash";

import PaletteModule from "diagram-js/lib/features/palette";
import Palette from "diagram-js/lib/features/palette/Palette";
import CreateModule from "diagram-js/lib/features/create";
import SpaceToolModule from "diagram-js/lib/features/space-tool";
import LassoToolModule from "diagram-js/lib/features/lasso-tool";
import HandToolModule from "diagram-js/lib/features/hand-tool";
import GlobalConnectModule from "diagram-js/lib/features/global-connect";
import translate from "diagram-js/lib/i18n/translate";

import PaletteProvider from "./PaletteProvider";

function addClasses(element, classNames) {
  const classes = domClasses(element);

  const actualClassNames = isArray(classNames) ? classNames : classNames.split(/\s+/g);
  actualClassNames.forEach(function(cls) {
    classes.add(cls);
  });
}

Palette.prototype._update = function() {
  const entriesContainer = domQuery(".djs-palette-entries", this._container);
  const entries = (this._entries = this.getEntries());

  domClear(entriesContainer);

  forEach(entries, function(entry, id) {
    const grouping = entry.group || "default";

    let container = domQuery("[data-group=" + grouping + "]", entriesContainer);
    if (!container) {
      container = domify(`<div class="group" data-group="${grouping}"></div>`);
      entriesContainer.appendChild(container);
    }

    const html =
      entry.html ||
      (entry.separator
        ? '<hr class="separator" />'
        : `<div class="entry" draggable="true" data-title="${entry.title}"></div>`);

    const control = domify(html);
    container.appendChild(control);

    if (!entry.separator) {
      domAttr(control, "data-action", id);

      // if (entry.title) {
      //   domAttr(control, "title", entry.title);
      // }

      if (entry.className) {
        addClasses(control, entry.className);
      }

      if (entry.imageUrl) {
        control.appendChild(domify('<img src="' + entry.imageUrl + '">'));
      }
    }
  });

  // open after update
  this.open();
};

export default {
  __depends__: [
    PaletteModule,
    CreateModule,
    SpaceToolModule,
    LassoToolModule,
    HandToolModule,
    GlobalConnectModule,
    translate,
  ],
  __init__: ["paletteProvider"],
  paletteProvider: ["type", PaletteProvider],
};

// bpmn.js教材-自定义palette篇
// 作者：LinDaiDai_霖呆呆
// 链接：https://juejin.cn/post/6844904019454853127
