import Vue from "vue";
import "./bpmn/index";
import "./fant-ui";
import "./bpm";

import WaltzVue from "./waltz-vue/index";
// import editor from "./editor/editor.vue";
import DetailCard from "./detail-card/DetailCard.vue";
import ListView from "./list-view/ListView.vue";
import InfoItem from "@/components/info-item/InfoItem.vue";
import PageWrapper from "./page-wrapper/PageWrapper.vue";
import QueryCondition from "./query-condition/QueryCondition.vue";
import PopoverButton from "@/components/popover-button/PopoverButton.vue";

import AppSystemSearch from "@/components/app-system/AppSystemSearch.vue";
import AuthLink from "@/components/auth-link/AuthLink.vue";
import RoleSearch from "@/components/identity/role/RoleSearch.vue";
import PostSearch from "@/components/identity/post/PostSearch.vue";
import DepartmentSearch from "@/components/identity/department/DepartmentSearch.vue";
import ResourceModuleSelect from "@/components/resource-module/ResourceModuleSelect.vue";

declare module "vue/types/vue" {
  interface Vue {
    [keyword: string]: any;
  }
}

Vue.use(WaltzVue);

// Vue.component("editor", editor);
Vue.component("DetailCard", DetailCard);
Vue.component("ListView", ListView);
Vue.component("InfoItem", InfoItem);
Vue.component("PageWrapper", PageWrapper);
Vue.component("QueryCondition", QueryCondition);
Vue.component("PopoverButton", PopoverButton);

Vue.component("AppSystemSearch", AppSystemSearch);
Vue.component("AuthLink", AuthLink);
Vue.component("RoleSearch", RoleSearch);
Vue.component("PostSearch", PostSearch);
Vue.component("DepartmentSearch", DepartmentSearch);
Vue.component("ResourceModuleSelect", ResourceModuleSelect);
