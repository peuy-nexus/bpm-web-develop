import { Component, Vue } from "vue-property-decorator";
import { Action, State } from "vuex-class";

@Component({
  name: "App",
})
export default class Login extends Vue {
  $refs: any;

  @Action("lang") setLang: (lang: any) => void;

  mounted() {
    this.setLang(navigator.language.toLowerCase());
    console.log("query", this.$route.query);
  }
}
