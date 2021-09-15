import { Component, Vue } from "vue-property-decorator";
import BpmDesignApi from "@/http/bpm/BpmDesignApi";
import ConstantMgr from "@/mgr/ConstantMgr";
import BpmDefinitionApi from "@/http/bpm/BpmDefinitionApi";
import PropertyEditPanel from "@/views/definition/components/PropertyEditPanel.vue";
import BpmDefinitionValidateDialog from "@/views/definition/components/BpmDefinitionValidateDialog.vue";

@Component({
  name: "BpmDefinitionEdit",
  components: {
    PropertyEditPanel,
  },
})
export default class BpmDefinitionEdit extends Vue {
  entity: any = {};
  bpmDefinition: any = {};

  bpmnModeler: any = null;
  modeling: any = null;
  bpmnElement: any = null;
  recoverable: boolean = false;
  revocable: boolean = false;

  mounted(): void {
    const { uuid }: any = this.$route.query;
    if (uuid) {
      BpmDesignApi.get({ uuid: uuid }).then(res => {
        this.entity = res.data;
      });
      BpmDefinitionApi.get({ uuid: uuid }).then(res => {
        this.bpmDefinition = res.data;
      });
    }
  }

  doViewXml() {
    this.bpmnModeler.saveXML({ format: true }).then(({ xml }: any) => {
      console.log("xml", xml);
    });
  }

  doSave(publish: boolean = false) {
    this.bpmnModeler
      .saveXML({ format: true })
      .then(({ xml }: any) => {
        if (!publish) return { xml };

        return this.$dialog
          .show(BpmDefinitionValidateDialog, { modelXml: xml })
          .then((res: any) => (res.wasCancelled ? Promise.reject() : Promise.resolve({ xml })));
      })
      .then(({ xml }: any) => {
        const loading = this.$loading(ConstantMgr.loadingSaveOption);
        return BpmDesignApi.modify(
          Object.assign({}, this.entity, {
            modelXml: xml,
            publish: publish,
          }),
        )
          .then(res => {
            loading.close();
            this.entity = res.data;
            if (publish) {
              this.$router.push({ name: "BpmDefinitionView", query: { uuid: this.entity.uuid } });
            }
          })
          .catch((error: any) => {
            loading.close();
            this.$error(error);
          });
      })
      .catch(this.$error);
  }

  doCancel() {
    if (!this.revocable) {
      this.$router.back();
    }
    this.$confirm(
      `${this.$t("流程中心.流程设计/操作/取消编辑/提示语")}`,
      `${this.$t("公共.确认框/标题/提示")}`,
    ).then(() => this.$router.back());
  }

  handleInitFinished(event: any) {
    this.bpmnModeler = event;
    this.modeling = this.bpmnModeler && this.bpmnModeler.get("modeling");
  }

  handleImportDone(e: any) {
    this.recoverable = false;
    this.revocable = false;
  }

  handleSelectionChanged({ newSelection }: any) {
    this.bpmnElement = newSelection[0] || null;
  }

  handleElementChanged(e: any) {
    if (e.element.type == "bpmn:UserTask") {
      const formData = this.entity.extend.process.userTasks.find((item: any) => item.id === e.element.id);
      if (formData) {
        formData.name = e.element.businessObject.name;
      }
    } else if (e.element.type == "bpmn:SequenceFlow") {
      const formData = this.entity.extend.process.sequenceFlows.find((item: any) => item.id === e.element.id);
      if (formData) {
        formData.name = e.element.businessObject.name;
      }
    }
  }

  handleShapeAdded(e: any) {
    if (e.element.type == "bpmn:UserTask") {
      let formData = this.entity.extend.process.userTasks.find((item: any) => item.id === e.element.id);
      if (!formData) {
        const taskCount: any = ++this.entity.extend.process.taskCount;
        const taskName = `任务节点${taskCount}`;
        formData = {
          id: e.element.id,
          name: taskName,
          outVariable: "_action",
          formModule: this.bpmDefinition.startModule,
          formParams: [],
          outgoings: [],
        };
        this.entity.extend.process.userTasks.push(formData);
        this.$nextTick(() => {
          this.modeling.updateProperties(e.element, { name: taskName });
        });
      }
    }
  }

  handleShapeRemoved(e: any) {
    if (e.element.type == "bpmn:UserTask") {
      const targetIndex = this.entity.extend.process.userTasks.findIndex((item: any) => item.id === e.element.id);
      if (targetIndex >= 0) {
        this.entity.extend.process.userTasks.splice(targetIndex, 1);
      }
      this.entity.extend.process.sequenceFlows = this.entity.extend.process.sequenceFlows.filters(
        (sequenceFlow: any) => sequenceFlow.sourceId != e.element.id && sequenceFlow.targetId != e.element.id,
      );
    }
  }

  handleConnectionAdded(e: any) {
    if (e.element.type == "bpmn:SequenceFlow") {
      let targetData = this.entity.extend.process.sequenceFlows.find((item: any) => item.id === e.element.id);
      if (!targetData) {
        targetData = {
          id: e.element.id,
          lineNo: this.entity.extend.process.sequenceFlows.length,
          sourceId: e.element.source && e.element.source.id,
          targetId: e.element.target && e.element.target.id,
        };
        this.entity.extend.process.sequenceFlows.push(targetData);
        if (e.element.source) {
          const sourceTask = this.entity.extend.process.userTasks.find((item: any) => item.id === e.element.source.id);
          if (sourceTask) {
            if (sourceTask.outgoings.length == 0) {
              targetData.asDefault = true;
            }
            sourceTask.outgoings.push({
              sequenceFlow: e.element.id,
            });
          }
        }
      }
    }
  }

  handleConnectionRemoved(e: any) {
    if (e.element.type == "bpmn:SequenceFlow") {
      const targetIndex = this.entity.extend.process.sequenceFlows.findIndex((item: any) => item.id === e.element.id);
      if (targetIndex >= 0) {
        this.entity.extend.process.sequenceFlows.splice(targetIndex, 1);
      }
    }
  }

  handleCommandStackChanged(event: any) {
    this.recoverable = this.bpmnModeler.get("commandStack").canRedo();
    this.revocable = this.bpmnModeler.get("commandStack").canUndo();
  }
}
