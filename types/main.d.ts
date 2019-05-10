import Vue, { VueConstructor } from "./vue";
export declare type lsOption = {
  prefix?: string;
  storage?: "local" | "session";
};
interface ILSWatcher {
  on(key: string, fn: Function, immediate?: boolean): Symbol;
  set(key: string, payload: any, expire?: number | null): void;
  broadcast(key: string, payload?: any): void;
  broadcastAll(payload?: any): void;
  has(key: string): boolean;
  clear(): void;
  get(key: string, def?: any): any;
  keys(): string[];
  init(): void;
  remove(key: string): void;
  off(key: string, handler: Symbol): void;
  ttl(key: string): number;
}
export declare type LsWatcherPlugin = {
  install(vue: VueConstructor<Vue>, options: lsOption): void;
};
declare const instantce: LsWatcherPlugin;
export default instantce;
export { ILSWatcher };
