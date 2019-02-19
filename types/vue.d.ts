import Vue, { VueConstructor } from "vue";
import { ILSWatcher } from "./main";
declare module "vue/types/vue" {
  interface Vue {
    $ls: ILSWatcher;
    $ss: ILSWatcher;
  }
  interface VueConstructor {
    $ls: ILSWatcher;
    $ss: ILSWatcher;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    $ls?: ILSWatcher;
    $ss?: ILSWatcher;
  }
}

export { VueConstructor };
export default Vue;
