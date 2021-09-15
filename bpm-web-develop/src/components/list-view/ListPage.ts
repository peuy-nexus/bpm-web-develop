import { Component, Vue } from "vue-property-decorator";
import StringUtil from "@/components/waltz-vue/utils/StringUtil";

@Component
export default class ListPage extends Vue {
  rowData: any[] = [];
  rowTotal: any = 0;
  filterParams: { [index: string]: any } = {};
  filterObject: any = {};
  fixedFilterObject: any = {};
  selectedRows: any[] = [];
  $refs: any;
  $url: any;

  mounted(): void {
    this.refreshQuery();
  }

  /**
   * 列表选中
   */
  handleSelectRowChange(e: any) {
    this.selectedRows = e;
  }

  refreshQuery() {
    if (this.$route.query && StringUtil.toBool(this.$route.query.keepSearch)) {
      this.byLastQuery();
    } else {
      this.byFactQuery();
    }
  }

  /**
   * 根据上一次搜索
   */
  byLastQuery() {
    if (!this.$refs.listView) return;
    this.getQueryParams().then(queryParams => {
      Object.assign(this, queryParams);
      this.$refs.listView.reset();
    });
  }

  /**
   * 根据当前搜索
   */
  byFactQuery() {
    this.doSearch();
  }

  doSearch(e: any | undefined = undefined) {
    if (e) {
      if (e.filterObject) this.filterObject = e.filterObject;
      if (e.filterParams) this.filterParams = e.filterParams;
      if (e.fixedFilterObject) this.fixedFilterObject = e.fixedFilterObject;
    }
    this.$refs.listView.reset();
  }

  /**
   * 重置按钮事件
   */
  doReset() {
    this.$refs.listView.queryParam = Object.assign(this.$refs.listView.queryParam, { filters: [] });
    this.filterParams = {};
    this.filterObject = {};
    this.doSearch();
  }

  doListLoad(param: any = {}) {
    if (this.$refs.queryCondition) {
      this.$refs.queryCondition
        .validate()
        .then(() => {
          this.saveQueryParams(param);
          this.$url.setParamNoRefresh("keepSearch", true);
          this.onQuery(param);
        })
        .catch(this.$error);
    } else {
      this.saveQueryParams(param);
      this.$url.setParamNoRefresh("keepSearch", true);
      this.onQuery(param);
    }
  }

  getQueryName() {
    return this.$route.name;
  }

  getQueryParams() {
    return new Promise(resolve => {
      const name: any = this.getQueryName();
      this.openDb().then((indexedDB: any) => {
        indexedDB
          .transaction(["queryParams"])
          .objectStore("queryParams")
          .get(name).onsuccess = (event: any) => {
          const queryParams = event.target.result;
          resolve(queryParams);
          // let searchModel = event.target.result || {};
          // assign 最后调用grid进行设置sortModel时，触发表格排序后，执行搜索
          indexedDB.close();
        };
      });
    });
  }

  saveQueryParams(param: any) {
    const queryParams: any = {
      name: this.getQueryName(),
      filterParams: this.filterParams,
      filterObject: this.filterObject,
      fixedFilterObject: this.fixedFilterObject,
      page: param.page || 0,
      pageSize: param.pageSize || 10,
    };
    this.openDb().then((indexedDB: any) => {
      indexedDB
        .transaction(["queryParams"], "readwrite")
        .objectStore("queryParams")
        .put(queryParams);
      indexedDB.close();
    });
  }

  openDb() {
    return new Promise(resolve => {
      const request = window.indexedDB.open("sop");
      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };
      request.onupgradeneeded = (event: any) => {
        const indexedDB = event.target.result;
        if (!indexedDB.objectStoreNames.contains("queryParams")) {
          indexedDB.createObjectStore("queryParams", { keyPath: "name" });
        }
      };
    });
  }
}
