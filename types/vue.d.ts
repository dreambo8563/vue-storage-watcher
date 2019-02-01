import Vue, { VueConstructor } from "vue";
import { ILSWatcher } from "./main";
declare module "vue/types/vue" {
  interface Vue {
    $ls: ILSWatcher;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    $ls?: ILSWatcher;
  }
}

export { VueConstructor };
export default Vue;
