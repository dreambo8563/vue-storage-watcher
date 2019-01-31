import Vue, { VueConstructor } from "vue";
declare const LsWatcher: {
  install(
    vue: VueConstructor<Vue>,
    options: {
      prefix: string;
    }
  ): void;
};
export default LsWatcher;
