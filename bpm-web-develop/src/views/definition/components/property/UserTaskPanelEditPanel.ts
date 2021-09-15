import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ResourceModuleApi from "@/http/bpm/ResourceModuleApi";
import FormParamDialog from "@/views/definition/components/property/form/FormParamDialog.vue";
import OutgoingEditDialog from "@/views/definition/components/property/form/OutgoingEditDialog.vue";

@Component({
  name: "UserTaskPanelEditPanel",
  filters: {
    outgoings: (value: any[]) => {
      return value && value.map(item => item.name).join(",");
    },
  },
})
export default class UserTaskPanelEditPanel extends Vue {
  @Prop({ type: Object }) modeling: any;
  @Prop({ type: Object }) bpmnElement: any;
  @Prop({ type: Object }) bpmnx: any;

  $refs: any;
  formData: any = {
    id: "",
    name: "",
    outVariable: "_action",
    formModule: {},
    formPage: null,
    formParams: [],
    outgoings: [],
  };

  formModule: any = {};
  formPages: any[] = [];

  rules: any = {
    id: [{ required: true, message: this.$t("流程中心.流程定义/任务定义/任务ID/输入提示"), trigger: ["blur"] }],
    name: [{ required: true, message: this.$t("流程中心.流程定义/任务定义/任务名称/输入提示"), trigger: ["blur"] }],
  };

  @Watch("bpmnElement", { immediate: true })
  bpmnElementChanged() {
    let formData = this.bpmnx.process.userTasks.find((item: any) => item.id === this.bpmnElement.id);
    if (!formData) {
      const taskCount = ++this.bpmnx.process.taskCount;
      formData = {
        id: this.bpmnElement.id,
        name: `任务节点${taskCount}`,
        outVariable: "_action",
        formParams: [],
        outgoings: [],
      };
      this.bpmnx.process.userTasks.push(formData);
      this.$nextTick(() => {
        this.modeling.updateProperties(this.bpmnElement, { name: formData.name });
      });
    }
    this.formData = formData;
    if (this.formData.formModule) {
      this.loadResourceModule(this.formData.formModule.uuid);
    }
  }

  loadResourceModule(uuid: string) {
    ResourceModuleApi.get({
      uuid,
      fetchParts: ["pages.params", "actions", "pages"],
    }).then(res => {
      if (res.data) {
        this.formModule = res.data;
        this.formPages = res.data.pages;
        if (!this.formPages || !this.formData.formPage) {
          return;
        }

        const currentFormPage = this.formPages.find((value: any) => value.uuid === this.formData.formPage.uuid);
        let formParams: any[] = [];
        if (this.formData.formParams) {
          formParams = [...this.formData.formParams];
        }
        const targetParams: any[] = [];
        if (currentFormPage) {
          for (const param of currentFormPage.params) {
            const target: any = { key: param.code, name: param.name };
            targetParams.push(target);
            const index = formParams.findIndex(item => item.code === param.code);
            if (index >= 0) {
              target.value = formParams[index].value;
              formParams.splice(index, 1);
            }
          }
        }
        this.formData.formParams = [...targetParams, ...formParams];
      }
    });
  }

  handleIdChange() {
    this.formData = Object.assign({}, this.formData, { id: event });
    this.modeling.updateProperties(this.bpmnElement, {
      id: this.formData.name,
    });
  }

  handleNameChange(event: string) {
    this.formData = Object.assign({}, this.formData, { name: event });
    this.modeling.updateProperties(this.bpmnElement, {
      name: this.formData.name,
    });
  }

  handleModuleChanged(event: any) {
    if (event && this.formData.formModule && event.uuid === this.formData.formModule.uuid) {
      return;
    }

    this.formPages = [];
    this.formData.formModule = event;
    this.formData.formPage = null;
    this.formData.formParams = [];
    if (event) {
      this.loadResourceModule(event.uuid);
    }
  }

  handleFormPageChanged(event: any) {
    if (event && this.formData.formPage && event.uuid === this.formData.formPage.uuid) {
      return;
    }
    this.formData.formPage = event;
    let formParams = [];
    if (event && event.params) {
      formParams = event.params.map((item: any) => Object.assign({}, item));
    }
    this.formData.formParams = formParams;
  }

  doEditFormParam(index: number) {
    this.$dialog
      .show(FormParamDialog, {
        value: this.formData.formParams[index],
      })
      .then((res: any) => {
        if (!res.wasCancelled) {
          this.formData.formParams.splice(index, 1, res.output);
        }
      });
  }

  doEditOutgoins() {
    this.$dialog
      .show(OutgoingEditDialog, {
        value: this.formData.outgoings || [],
        bizActions: this.formModule.actions,
      })
      .then((res: any) => {
        if (!res.wasCancelled) {
          this.formData.outgoings = res.output;
          this.$message.warning("任务出口发生变化，请重新设置分支操作。");
          const sequenceFlows = this.bpmnx.process.sequenceFlows.filters(
            (item: any) => item.sourceId === this.formData.id,
          );
          console.log(sequenceFlows);
        }
      });
  }

  showError() {
    this.$refs.form.validate((valid: boolean) => {
      if (!valid) {
        this.$refs.form.$el.classList.add("shake");
        setTimeout(() => {
          this.$refs.form.$el.classList.remove("shake");
        }, 800);
      }
    });
  }
}
