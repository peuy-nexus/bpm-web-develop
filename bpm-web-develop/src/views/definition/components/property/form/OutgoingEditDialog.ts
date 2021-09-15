import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import StringUtil from "@/components/waltz-vue/utils/StringUtil";
import i18n from "@/i18n";

const defaultOutgoings: any = {
  approve: i18n.t("公共.操作/审核通过"),
  submit: i18n.t("公共.操作/提交"),
  reject: i18n.t("公共.操作/驳回"),
  return: i18n.t("公共.操作/退回发起人"),
};
@Component({
  name: "OutgoingEditDialog",
  filters: {
    outgoingName: (key: string) => {
      return defaultOutgoings[key];
    },
  },
})
export default class OutgoingEditDialog extends Vue {
  @Prop({ type: Boolean }) visible: boolean;
  @Prop({ type: Array }) value: any[];
  @Prop({ type: Array }) bizActions: any[];

  formData = {};
  rules = {};
  rowData: any[];
  $refs: any;

  get defaultOutgoingKeys() {
    return ["approve", "submit", "reject", "return"];
  }

  @Watch("value", { immediate: true })
  valueChanged() {
    const rowData: any[] = this.value || [];
    if (rowData.length == 0) {
      rowData.push({});
    }
    this.rowData = rowData.map(item => Object.assign({}, item));
  }

  newOutgoingNameRules(index: number) {
    return [
      {
        validator: (rule: any, value: any, callback: any) => {
          try {
            this.validateOutgoingName(index);
            callback();
          } catch (e) {
            callback(e);
          }
        },
        trigger: "blur",
      },
    ];
  }

  handleOutgoingChanged(index: number, row: any, outgoingKey: any) {
    if (this.defaultOutgoingKeys.indexOf(outgoingKey) < 0) {
      row.key = StringUtil.uuid();
      row.name = outgoingKey;
    } else if (outgoingKey) {
      row.key = outgoingKey;
      row.name = defaultOutgoings[outgoingKey];
    }
    this.rowData.splice(index, 1, row);
    console.log("handleOutgoingChanged", this.rowData);
    this.$nextTick(() => {
      this.ignoreEmpty = true;
      this.$refs.form.validate(() => {
        this.ignoreEmpty = false;
      });
    });
  }

  validateOutgoingName(index: number) {
    if (!this.rowData) return;
    const { key, name } = this.rowData[index];
    if (name === undefined || name === null || name === "") {
      if (!this.ignoreEmpty) {
        throw new Error(`请填写操作名称`);
      }
    }
    const duplicateIndex = this.rowData.findIndex((item, i) => key && item.key === key && i < index);
    if (duplicateIndex >= 0) {
      throw new Error(`操作不能同行${duplicateIndex + 1}相同`);
    }
  }

  appendOutgoing(index: number) {
    this.rowData.splice(index + 1, 0, {});
  }

  moveUpOutgoing(index: number) {
    const arr: any[] = this.rowData.splice(index, 1);
    this.rowData.splice(index - 1, 0, ...arr);
  }

  moveDownOutgoing(index: number) {
    const arr: any[] = this.rowData.splice(index, 1);
    this.rowData.splice(index + 1, 0, ...arr);
  }

  handleBizActionChanged(event: any, row: any) {
    if (event) {
      row.bizAction = event;
    } else {
      row.bizAction = null;
    }
  }

  doConfirm() {
    this.$refs.form.validate((valid: boolean) => {
      if (!valid) {
        return;
      }
      this.controller.ok(this.rowData);
    });
  }
}
