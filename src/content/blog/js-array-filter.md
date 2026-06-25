---
title: 'JS中的数组过滤，从简单筛选到多条件筛选'
description: '从单条件筛选到多条件复合筛选，梳理 JavaScript 数组 filter、every、some 和深浅拷贝相关知识。'
date: 2018-10-16
lang: zh
category: 'JavaScript'
tags: ['JavaScript', '数组', '筛选']
---

在上家公司工作的时候，有一个需求是在前端部分完成筛选功能，一次拿到所有数据，然后根据条件筛选。通常情况下筛选是后台给接口，在数据量不大的情况下，也有人可能会遇到前端筛选这样的情况，特别写了这篇文章分享给大家，有问题请指出，互相学习。

一般情况下的单条件筛选，数组的filter方法就能够满足需求，本文讨论的重点是多条件下的复合筛选，并列出了几个相关知识点。

以下是很多个🌰🌰🌰🌰

```javascript
// 这个是例子中的被筛选数组
var aim = [
  { name: 'Anne', age: 23, gender: 'female' },
  { name: 'Leila', age: 16, gender: 'female' },
  { name: 'Jay', age: 19, gender: 'male' },
  { name: 'Mark', age: 40, gender: 'male' },
];
```

### 单条件单数据筛选

根据单个名字筛选，用filter方法，判断name是否为目标名字即可

```javascript
// 根据单个名字筛选
function filterByName(aim, name) {
  return aim.filter((item) => item.name == name);
}
// 输入 aim 'Leila' 期望输出为 [{name:'Leila', age: 16, gender:'female'}]
console.log(filterByName(aim, 'leila'));
```

### 单条件多数据筛选

根据多个名字筛选，这里是用for循环遍历目标数组，然后用find方法找到后push到结果数组里，用find方法是重名情况下也能得到想要的结果。for循环可以用数组的一些遍历方法替代，代码可以更简化，示例就是大概表达个意思。

```javascript
// 根据多个名字筛选
function filterByName1(aim, nameArr) {
  let result = [];
  for (let i = 0; i < nameArr.length; i++) {
    result.push(aim.find((item) => (item.name = nameArr[i])));
  }
  return result;
}
// 输入 aim ['Anne','Jay']
//期望输出为 [{name:'Anne', age: 23, gender:'female'},{name:'Jay', age: 19, gender:'male'}]
console.log(filterByName1(aim, ['Leila', 'Jay']));
// 有BUG 改进后
```

### 多条件单数据筛选

根据单个名字或者单个年龄筛选，用filter方法，判断条件之间是或的关系。

```javascript
// 根据名字或者年龄筛选
function filterByName2(aim, name, age) {
  return aim.filter((item) => item.name == name || item.age == age);
}
console.log(filterByName2(aim, 'Leila', 19));
```

### 多条件多数据筛选

我最初是用了很笨的双for循环去做，发现很慢，而且并没有达到预期的效果。具体的心路历程已经太遥远，简单介绍以下这个筛选算法。

首先是把筛选条件都塞到一个对象里，用object对象的keys方法获取到筛选的条件名，及需要筛选的是哪个条件，是name？age? gender?

然后使用filter方法对目标数据进行筛选，🌰如下⬇️

根据名字和年龄多元素筛选

```javascript
//根据名字和年龄多元素筛选
export function multiFilter(array, filters) {
  const filterKeys = Object.keys(filters);
  // filters all elements passing the criteria
  return array.filter((item) => {
    // dynamically validate all filter criteria
    return filterKeys.every((key) => {
      //ignore when the filter is empty Anne
      if (!filters[key].length) return true;
      return !!~filters[key].indexOf(item[key]);
    });
  });
}
/*
 * 这段代码并非我原创，感兴趣的可以去原作者那里点个赞
 * 作者是：@author https://gist.github.com/jherax
 * 这段代码里我只加了一行，解决部分筛选条件清空时候整体筛选失效的问题
 */

var filters = {
  name: ['Leila', 'Jay'],
  age: [],
};
/* 结果：
 * [{name: "Leila", age: 16, gender: "female"},
 *  {name: "Jay", age: 19, gender: "male"}]
 */
```

