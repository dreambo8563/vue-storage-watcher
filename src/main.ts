import Vue, { VueConstructor } from "vue";

export type lsOption = {
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
class LSWatcher {
  // internal event queue 内置事件队列
  private queue: Map<string, Map<Symbol, Function>> = new Map();
  private prefix: string;
  private storageObj: Storage;
  constructor(options: lsOption) {
    const { prefix, storage } = options;
    this.prefix = prefix || "";
    const storagePrefix = storage || "local";
    if (["local", "session"].indexOf(storagePrefix) === -1) {
      throw new Error("storage param should be 'local' or 'session'");
    }
    switch (storagePrefix) {
      case "session":
        this.storageObj = window.sessionStorage;
        break;
      default:
        this.storageObj = window.localStorage;
        break;
    }
  }
  // 注册事件
  // register the event of the key
  on(key: string, fn: Function, immediate: boolean = false): Symbol {
    if (typeof fn !== "function") {
      throw new Error("the second arg should be the callback function");
    }
    const handler = Symbol(fn.name);
    const keyInQueue = this.queue.get(this.prefix + key);
    if (keyInQueue) {
      keyInQueue!.set(handler, fn);
    } else {
      this.queue.set(this.prefix + key, new Map().set(handler, fn));
    }
    if (immediate) {
      fn(this.get(key));
    }
    return handler;
  }
  //赋值
  set(key: string, payload: any, expire: number | null = null): void {
    // 先存入 ls
    // save into storage
    const stringifyValue = JSON.stringify({
      value: payload,
      expire: expire !== null ? new Date().getTime() + expire : null
    });
    this.storageObj.setItem(this.prefix + key, stringifyValue);
    // 通知订阅者
    // inform subscribers
    this.broadcast(this.prefix + key, payload);
  }
  broadcast(key: string, payload: any = null): void {
    if (this.queue.get(key) != undefined) {
      for (const iterator of this.queue.get(key)!.values()) {
        setTimeout(() => {
          iterator(payload);
        }, 0);
      }
    }
  }
  broadcastAll(payload: any = null): void {
    for (const [key, value] of this.queue.entries()) {
      for (const iterator of value.values()) {
        setTimeout(() => {
          iterator(payload);
        }, 0);
      }
    }
  }
  /**
   * 是否有人订阅了这个key
   * check if there is any subscriber of the key
   *
   * @param {string} key
   * @returns {boolean}
   * @memberof LSWatcher
   */
  has(key: string): boolean {
    return this.queue.has(this.prefix + key);
  }

  /**
   * Clear storage
   */
  clear(): void {
    if (this.storageObj.length === 0) {
      return;
    }

    const removedKeys: string[] = this.keys();
    for (const key of removedKeys) {
      this.storageObj.removeItem(key);
    }
    this.broadcastAll(null);
    this.queue.clear();
  }
  /**
   * query all the keys stored in watccher
   *
   * @returns {string[]}
   * @memberof LSWatcher
   */
  keys(): string[] {
    const regexp = new RegExp(`^${this.prefix}.+`, "i");
    const myKeys: string[] = [];
    for (const k of Object.keys(this.storageObj)) {
      if (regexp.test(k) === false) {
        continue;
      }
      myKeys.push(k);
    }
    return myKeys;
  }
  // 获取值
  get(key: string, def = null): any {
    const item = this.storageObj.getItem(this.prefix + key);

    if (item == null) {
      return def;
    }
    try {
      const data = JSON.parse(item);

      if (data.expire === null) {
        return data.value;
      }

      if (data.expire >= new Date().getTime()) {
        return data.value;
      }
      this.remove(key);
    } catch {
      return def;
    }
  }
  /**
   * if the key non-exist / no expire time / already expired  return -1,
   * else return remaining lifetime with unit of ms
   *
   * @param {string} key
   * @returns {number}
   * @memberof LSWatcher
   */
  ttl(key: string): number {
    const item = this.storageObj.getItem(this.prefix + key);
    if (item == null) {
      return -1;
    }
    try {
      const data = JSON.parse(item);
      if (data.expire >= new Date().getTime()) {
        return data.expire - new Date().getTime();
      }
      return -1;
    } catch {
      return -1;
    }
  }
  init(): void {
    const keys = Object.keys(this.storageObj);

    for (const k of keys) {
      const item = this.storageObj.getItem(k);

      if (item !== null) {
        try {
          const v = JSON.parse(item);
          this.set(k, v);
        } catch (error) {
          this.set(k, item);
        }
      } else {
        this.set(k, null);
      }
    }
  }
  /**
   * Remove item
   *
   * @param {string} name
   * @return {boolean}
   */
  remove(key: string): void {
    this.storageObj.removeItem(this.prefix + key);
    this.broadcast(this.prefix + key);
  }
  // 取消订阅 - unsubscribe
  off(key: string, handler: Symbol): void {
    this.queue.get(this.prefix + key)!.delete(handler);
  }
}
// 暂时只用单例 - single instance
export type LsWatcherPlugin = {
  install(vue: VueConstructor<Vue>, options: lsOption): void;
};
const instantce: LsWatcherPlugin = {
  install(vue, options) {
    let alias = "$ls";
    if (options.storage == "session") {
      alias = "$ss";
    }
    const storage = new LSWatcher(options) as ILSWatcher;
    vue.prototype[alias] = storage;
    Object.defineProperty(Vue, `${alias}`, {
      get() {
        return storage;
      }
    });
  }
};
export default instantce;

export { ILSWatcher };
