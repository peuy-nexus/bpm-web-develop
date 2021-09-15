import { Component, Prop, Vue } from "vue-property-decorator";
import i18n from "@/i18n";
import identityTypeMap from "@/components/identity/IdentityTypeMap";
import IdentitySelect from "@/components/identity/IdentitySelect.vue";
import UserSelectDialog from "@/components/identity/user/UserSelectDialog.vue";
import RoleSelectDialog from "@/components/identity/role/RoleSelectDialog.vue";
import PostSelectDialog from "@/components/identity/post/PostSelectDialog.vue";
import DepartmentSelectDialog from "@/components/identity/department/DepartmentSelectDialog.vue";

const identityDialog: any = {
  user: UserSelectDialog,
  role: RoleSelectDialog,
  post: PostSelectDialog,
  department: DepartmentSelectDialog,
};

@Component({
  name: "IdentityPickDialog",
  components: {
    IdentitySelect,
  },
  filters: {
    identityType: (value: string) => {
      return i18n.t(identityTypeMap.get(value)) || "--";
    },
  },
})
export default class IdentityPickDialog extends Vue {
  @Prop({ type: Boolean }) visible: boolean;
  @Prop({ type: Function }) onSave: any;

  formData: any = {
    identities: [],
  };
  rules: any = {
    identityType: [
      {
        required: true,
        message: this.$t("流程中心.流程定义/身份/类型/输入提示", { 0: this.$t("流程中心.流程定义/身份/类型") }),
        trigger: ["blur"],
      },
    ],
  };
  $refs: any;

  get identityTypeKeys() {
    return [...identityTypeMap.keys()];
  }

  handleIdentityTypeChanged() {
    this.rules.identities = [
      {
        required: true,
        message: this.$t("流程中心.流程定义/身份/类型/输入提示", {
          0: this.$t(identityTypeMap.get(this.formData.identityType)),
        }),
        trigger: ["blur"],
      },
    ];
  }

  doSelectIdentity() {
    this.$dialog
      .show(identityDialog[this.formData.identityType], {
        title: this.$t("流程中心.流程定义/身份/类型/输入提示", {
          0: this.$t(identityTypeMap.get(this.formData.identityType)),
        }),
        selectedList: this.formData.identities,
      })
      .then((res: any) => {
        if (!res.wasCancelled) {
          this.formData.identities = res.output;
        }
      });
  }

  doConfirm() {
    this.$refs.form.validate((valid: boolean) => {
      if (!valid) {
        return;
      }

      const list = this.formData.identities.map((item: any) =>
        Object.assign({ identityType: this.formData.identityType }, item),
      );
      this.onSave(list).then((res: any) => {
        this.controller.ok(res);
      });
    });
  }
}