例如这里，判断每条数据的name值是否在filters.name数组里，是的话返回true，判断filters.age是空数组的话直接返回true，空数组是模拟了age条件被清空的情况，我们仍然能得到正确的筛选数据。

### 知识点1: Object.key() 获取数组索引或者对象属性

```javascript
var arr = ['a', 'b', 'c'];
console.log(Object.keys(arr));
// ["0", "1", "2"]

var obj = { 0: 'a', 1: 'b', 2: 'c' };
console.log(Object.keys(obj));
// ["0", "1", "2"]

var anObj = { 100: 'a', 2: 'b', 7: 'c' };
console.log(Object.keys(anObj));
// ["2", "7", "100"] 猜猜为啥？
```

### 知识点2: js里的falsy

**falsy** : 0 , false, “”, null, undefined, NaN

在判断语句中，只有上面6种情况会是false，其余的都是true

```javascript
var a;
if (a != null && typeof a != undefined && a != '') {
  //a有内容才执行的代码
}

if (!!a) {
  //a有内容才执行的代码...
}
```

### 知识点3: Array.every 与 Array.some的区别

我的理解是在遍历数组的时候：

**Array.every**的条件是「与」的关系，全真为真，及条件全为true则为true，有一个false就返回false

**Array.some**的条件是「或」的关系，有真为真，条件有一个true就返回true，条件全为false的时候才返回false

下面举个🌰

```javascript
// 判断每个名字都为Anne?
let dataEvery = aim.every((item) => item.name === 'Anne'); // false
let dataEvery = aim.some((item) => item.name === 'Anne'); // true

// 判断每个名字都是字符串？
let dataEvery = aim.every((item) => typeof item.name === 'string'); // true
let dataEvery = aim.some((item) => typeof item.name === 'string'); // true
```

### 知识点4: 数组的深拷贝与浅拷贝

最近参与一些前端的面试工作，深拷贝与浅拷贝是我最爱问的问题之一。一个问题就考察了数据类型，数组操作，递归算法等。

因为数组是js里的引用类型，单纯复制时复制的是其引用关系。在对获取的数据进行筛选时，我并不希望影响原始数据，所以我要用到「深拷贝」得到与原始数据数据结构完全相同又相互独立的数据，而不是只复制其引用关系。

```javascript
// 我常用方法，如果项目很大，不推荐
let obj1 = JSON.parse(JSON.stringify(obj));

// deepclone
function deepClone(o1, o2) {
  for (let k in o2) {
    if (typeof o2[k] === 'object') {
      o1[k] = {};
      deepClone(o1[k], o2[k]);
    } else {
      o1[k] = o2[k];
    }
  }
}
```

### 想一想：递归算法的优化

这个知识点与本文关系不大。😄 抱歉之前的误导。

这个是看掘金小册前端面试指南看到的，讲算法的时候提了一下递归算法的优化，初见的时候又被惊艳到，还没有在项目里用到。感兴趣的可以试试，这个是斐波那契数列和。可以自己在浏览器里敲一下，试试不用缓存与用缓存的运算次数差别。

```javascript
let count = 0;
function fn(n) {
  let cache = {};
  function _fn(n) {
    if (cache[n]) {
      return cache[n];
    }
    count++;
    if (n == 1 || n == 2) {
      return 1;
    }
    let prev = _fn(n - 1);
    cache[n - 1] = prev;
    let next = _fn(n - 2);
    cache[n - 2] = next;
    return prev + next;
  }
  return _fn(n);
}

let count2 = 0;
function fn2(n) {
  count2++;
  if (n == 1 || n == 2) {
    return 1;
  }
  return fn2(n - 1) + fn2(n - 2);
}
```

完！
