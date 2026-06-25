---
title: 'Vue-SSR: head Mixin 实现头部信息管理'
description: '基于 Vue SSR 项目改造 title mixin，用统一的 head mixin 管理 title、description、author 和 keywords。'
date: 2018-10-23
lang: zh
category: '前端工程'
tags: ['Vue', 'SSR', 'Mixin']
---

> 上周发了我第一篇技术博客，**传送门1：[JS中的数组过滤，从简单筛选到多条件筛选](https://juejin.im/post/5bc44a71e51d450e935caa11)**，感谢大家的支持，尤其是提出疑问，发现错误的同学，感谢你们。发完博客以后，我用 hexo 搭了一个 github pages, 绑定了我之前买的域名，**传送门2： [http://blog.yidol.cn/](http://blog.yidol.cn/)**，以后我的博客会在GitHub发一遍，然后掘金抄送一遍。
>
> 近两个月都在忙着搭建 vue-ssr 的项目，因为公司产品是媒体类，SEO 很重要，第一周是尝试用 nuxt 搭建了一个项目，nuxt 确实是开箱即用，比较爽，就是配置的时候可能要看看 nuxt 的文档，还要看看 webpack 的文档，很多人使用 vue-cli3 产生了同样的感受。由于公司给的时间也够，我决定参考尤雨溪的官方例子🌰 **传送门3: [vue-hacknews-2.0](https://github.com/vuejs/vue-hackernews-2.0)** 搭建了我司的新 PC 端项目，整个项目是用 webpack4+vue2+vue-ssr 从 0 到 1，踩过一些坑，多谢网上各个平台的同学们贡献的文章，我打算陆续写文章分享项目搭建的过程，希望也能够帮助到大家。

下面进入这篇文章的主题，尤大大的例子里是做了一个 tilte 的 Mixin 方法，可以修改各个页面的 title，但是我司的需求可能是不同的页面不仅是要不同的 title，还要不同的 description，author，keywords，网上有很多人使用 vue-meta, 感兴趣的小伙伴可以搜索一下用法，今天我想讨论的是改造尤大大项目里的 title mixin 为 head mixin，满足我司需求。

### 尤大大的title mixin

打开 vue-hacknews 项目 `src/util/title.js` ,可以看到以下代码或者 **传送门4: [vue SSR 指南 Head 管理](https://ssr.vuejs.org/zh/guide/head.html)**

```javascript
// 获取模版里的 title
function getTitle(vm) {
  const { title } = vm.$options;
  if (title) {
    return typeof title === 'function' ? title.call(vm) : title;
  }
}

// 如果有 title 了就加载新的 title，没有就还有默认的顶着，默认的 title 在哪里，稍后告诉你
// 下面俩一个是服务器端渲染时调用，一个是客户端渲染是调用，为啥俩不一样，可查看文末知识点

const serverTitleMixin = {
  created() {
    const title = getTitle(this);
    if (title) {
      this.$ssrContext.title = `Vue HN 2.0 | ${title}`;
    }
  },
};

const clientTitleMixin = {
  mounted() {
    const title = getTitle(this);
    if (title) {
      document.title = `Vue HN 2.0 | ${title}`;
    }
  },
};

export default process.env.VUE_ENV === 'server'
  ? serverTitleMixin
  : clientTitleMixin;
```

文件 `src/app.js` 在这里全局引入 Mixin

```javascript
...
import titleMixin from './util/title'
...
// mixin for handling title
Vue.mixin(titleMixin)
...

```

这里是默认 title 的地方`src/server.js`

```javascript
...
//在render函数里
  const context = {
    title: 'Vue HN 2.0', // default title
    url: req.url
  }
...

```

具体组件里的用法 `src/views/UserView.vue`

```javascript
export default {
  name: 'user-view',
  ...
  title () {
    return this.user
      ? this.user.id
      : 'User not found'
  },
  ...
}

```

### Head Mixin的改造过程

首先是明确我的需求，如文章开头所说，仅仅是 title 是不符合我的需求的，我还需要能够自定义 description，author，keywords。

#### 组件里用法

尤大大的 title 是返回一个字符串，我把我需要的塞到了一个对象里，需要自定义的就 return 出去，不需要的就还是默认的就行。

```javascript
export default {
  name: 'article-list',
  ...
  head(){
      return {
        'title': '文章列表',
        'author': '大侠'
      };
    },
  ...
}

```

#### 默认的头信息

同样在 `server.js` 里

```javascript
// 同样也在render 函数里
const context = {
  title: '可爱王', // 默认title
  author: 'Anne', // 默认author
  keywords: '我是keywords', // 默认keywords
  description: '我是description', //默认description
  url: req.url, // 我是重要的一行代码，但是我跟这篇文章没关系
}; // 没错我很无聊，打了这么多无聊的注释
```

#### 引入全局head mixin

同样在 `src/main.js` 里

```javascript
import headMixin from './utils/head';
// head()
Vue.mixin(headMixin);
```

#### 定义head Mixin

在 `src/utils/head.js` 里，在这里是判断了是否有 head，是否有各个我需要的东西，有就加载新的，没有就还是默认的。

```javascript
function getHead(vm) {
  const { head } = vm.$options;

  if (head) {
    return typeof head === 'function' ? head.call(vm) : head;
  }
}

const serverHeadMixin = {
  created() {
    const head = getHead(this);

    if (head) {
      if (head.title) this.$ssrContext.title = `${head.title}-可爱王`;
      if (head.author) this.$ssrContext.author = `${head.author}-可爱王`;
      if (head.keywords) this.$ssrContext.keywords = head.keywords;
      if (head.description) this.$ssrContext.description = head.description;
    }
  },
};

const clientHeadMixin = {
  mounted() {
    const head = getHead(this);

    if (head) {
      if (head.title) document.title = `${head.title}-可爱王`;
      if (head.author)
        document
          .querySelector('meta[name="author"]')
          .setAttribute('content', `${head.author}-可爱王`);
      if (head.keywords)
        document
          .querySelector('meta[name="keywords"]')
          .setAttribute('content', head.keywords);
      if (head.description)
        document
          .querySelector('meta[name="description"]')
          .setAttribute('content', head.description);
    }
  },
};

export default process.env.VUE_ENV === 'server'
  ? serverHeadMixin
  : clientHeadMixin;
```

### 知识点一：混入 (mixins)

在做这个项目之前，我没有用过这个东西，**传送门5: [vue官方文档对混入的介绍](https://cn.vuejs.org/v2/guide/mixins.html)**

> 混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项。

简而言之，就是你可以自定义一个钩子函数，在每一个 Vue 实例里引用，比如这篇文章里提到的 `head()` , 帅呆了。

### 知识点二：服务器端渲染与客户端渲染的生命周期不同

在所有的生命周期钩子函数里，只有 `beforeCreate` 和 `created` 会在服务器端渲染过程中调用，官方文档有提到这个，所以在开发过程中要一定要注意这点。

完！
