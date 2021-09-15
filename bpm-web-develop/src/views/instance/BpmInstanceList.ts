import ListPage from "@/components/list-view/ListPage";
import { Component } from "vue-property-decorator";
import ConstantMgr from "@/mgr/ConstantMgr";
import i18n from "@/i18n";
import BpmGroupTree from "@/views/definition/components/BpmGroupTree.vue";
import stateMap from "@/views/definition/BpmDefinitionStateMap";
import BpmInstanceApi from "@/http/bpm/BpmInstanceApi";
import ResourceModuleApi from "@/http/bpm/ResourceModuleApi";
import UserApi from "@/http/bpm/UserApi";

@Component({
  name: "BpmInstanceList",
  components: {
    BpmGroupTree,
  },
  filters: {
    state: (value: any) => {
      return i18n.t(stateMap.get(value)) || "--";
    },
  },
})
export default class BpmInstanceList extends ListPage {
  currentGroup: any = null;
  filterObject: any = {
    starter: null,
    startModule: null,
  };

  doView(row: any) {
    this.$router.push({ name: "BpmInstanceView", query: { uuid: row.uuid } });
  }

  doListLoad(param: any = {}) {
    const loading = this.$loading(ConstantMgr.loadingOption);
    for (const key in this.filterParams) {
      const value = this.filterParams[key];
      if (Array.isArray(value)) {
        if (value.length) {
          param.filters.push({ property: key, value });
        }
      } else if (value !== undefined && value !== null && value !== "") {
        param.filters.push({ property: key, value });
      }
    }
    BpmInstanceApi.query(param)
      .then((resp: any) => {
        loading.close();
        this.rowData = resp.data.records;
        this.rowTotal = resp.data.recordCount;
      })
      .catch(error => {
        loading.close();
        this.$error(error);
      });
  }

  doDelete(row: any) {
    const loading = this.$loading(ConstantMgr.loadingOption);
    BpmInstanceApi.delete({
      uuid: row.uuid,
    })
      .then((res: any) => {
        loading.close();
        this.refreshQuery();
      })
      .catch((error: any) => {
        loading.close();
        this.$error(error);
      });
  }

  doCancel(row: any) {
    //待定，看接口文档应该需要上传附件和留言
    const loading = this.$loading(ConstantMgr.loadingOption);
    BpmInstanceApi.cancel({
      attachments: [
        {
          description: "",
          fileId: "",
          fileSize: 0,
          fileUrl: "",
          name: "",
          temporary: true,
          uuid: "",
        },
      ],
      comment: "",
      uuid: row.uuid,
    })
      .then(() => {
        loading.close();
        this.refreshQuery();
      })
      .catch((error: any) => {
        loading.close();
        this.$error(error);
      });
  }

  doStart(row: any) {
    const loading = this.$loading(ConstantMgr.loadingOption);
    BpmInstanceApi.start({
      businessKey: row.businessKey,
      orgId: row.orgId,
      processDefinitionKey: row.processDefinitionKey,
      variables: row.variables,
    })
      .then((res: any) => {
        loading.close();
        this.refreshQuery();
      })
      .catch((error: any) => {
        loading.close();
        this.$error(error);
      });
  }

  currentGroupChanged(currentGroup: any) {
    this.filterParams["group.uuid:="] = currentGroup.uuid === "-" ? "" : currentGroup.uuid;
    this.$refs.listView.load();
  }

  queryStartModule(data: any) {
    const param: any = {};
    param.page = data.page;
    param.pageSize = 50;
    param.keyword = data.keyword;
    param.sorters = [{ direction: "filDate", property: "desc" }];
    return ResourceModuleApi.query(param);
  }

  queryStarter(data: any) {
    const param: any = {};
    param.page = data.page;
    param.pageSize = 50;
    param.keyword = data.keyword;
    param.sorters = [{ direction: "filDate", property: "desc" }];
    return UserApi.query(param);
  }

  handleCreateTimeChange(e: any) {
    if (e) {
      // this.filterParams["lastModified:[,]"] = [e[0], DateUtil.endOf(e[1], DateUtil.DAY)];
    }
  }
}
