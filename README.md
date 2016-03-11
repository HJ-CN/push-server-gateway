# 微刊－服务器端

## 使用技术及版本

* nodejs: v4.2.1
* restify


## 代码下载及切换分支

代码的下载：

```
$ git clone git@github.com:Jun-GitHub/push-server-gateway.git
```

切换到当前分支：

```
git checkout dev
```

## 安装所需的库

下载所需的库：(第一次会比较慢，耐心等待)

```
$ npm install -dd  --no-optional
```

## 安装所需的工具

gulp:

```
npm install --global gulp
```

nodemon:

```
npm install -g nodemon
```

## 编译

因为使用了ES6特性，需要将代码编译（转换）为ES5代码。


生产环境下，可：

```
gulp
```

会将src目录下的所有代码编译生成单一js文件：`dist/all.js`。

如果是开发，可借助`gulp watch`实时监控代码改变，并触发自动编译：

```
gulp watch
```

## 运行

### 生产环境

生产环境执行：

```
npm start
```

###  开发环境

可在修改后自动重启node。

通过`nodemon`发现`dist/all.js`改变后自动重启node：

```
nodemon dist/all.js
```



