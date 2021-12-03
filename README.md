[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3b39774059a445f19dcccc5d5ba01a23)](https://app.codacy.com/app/dreambo8563/vue-storage-watcher?utm_source=github.com&utm_medium=referral&utm_content=dreambo8563/vue-storage-watcher&utm_campaign=Badge_Grade_Dashboard)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
[![Build Status](https://travis-ci.com/dreambo8563/vue-storage-watcher.svg?branch=master)](https://travis-ci.com/dreambo8563/vue-storage-watcher) [![Greenkeeper badge](https://badges.greenkeeper.io/dreambo8563/vue-storage-watcher.svg)](https://greenkeeper.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Known Vulnerabilities](https://snyk.io/test/github/dreambo8563/vue-storage-watcher/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dreambo8563/vue-storage-watcher?targetFile=package.json)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdreambo8563%2Fvue-storage-watcher.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdreambo8563%2Fvue-storage-watcher?ref=badge_shield)
![npm type definitions](https://img.shields.io/npm/types/vue-storage-watcher.svg?style=flat)
![npm](https://img.shields.io/npm/dt/vue-storage-watcher.svg?style=flat)

# vue-storage-watcher

## For Vue3 => https://github.com/dreambo8563/vue-storage-watcher
![](https://raw.githubusercontent.com/dreambo8563/static-assets/master/watcher1.png)

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
- [x] logo design
- [x] ttl method like redis to get remaining lifetime in ms
- [ ] show usage with github pages maybe

### Install

> npm install vue-storage-watcher --save

### Sample

```js
import lsWatcher from 'vue-storage-watcher';

Vue.use(lsWatcher, { prefix: 'myproject_' });
```

> storage type

- localStorage
- sessionStorage

### Options

- prefix => default is ""
- storage => default is "local" which means window.localStorage will be used as Storage Object. Another alternative is "session"

### Methods

this.\$ls or this.\$ss in Component context for localStorage/sessionStorage
Vue.\$ls or Vue.\$ss in global.

> I will list basic api just with ls.

#### set

```js
this.$ls.set('token', 'abccc');
```

the value will be saved in storage with the **prefix** + key
and emit the changes to all the subscribers.

> you also can give the key an expire duration with the unit of ms

```js
this.$ls.set('token', 'abccc', 3000);
```

the key will be expried in 3s, you will get null after that.

#### ttl

ttl will return **-1** if one of the following scenarios happen:

- the key is non-exist
- the key is already expired
- the key has no expire time

else return the remaining lifetime with ms as the unit

```js
this.$ls.ttl('token');
```

#### get

```js
this.$ls.get('token', 'default');
```

get the value with a default return value if it's not existed

#### keys

```js
this.$ls.keys();
```

get all keys stored in the storage.

#### subscribe the key

```js
this.$ls.on('token', callback);
```

subscribe the key in the storage, will trigger the callback function if any changes happen.

the return value is the handler need to be used to unsubscribe

> tricky
> there is an immediate options as a third args which will trigger cb immediate if set **true**

```js
this.$ls.on('token', callback, true);
```

#### unsubscribe the key

```js
const handler = this.$ls.on('token', cb);
this.$ls.off('token', handler);
```

> please make sure you unsubscribe beforeDestroy the component

#### remove

```js
this.$ls.remove('token');
```

remove will delete the key in storage and emit all the subscribers with **null** value

#### clear

```js
this.$ls.clear();
```

delete all the keys with your **prefix**. and all the subscribers will **not** receive changes any more

#### init

```js
this.$ls.init();
```

init will set all your current localStorge keys into the plugins

- add prefix for all the keys

and then you can use **get** and **on** mehtod to make them reactive

### FAQ

- if you want to using localStorage and sessionStorage at same page, pls use the plugin as following

```js
import lsWatcher from 'vue-storage-watcher';

Vue.use({ ...lsWatcher }, { prefix: 'myproject_' });

Vue.use({ ...lsWatcher }, { prefix: 'myproject_ss_', storage: 'session' });
```

- possibly polyfill

```js
// wather polyfill for IE 11
import 'core-js/fn/symbol';
import 'core-js/fn/map';
```

- possibly polyfill

```js
// wather polyfill for IE 11
import "core-js/fn/symbol"
import "core-js/fn/map"
```

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdreambo8563%2Fvue-storage-watcher.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdreambo8563%2Fvue-storage-watcher?ref=badge_large)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/6948318?v=4" width="100px;" alt="Vincent Guo"/><br /><sub><b>Vincent Guo</b></sub>](https://dreambo8563.github.io/)<br />[💻](https://github.com/dreambo8563/vue-storage-watcher/commits?author=dreambo8563 "Code") [📖](https://github.com/dreambo8563/vue-storage-watcher/commits?author=dreambo8563 "Documentation") [🐛](https://github.com/dreambo8563/vue-storage-watcher/issues?q=author%3Adreambo8563 "Bug reports") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
