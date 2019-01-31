import { VueConstructor } from "vue";

type lsOption = {
  prefix: string;
};
class LSWatcher {
  // 内置事件队列
  private queue: Map<string, Map<Symbol, Function>> = new Map();
  private prefix = "";
  constructor(options: lsOption) {
    this.prefix = options.prefix || "";
  }
  // 注册事件
  on(key: string, fn: Function) {
    const handler = Symbol(fn.name);
    if (this.queue.get(this.prefix + key)) {
      this.queue.get(this.prefix + key)!.set(handler, fn);
    } else {
      this.queue.set(this.prefix + key, new Map().set(handler, fn));
    }
    return handler;
  }
  //赋值
  set(key: string, payload: any, expire: number | null = null) {
    // 先存入 ls
    const stringifyValue = JSON.stringify({
      value: payload,
      expire: expire !== null ? new Date().getTime() + expire : null
    });
    window.localStorage.setItem(this.prefix + key, stringifyValue);
    // 通知订阅者
    this.broadcast(this.prefix + key, payload);
  }
  broadcast(key: string, payload: any = null) {
    if (this.queue.get(key) != undefined) {
      for (const iterator of this.queue.get(key)!.values()) {
        setTimeout(() => {
          iterator(payload);
        }, 0);
      }
    }
  }
  broadcastAll(payload: any = null) {
    for (const [key, value] of this.queue.entries()) {
      for (const iterator of value.values()) {
        setTimeout(() => {
          iterator(payload);
        }, 0);
      }
    }
  }
  has(key: string): boolean {
    return this.queue.has(this.prefix + key);
  }

  /**
   * Clear storage
   */
  clear() {
    if (window.localStorage.length === 0) {
      return;
    }
    const regexp = new RegExp(`^${this.prefix}.+`, "i");
    const removedKeys: string[] = [];
    for (const k of Object.keys(window.localStorage)) {
      if (regexp.test(k) === false) {
        continue;
      }
      removedKeys.push(k);
    }
    for (const key of removedKeys) {
      window.localStorage.removeItem(key);
    }
    this.broadcastAll(null);
    this.queue.clear();
  }
  // 获取值
  get(key: string, def = null) {
    const item = window.localStorage.getItem(this.prefix + key);

    if (item !== null) {
      try {
        const data = JSON.parse(item);

        if (data.expire === null) {
          return data.value;
        }

        if (data.expire >= new Date().getTime()) {
          return data.value;
        }
        window.localStorage.removeItem(this.prefix + key);
      } catch (err) {
        return def;
      }
    }

    return def;
  }
  init(): void {
    const keys = Object.keys(window.localStorage);

    for (const k of keys) {
      const item = window.localStorage.getItem(k);

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
    window.localStorage.removeItem(this.prefix + key);
    this.broadcast(this.prefix + key);
  }
  // 取消订阅
  off(key: string, handler: Symbol) {
    this.queue.get(this.prefix + key)!.delete(handler);
  }
}
// 暂时只用单例

export default {
  install(Vue: VueConstructor, options: lsOption) {
    Vue.prototype.$ls = new LSWatcher(options);
  }
};
