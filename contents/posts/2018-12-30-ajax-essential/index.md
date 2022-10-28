---
title: 快速掌握 AJAX - 基础
slug: ajax-essential
date: 2018-12-30 12:28:38
cover: cover.png
categories:
  - 教程
tags:
  - AJAX
---

## 背景介绍

在了解 AJAX 之前我们可以简单的认为「JavaScript 能力有限」，因为在此之前 Web 平台提供所有的 API 都只停留在「单机」的阶段。

这样就会造成一些无法实现的功能，例如：

- 无法在实现用户登录功能时，当用户输入邮箱地址显示用户对应的头像
- 无法在实现用户注册功能时，当用户输入邮箱或者用户名就提示是否存在
- 无法在实现留言板功能时，实时看到最新的用户留言

> 思考：为什么做不到这些呢？

![browser-server](browser-server.png)

这些功能的开发最终都卡在一个相同的问题上：所需要的数据存放在服务端，我们无法通过已知的 API 获取到服务端存放的数据。

在此之前，我们可以通过以下几种方式让浏览器发出对服务端的请求，获得服务端的数据：

- 地址栏输入地址，回车，刷新
- 特定元素的 href 或 src 属性
- 表单提交

这些方案都是我们无法通过或者很难通过代码的方式进行编程（对服务端发出请求并且接受服务端返回的响应），**如果我们可以通过 JavaScript 直接发送网络请求，那么 Web 的可能就会更多，随之能够实现的功能也会更多，至少不再是只能开发「单机游戏」。**

> 对 XXX 进行编程指的就是用代码的方式操作它。

### Google Suggest

