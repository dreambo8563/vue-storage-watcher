[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3b39774059a445f19dcccc5d5ba01a23)](https://app.codacy.com/app/dreambo8563/vue-storage-watcher?utm_source=github.com&utm_medium=referral&utm_content=dreambo8563/vue-storage-watcher&utm_campaign=Badge_Grade_Dashboard)
[![Build Status](https://travis-ci.com/dreambo8563/vue-storage-watcher.svg?branch=master)](https://travis-ci.com/dreambo8563/vue-storage-watcher) [![Greenkeeper badge](https://badges.greenkeeper.io/dreambo8563/vue-storage-watcher.svg)](https://greenkeeper.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Known Vulnerabilities](https://snyk.io/test/github/dreambo8563/vue-storage-watcher/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dreambo8563/vue-storage-watcher?targetFile=package.json)

# vue-storage-watcher

the real reactive watcher for localStorge.
I search a few days for a lib to watch the ls, but failed.

you can use this tiny ls wrapper which works well with vue.js.

you can use this as persistent data layer even instead of vuex.

- familiar usage just like **bus**.
- reactive
- type supported
- small size

TODO:

- [x] support sessionStorage

### Install

> npm install vue-storage-watcher --save

### Sample

```js
import lsWatcher from "vue-storage-watcher"

Vue.use(lsWatcher, { prefix: "myproject_" })
```

> storage type

- localStorage
- sessionStorage

### Options

- prefix => default is ""
- storage => default is "local" which means window.localStorage will be used as Storage Object. Another alternative is "session"

### Methods

this.\$ls or this.\$ss in Component context for localStorage/sessionStorage

> I will list basic api just with ls.

#### set

```js
this.$ls.set("token", "abccc")
```

the value will be saved in storage with the **prefix** + key
and emit the changes to all the subscribers.

> you also can give the key an expire duration with the unit of ms

```js
this.$ls.set("token", "abccc", 3000)
```

the key will be expried in 3s, you will get null after that.

#### get

```js
this.$ls.get("token", "default")
```

get the value with a default return value if it's not existed

#### subscribe the key

```js
this.$ls.on("token", callback)
```

subscribe the key in the storage, will trigger the callback function if any changes happen.

the return value is the handler need to be used to unsubscribe

> tricky
> there is an immediate options as a third args which will trigger cb immediate if set **true**

```js
this.$ls.on("token", callback, true)
```

#### unsubscribe the key

```js
const handler = this.$ls.on("token", cb)
this.$ls.off("token", handler)
```

> please make sure you unsubscribe beforeDestroy the component

#### remove

```js
this.$ls.remove("token")
```

remove will delete the key in storage and emit all the subscribers with **null** value

#### clear

```js
this.$ls.clear()
```

delete all the keys with your **prefix**. and all the subscribers will **not** receive changes any more

#### init

```js
this.$ls.init()
```

init will set all your current localStorge keys into the plugins

- add prefix for all the keys

and then you can use **get** and **on** mehtod to make them reactive

### FAQ

- if you want to using localStorage and sessionStorage at same page, pls use the plugin as following

```js
import lsWatcher from "vue-storage-watcher"

Vue.use({ ...lsWatcher }, { prefix: "myproject_" })

Vue.use({ ...lsWatcher }, { prefix: "myproject_ss_", stroage: "session" })
```
