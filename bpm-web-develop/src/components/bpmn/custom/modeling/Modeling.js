import inherits from "inherits";

import BaseModeling from "diagram-js/lib/features/modeling/Modeling";

import UpdateModdlePropertiesHandler from "bpmn-js/lib/features/modeling/cmd/UpdateModdlePropertiesHandler";
import UpdatePropertiesHandler from "bpmn-js/lib/features/modeling/cmd/UpdatePropertiesHandler";
import UpdateCanvasRootHandler from "bpmn-js/lib/features/modeling/cmd/UpdateCanvasRootHandler";
import AddLaneHandler from "bpmn-js/lib/features/modeling/cmd/AddLaneHandler";
import SplitLaneHandler from "bpmn-js/lib/features/modeling/cmd/SplitLaneHandler";
import ResizeLaneHandler from "bpmn-js/lib/features/modeling/cmd/ResizeLaneHandler";
import UpdateFlowNodeRefsHandler from "bpmn-js/lib/features/modeling/cmd/UpdateFlowNodeRefsHandler";
import IdClaimHandler from "bpmn-js/lib/features/modeling/cmd/IdClaimHandler";
import SetColorHandler from "bpmn-js/lib/features/modeling/cmd/SetColorHandler";

import UpdateLabelHandler from "bpmn-js/lib/features/label-editing/cmd/UpdateLabelHandler";

/**
 * BPMN 2.0 modeling features activator
 *
 * @param {EventBus} eventBus
 * @param {ElementFactory} elementFactory
 * @param {CommandStack} commandStack
 * @param {BpmnRules} bpmnRules
 */
export default function Modeling(eventBus, elementFactory, commandStack, bpmnRules) {
  BaseModeling.call(this, eventBus, elementFactory, commandStack);

  this._bpmnRules = bpmnRules;
}

inherits(Modeling, BaseModeling);

Modeling.$inject = ["eventBus", "elementFactory", "commandStack", "bpmnRules"];

Modeling.prototype.getHandlers = function() {
  const handlers = BaseModeling.prototype.getHandlers.call(this);

  handlers["element.updateModdleProperties"] = UpdateModdlePropertiesHandler;
  handlers["element.updateProperties"] = UpdatePropertiesHandler;
  handlers["canvas.updateRoot"] = UpdateCanvasRootHandler;
  handlers["lane.add"] = AddLaneHandler;
  handlers["lane.resize"] = ResizeLaneHandler;
  handlers["lane.split"] = SplitLaneHandler;
  handlers["lane.updateRefs"] = UpdateFlowNodeRefsHandler;
  handlers["id.updateClaim"] = IdClaimHandler;
  handlers["element.setColor"] = SetColorHandler;
  handlers["element.updateLabel"] = UpdateLabelHandler;

  return handlers;
};

Modeling.prototype.updateLabel = function(element, newLabel, newBounds, hints) {
  this._commandStack.execute("element.updateLabel", {
    element: element,
    newLabel: newLabel,
    newBounds: newBounds,
    hints: hints || {},
  });
};

Modeling.prototype.connect = function(source, target, attrs, hints) {
  const bpmnRules = this._bpmnRules;

  if (!attrs) {
    attrs = bpmnRules.canConnect(source, target);
  }

  if (!attrs) {
    return;
  }

  return this.createConnection(source, target, attrs, source.parent, hints);
};

Modeling.prototype.updateModdleProperties = function(element, moddleElement, properties) {
  this._commandStack.execute("element.updateModdleProperties", {
    element: element,
    moddleElement: moddleElement,
    properties: properties,
  });
};

Modeling.prototype.updateProperties = function(element, properties) {
  this._commandStack.execute("element.updateProperties", {
    element: element,
    properties: properties,
  });
};

Modeling.prototype.resizeLane = function(laneShape, newBounds, balanced) {
  this._commandStack.execute("lane.resize", {
    shape: laneShape,
    newBounds: newBounds,
    balanced: balanced,
  });
};

Modeling.prototype.addLane = function(targetLaneShape, location) {
  const context = {
    shape: targetLaneShape,
    location: location,
  };

  this._commandStack.execute("lane.add", context);

  return context.newLane;
};

Modeling.prototype.splitLane = function(targetLane, count) {
  this._commandStack.execute("lane.split", {
    shape: targetLane,
    count: count,
  });
};

/**
 * Transform the current diagram into a collaboration.
 *
 * @return {djs.model.Root} the new root element
 */
Modeling.prototype.makeCollaboration = function() {
  const collaborationElement = this._create("root", {
    type: "bpmn:Collaboration",
  });

  const context = {
    newRoot: collaborationElement,
  };

  this._commandStack.execute("canvas.updateRoot", context);

  return collaborationElement;
};

Modeling.prototype.updateLaneRefs = function(flowNodeShapes, laneShapes) {
  this._commandStack.execute("lane.updateRefs", {
    flowNodeShapes: flowNodeShapes,
    laneShapes: laneShapes,
  });
};

/**
 * Transform the current diagram into a process.
 *
 * @return {djs.model.Root} the new root element
 */
Modeling.prototype.makeProcess = function() {
  const processElement = this._create("root", {
    type: "bpmn:Process",
  });

  const context = {
    newRoot: processElement,
  };

  this._commandStack.execute("canvas.updateRoot", context);
};

Modeling.prototype.claimId = function(id, moddleElement) {
  this._commandStack.execute("id.updateClaim", {
    id: id,
    element: moddleElement,
    claiming: true,
  });
};

Modeling.prototype.unclaimId = function(id, moddleElement) {
  this._commandStack.execute("id.updateClaim", {
    id: id,
    element: moddleElement,
  });
};

Modeling.prototype.setColor = function(elements, colors) {
  if (!elements.length) {
    elements = [elements];
  }

  this._commandStack.execute("element.setColor", {
    elements: elements,
    colors: colors,
  });
};

Modeling.prototype.removeElements = function(elements) {
  const newElements = elements.filter(e => {
    if (e.id === "startEvent" || !isDeleteable(e.businessObject)) {
      return false;
    }
    return true;
  });

  if (newElements.length <= 0) {
    return;
  }

  const context = {
    elements: newElements,
  };

  this._commandStack.execute("elements.delete", context);
};

/* 判断是否有扩展节点，扩展节点中存在name ='deleteable',value='false'则节点不能被删除 */
function isDeleteable(businessObject) {
  if (businessObject.extensionElements) {
    const flowableProperties = businessObject.extensionElements.values.filter(
      extensionElement => extensionElement.$type === "flowable:Properties",
    );
    const exitUndeleteItem = flowableProperties.find(property => {
      const hasItem = property.values.find(item => {
        if (item.name === "deleteable" && item.value === "false") {
          return true;
        }
      });
      return !!hasItem;
    });
    if (exitUndeleteItem) return false;
  }

  return true;
}