AJAX（Asynchronous JavaScript and XML），最早出现在 2005 年的 [Google Suggest](http://google-suggest.tumblr.com/)，是在浏览器端进行网络编程（发送请求、接收响应）的技术方案，它使我们可以通过 JavaScript 直接获取服务端最新的内容而不必重新加载页面。让 Web 更能接近桌面应用的用户体验。

![google-suggest](google-suggest.png)

## AJAX 定义

> 全称：Asynchronous Javascript And XML

说白了，**AJAX 就是浏览器提供的一套 API，可以通过 JavaScript 调用，从而实现通过代码控制请求与响应。实现通过 JavaScript 进行网络编程。**

至于 **XML**：最早在客户端与服务端之间传递数据时所采用的数据格式就是 XML。

> BTW. 个人认为应用层开发大多数情况下无外乎就是通过特定的逻辑将一堆 API 调用拼凑在一起罢了，没有太多技术含量。

### 应用场景总结

对于每一个未知的技术，我们在了解了过后第一反应就是在什么情况下用？

AJAX 一般在开发中的用途我总结为以下四类：

- 按需获取数据
- 对用户输入的数据进行校验
- 自动更新页面上内容
- 提升用户体验 - 无刷新的体验

## 快速上手

AJAX API 中核心提供的是一个 `XMLHttpRequest` 类型，所有的 AJAX 操作都需要使用到这个类型。

使用 AJAX 的过程可以类比平常我们访问网页过程：

```javascript
// 1. 创建一个 XMLHttpRequest 类型的对象 —— 相当于打开了一个浏览器
var xhr = new XMLHttpRequest()
// 2. 打开与一个网址之间的连接 —— 相当于在地址栏输入访问地址
xhr.open('GET', '/time')
// 3. 通过连接发送一次请求 —— 相当于回车或者点击访问发送请求
xhr.send(null)
// 4. 指定 xhr 状态变化事件处理函数 —— 相当于处理网页呈现后的操作
xhr.onreadystatechange = function () {
  // 通过 xhr 的 readyState 判断此次请求的响应是否接收完成
  if (this.readyState === 4) {
    // 通过 xhr 的 responseText 获取到响应的响应体
    console.log(this.responseText)
  }
}
```

> 注意：涉及到 AJAX 操作的页面不能使用文件协议访问（文件的方式访问）

### readyState

由于 `readystatechange` 事件是在 `xhr` 对象状态变化时触发（不单是在得到响应时），也就意味着这个事件会被触发多次，所以我们有必要了解每一个状态值代表的含义：

| readyState | 状态描述 | 说明 |
| --- | --- | --- |
| 0 | UNSENT | 代理（XHR）被创建，但尚未调用 `open()` 方法。 |
| 1 | OPENED | `open()` 方法已经被调用，建立了连接。 |
| 2 | HEADERS_RECEIVED | `send()` 方法已经被调用，并且已经可以获取状态行和响应头。 |
| 3 | LOADING | 响应体下载中， `responseText` 属性可能已经包含部分数据。 |
| 4 | DONE | 响应体下载完成，可以直接使用 `responseText`。 |

#### 时间轴

```flow
s=>start: UNSENT
o1=>operation: OPENED
o2=>operation: HEADERS_RECEIVED
o3=>operation: LOADING
e=>end: DONE

s(right)->o1(right)->o2(right)->o3(right)->e
```

```flow
s=>start: 初始化
o1=>operation: 建立连接
o2=>operation: 接收到响应头
o3=>operation: 响应体加载中
e=>end: 加载完成

s(right)->o1(right)->o2(right)->o3(right)->e
```

```javascript
var xhr = new XMLHttpRequest()
console.log(xhr.readyState)
// => 0
// 初始化 请求代理对象

xhr.open('GET', '/time')
console.log(xhr.readyState)
// => 1
// open 方法已经调用，建立一个与服务端特定端口的连接

xhr.send()

xhr.addEventListener('readystatechange', function () {
  switch (this.readyState) {
    case 2:
      // => 2
      // 已经接受到了响应报文的响应头

      // 可以拿到头
      // console.log(this.getAllResponseHeaders())
      console.log(this.getResponseHeader('server'))
      // 但是还没有拿到体
      console.log(this.responseText)
      break

    case 3:
      // => 3
      // 正在下载响应报文的响应体，有可能响应体为空，也有可能不完整

      // 在这里处理响应体不保险（不可靠）
      console.log(this.responseText)
      break

    case 4:
      // => 4
      // 一切 OK （整个响应报文已经完整下载下来了）

      // 这里处理响应体
      console.log(this.responseText)
      break
  }
})
```

通过理解每一个状态值的含义得出一个结论：一般我们都是在 `readyState` 值为 `4` 时，执行响应的后续逻辑。

```javascript
xhr.onreadystatechange = function () {
  if (this.readyState === 4) {
    // 后续逻辑......
  }
}
```

### 遵循 HTTP

本质上 XMLHttpRequest 就是 JavaScript 在 Web 平台中发送 HTTP 请求的手段，所以我们发送出去的请求任然是 HTTP 请求，同样符合 HTTP 约定的格式：

```javascript
// 设置请求报文的请求行
xhr.open('GET', '/time')
// 设置请求头
xhr.setRequestHeader('Accept', 'text/plain')
// 设置请求体
xhr.send(null)

xhr.onreadystatechange = function () {
  if (this.readyState === 4) {
    // 获取响应状态码
    console.log(this.status)
    // 获取响应状态描述
    console.log(this.statusText)
    // 获取响应头信息
    console.log(this.getResponseHeader('Content-Type')) // 指定响应头
    console.log(this.getAllResponseHeaders()) // 全部响应头
    // 获取响应体
    console.log(this.responseText) // 文本形式
    console.log(this.responseXML) // XML 形式，了解即可不用了
  }
}
```

> 参考链接：
>
> - https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest
> - https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
> - ssqwqqdeveloper.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest

## 具体用法

### GET 请求

> 通常在一次 GET 请求过程中，参数传递都是通过 URL 地址中的 `?` 参数传递。

```javascript
var xhr = new XMLHttpRequest()
// GET 请求传递参数通常使用的是问号传参
// 这里可以在请求地址后面加上参数，从而传递数据到服务端
xhr.open('GET', '/delete?id=1')
// 一般在 GET 请求时无需设置响应体，可以传 null 或者干脆不传
xhr.send(null)
xhr.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log(this.responseText)
  }
}

// 一般情况下 URL 传递的都是参数性质的数据，而 POST 一般都是业务数据
```

### POST 请求

> POST 请求过程中，都是采用请求体承载需要提交的数据。

```javascript
var xhr = new XMLHttpRequest()
// open 方法的第一个参数的作用就是设置请求的 method
xhr.open('POST', '/add')
// 设置请求头中的 Content-Type 为 application/x-www-form-urlencoded
// 标识此次请求的请求体格式为 urlencoded 以便于服务端接收数据
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
// 需要提交到服务端的数据可以通过 send 方法的参数传递
// 格式：name=zhangsan&age=18
xhr.send('name=zhangsan&age=18')
xhr.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log(this.responseText)
  }
}
```

### 同步与异步

关于同步与异步的概念在生活中有很多常见的场景，举例说明。

> - 同步：一个人在同一个时刻只能做一件事情，在执行一些耗时的操作（不需要看管）不去做别的事，只是等待
> - 异步：在执行一些耗时的操作（不需要看管）去做别的事，而不是等待

`xhr.open()` 方法第三个参数要求传入的是一个 `bool` 值，其作用就是设置此次请求是否采用异步方式执行，默认为 `true`，如果需要同步执行可以通过传递 `false` 实现：

```javascript
console.log('before ajax')
var xhr = new XMLHttpRequest()
// 默认第三个参数为 true 意味着采用异步方式执行
xhr.open('GET', '/time', true)
xhr.send(null)
xhr.onreadystatechange = function () {
  if (this.readyState === 4) {
    // 这里的代码最后执行
    console.log('request done')
  }
}
console.log('after ajax')
```

如果采用同步方式执行，则代码会卡死在 `xhr.send()` 这一步：

```javascript
console.log('before ajax')
var xhr = new XMLHttpRequest()
// 同步方式
xhr.open('GET', '/time', false)
// // 同步方式 执行需要 先注册事件再调用 send，否则 readystatechange 无法触发
// xhr.onreadystatechange = function () {
//   if (this.readyState === 4) {
//     // 这里的代码最后执行
//     console.log('request done')
//   }
// }
xhr.send(null)
// 因为 send 方法执行完成 响应已经下载完成
console.log(xhr.responseText)
console.log('after ajax')
```

演示同步异步差异。

所以一定在发送请求 `send()` 之前注册 `readystatechange`（不管同步或者异步）

- 为了让这个事件可以更加可靠（一定触发），一定是先注册

> 了解同步模式即可，切记不要使用同步模式。

至此，我们已经大致了解了 AJAX 所的提供的基本 API 。

### XMLHttpRequest API 总结

> https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest

### 属性

- `readyState`
- `status`
- `responseText`
- `responseXML`
- `onreadystatechange`

### 方法

- `open(method, url, async)`
- `send(requsetBody)`
- `setRequestHeader(key, value)`
- `getResponseHeader(key)`

## 响应数据格式

> 提问：如果希望服务端返回一个复杂数据，该如何处理？

关心的问题就是服务端发出何种格式的数据，这种格式如何在客户端用 JavaScript 解析。

### XML

一种数据描述手段

老掉牙的东西，简单演示一下，不在这里浪费时间，基本现在的项目不用了。

淘汰的原因：数据冗余太多

### JSON

也是一种数据描述手段，类似于 JavaScript 字面量方式

服务端采用 JSON 格式返回数据，客户端按照 JSON 格式解析数据。

> **注意**：
>
> - 不管是 JSON 也好，还是 XML，只是在 AJAX 请求过程中用到，并不代表它们与 AJAX 之间有必然的联系，它们只是数据协议罢了。
> - 不管服务端是采用 XML 还是采用 JSON 本质上都是将数据返回给客户端。
> - 服务端应该根据响应内容的格式设置一个合理的 Content-Type。

### 处理响应数据渲染

客户端中拿到请求的数据过后最常见的就是把这些数据呈现到界面上。

如果数据结构简单，可以直接通过字符串操作（拼接）的方式处理，但是如果数据过于复杂，字符串拼接维护成本太大，就不推荐了，可以使用模版引擎或者 ES6 提供的模板字符串。

> 模板引擎有很多种，使用方式大同小异，目的都是为了可以更容易的将数据渲染到 HTML 字符串中。

## 缓存问题

缓存问题指的是：多次 AJAX GET 请求同一个 URL 得到的结果是相同的，目前绝大多数浏览器已经没有这个问题了，只有早期的 IE 浏览器（<= IE 9）任然存在这个问题

```javascript
var xhr = new XMLHttpRequest()
xhr.open('GET', '/time')
xhr.send(null)
xhr.onreadystatechange = function () {
  if (this.readyState !== 4) return
  console.log(this.responseText)
  // => 每次得到的结果都是相同的
}
```

### 解决方案

#### URL 加戳

这个办法的核心就是让浏览器认为每次请求的地址都是不同的。

> 不同的 querystring 会被浏览器认为是不同的地址，浏览器会忽略客户端缓存。

```javascript
var xhr = new XMLHttpRequest()
xhr.open('GET', '/time?t=' + Date.now())
xhr.send(null)
xhr.onreadystatechange = function () {
  if (this.readyState !== 4) return
  console.log(this.responseText)
  // =>
}
```

#### 服务端设置响应头

由服务端通过 HTTP 响应报文中的响应头告知客户端浏览器不要缓存当前地址。

```javascript
app.get('/time', (req, res) => {
  res.set('Cache-Control', 'no-cache')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '-1')
  res.send(Date.now().toString())
})
```

了解即可，更多的情况下前端开发中还是通过加戳的方式解决此问题，因为在前端可控范围之内。

## 兼容方案

XMLHttpRequest 在老版本浏览器（IE5/6）中有兼容问题，可以通过另外一种方式代替。

```javascript
var xhr = window.XMLHttpRequest
  ? new XMLHttpRequest()
  : new ActiveXObject('Microsoft.XMLHTTP')
// xhr 的成员相同
```

## XMLHttpRequest 2.0

介绍完老版本的问题，接下来介绍一下新版本的特性。

HTML5 中对 XMLHttpRequest 类型全面升级，更易用，更强大

### onload / onprogress

```javascript
var xhr = new XMLHttpRequest()
xhr.open('GET', '/time')
xhr.onload = function () {
  // onload readyState => 4
  // 只在请求完成时触发
  console.log(this.readyState)
}
xhr.onprogress = function (e) {
  // onprogress readyState => 3
  // 只在请求进行中触发
  console.log(this.readyState)
  // e.loaded  在周期性调用中接受到了多少信息。
  // e.total  该请求一共有多少信息。
}
xhr.send(null)
```

> - https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget/onload
> - https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget/onprogress

### response 属性

以对象的形式表述响应体，其类型取决于 `responseType` 的值。你可以尝试设置 `responseType` 的值，以便通过特定的类型请求数据。

```javascript
var xhr = new XMLHttpRequest()
xhr.open('GET', '/api/users')
// 主观认为服务端返回的响应体为 JSON 格式
xhr.responseType = 'json'
xhr.onload = function () {
  console.log(this.response)
  // => Array 而不是 JSON String
}
xhr.send(null)
```

> `responseType` 要在调用 `open()` 初始化请求之后，在调用 `send()` 发送请求到服务器之前设置方可生效。

| 值 | 描述 |
| --- | --- |
| "" | 将 responseType 设为空字符串与设置为"text"相同， 是默认类型 （实际上是 DOMString）。 |
| "arraybuffer" | response 是一个包含二进制数据的 JavaScript ArrayBuffer 。 |
| "blob" | response 是一个包含二进制数据的 Blob 对象 。 |
| "document" | response 是一个 HTML Document 或 XML XMLDocument ，这取决于接收到的数据的 MIME 类型。请参阅 HTML in XMLHttpRequest 以了解使用 XHR 获取 HTML 内容的更多信息。 |
| "json" | response 是一个 JavaScript 对象。这个对象是通过将接收到的数据类型视为 JSON 解析得到的。 |
| "text" | response 是包含在 DOMString 对象中的文本。 |

### FormData

以前 AJAX 操作只能提交字符串，现在可以提交 **二进制** 的数据。

```javascript
var formElement = document.querySelector('form#login')

// 表单数据对象
var data = new FormData(formElement)
// 额外文本内容
data.append('key', 'value')
// 额外文件内容
data.append('file', dom.files[0])

var xhr = new XMLHttpRequest()
xhr.open('POST', '/api/upload')
xhr.send(data)
xhr.onload = function () {
  console.log(this.responseText)
}
```

> https://developer.mozilla.org/zh-CN/docs/Web/API/FormData

## 封装 AJAX 库

### 自己封装一个 AJAX 函数

> 这里主要是为了了解封装的过程，一般情况在开发中都是使用第三方提供的 AJAX 库，因为它们可能更加严谨。

为了在后续的开发过程中可以更方便的使用这套 API，一般的做法都是将其封装到一个函数中以便调用。

```javascript
/**
 * 发送一个 AJAX 请求
 * @param  {string}   url    请求地址
 * @param  {string}   method 请求方法
 * @param  {Object}   params 请求参数
 * @param  {function} done   请求完成过后需要做的事情（委托/回调）
 */
function ajax(url, method, params, done) {
  // 统一转换为大写便于后续判断
  method = method.toUpperCase()

  // 对象形式的参数转换为 urlencoded 格式
  var pairs = []
  for (var key in params) {
    pairs.push(key + '=' + params[key])
  }
  var querystring = pairs.join('&')

  var xhr = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject('Microsoft.XMLHTTP')

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState !== 4) return

    // 尝试通过 JSON 格式解析响应体
    try {
      done(JSON.parse(this.responseText))
    } catch (e) {
      done(this.responseText)
    }
  })

  // 如果是 GET 请求就设置 URL 地址 问号参数
  if (method === 'GET') {
    url += '?' + querystring
  }

  xhr.open(method, url)

  // 如果是 POST 请求就设置请求体
  var data = null
  if (method === 'POST') {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    data = querystring
  }
  xhr.send(data)
}

ajax('get', '/getsomthing', { id: 123 }, function (data) {
  console.log(data)
})

ajax('post', '/addsomthing', { foo: 'posted data' }, function (data) {
  console.log(data)
})
```

> 提示：回调函数的概念
>
> - 函数就可以理解为一个想要做的事情，函数体中约定了这件事情做的过程，直到调用时才开始工作。
> - 回调函数可以理解为生活中委托的概念。

> **委托**：将函数作为参数传递，就像是你将一个事情交给别人，你制定这件事怎么做，但是具体的是由别人去做，这就是委托的概念

### jQuery 中的 AJAX

jQuery 中有一套专门针对 AJAX 的封装，功能十分完善，经常使用，需要着重注意。

> 一个你会用我会用他会用到的点，就一定有一个已经封装好的

> 参考：
>
> - http://www.jquery123.com/category/ajax/
> - http://www.w3school.com.cn/jquery/jquery_ref_ajax.asp

#### \$.ajax

```javascript
$.ajax({
  url: '/time',
  type: 'get',
  dataType: 'json',
  data: { id: 1 },
  beforeSend: function (xhr) {
    console.log('before send')
  },
  success: function (data) {
    console.log(data)
  },
  error: function (xhr) {
    console.log(xhr)
  },
  complete: function (xhr) {
    console.log('request completed')
  }
})
```

常用选项参数介绍：

- url：请求地址
- type：请求方法，默认为 `get`
- dataType：服务端响应数据类型
- contentType：请求体内容类型，默认 `application/x-www-form-urlencoded`
- data：需要传递到服务端的数据，如果 GET 则通过 URL 传递，如果 POST 则通过请求体传递
- timeout：请求超时时间
- beforeSend：请求发起之前触发
- success：请求成功之后触发（响应状态码 200）
- error：请求失败触发
- complete：请求完成触发（不管成功与否）

#### \$.get

GET 请求快捷方法

`$.get(url, data, callback)`

#### \$.post

POST 请求快捷方法

`$.post(url, data, callback)`

#### 全局事件处理

> 参考：http://www.jquery123.com/category/ajax/global-ajax-event-handlers/

#### 其他常见 API

- `$(selector).load()` - 局部区域加载服务端返回的内容，有点类似 `iframe`
- `$.getJSON()` - 忽略服务端响应的 `Content-Type` 响应头，主观按照 JSON 格式解析响应体
- `$.getScript()` - 加载并执行服务端返回的一段 JavaScript 代码

### Axios

> https://github.com/axios/axios

Axios 是目前应用最为广泛的 AJAX 封装库，相对于 jQuery 的优势在于支持 `Promise`、功能更强劲、职责更单一，后期会专门介绍到。

```javascript
axios
  .get('/time')
  .then(function (res) {
    console.log(res.data)
  })
  .catch(function (err) {
    console.error(err)
  })
```

## 总结

假设你是一位刚刚进入 JavaScript 领域的开发者，至此，你应该是已经了解到了 AJAX 基础所有的方方面面了，后续可能会再分享一些关于 AJAX 的经验和技巧，感兴趣的可以持续关注。
