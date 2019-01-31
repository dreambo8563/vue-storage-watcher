[![Build Status](https://travis-ci.com/dreambo8563/vue-storage-watcher.svg?branch=master)](https://travis-ci.com/dreambo8563/vue-storage-watcher) [![Greenkeeper badge](https://badges.greenkeeper.io/dreambo8563/vue-storage-watcher.svg)](https://greenkeeper.io/)

# vue-storage-watcher

the real reactive watcher for localStorge.
I search a while for a lib to make the ls reactive, but failed.

you can using the tiny ls wrapper to work in vue.js well.

familiar usage just like **bus**.

### Install

> npm install vue-storage-watcher --save

### Sample

```js
import lsWatcher from "vue-storage-watcher"

Vue.use(lsWatcher, { prefix: "myproject_" })
```

> storage type

- localStorage

### Methods

Vue.ls in global or this.\$ls in Component context

#### set

```js
this.$ls.set("token", "abccc")
```

the value will be save in storage with the **prefix** + key
and emit the change value to all the subscriber of this key

> you also can give the key an expire duration with unit of ms

```js
this.$ls.set("token", "abccc", 3000)
```

the will be expried in 3s, you will get null after that.

#### get

```js
this.$ls.get("token", "default")
```

get the value with a default return value when not exist

#### subscribe the key

```js
this.$ls.on("token", callback)
```

subscribe the key in the storage, will trigger the callback function if any changes happen with the key

the return value is the handler need to be used to unsubscribe

#### unsubscribe the key

```js
const handler = this.$ls.on("token", cb)
this.$ls.off("token", handler)
```

please make sure you unsubscribe beforeDestroy the component

#### remove

```js
this.$ls.remove("token")
```

remove will delete the key in storage and tell all the subscriber with **null** value

#### clear

```js
this.$ls.clear()
```

del all the key with your **prefix**. and all the subscribers can **not** receive changes

#### init

```js
this.$ls.init()
```

init will set all your current localStorge keys into the plugins

- add prefix for all the keys

and then you can using get and on mehtod to make it reactive

###

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
