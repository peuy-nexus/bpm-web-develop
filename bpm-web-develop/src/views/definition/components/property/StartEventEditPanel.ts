import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ResourceModuleApi from "@/http/bpm/ResourceModuleApi";
import FormParamDialog from "@/views/definition/components/property/form/FormParamDialog.vue";

@Component({
  name: "StartEventEditPanel",
})
export default class StartEventEditPanel extends Vue {
  @Prop({ type: Object }) modeling: any;
  @Prop({ type: Object }) moddle: any;
  @Prop({ type: Object }) bpmnElement: any;
  @Prop({ type: Object }) bpmnx: any;

  $refs: any;
  formData: any = {
    formModule: null,
    formPage: null,
    formParams: [],
  };

  formPages: any = [];

  @Watch("bpmnElement", { immediate: true })
  bpmnElementChanged() {
    if (!this.bpmnx.process.startEvent) {
      this.bpmnx.process.startEvent = {
        id: this.bpmnElement.id,
        formModule: null,
        formPage: null,
        formParams: [],
      };
    }
    this.formData = this.bpmnx.process.startEvent;
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

  handleModuleChanged(event: any) {
    if (!event || event.pages.length <= 0) {
      this.formData.formPage = null;
      this.formPages = [];
      this.formData.formParams = [];
      return;
    }
    this.formPages = event.pages;
  }

  handleFormPageChanged(event: any) {
    if (!this.formData.formPage || this.formData.formPage.params.length <= 0) {
      this.formData.formParams = [];
      return;
    }

    this.getFormParams([...this.formData.formPage.params]);
  }

  private getFormParams(formParams: any) {
    formParams.forEach((param: any) => {
      const target = this.formData.formParams.find((value: any) => value.key === param.code);
      if (target) {
        param = Object.assign(param, target);
      } else {
        param.key = param.code;
      }
    });
    this.formData.formParams = [...formParams];
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
}
