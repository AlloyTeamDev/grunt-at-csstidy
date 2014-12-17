# grunt-at-csstidy [![Build Status](https://travis-ci.org/lightningtgc/grunt-at-csstidy.svg?branch=master)](http://travis-ci.org/lightningtgc/grunt-at-csstidy) [![NPM version](https://badge.fury.io/js/grunt-at-csstidy.png)](http://badge.fury.io/js/grunt-at-csstidy)


> Alloyteam 团队规范工具系列——自动整理CSS代码工具。

> grunt-at-csstidy 是基于 Grunt '0.4.x' 与 csscomb '3.x' 的Grunt插件。

> 整合了Alloyteam的团队规范，并解决了部分CSS语法树解析的兼容问题。

## 上手教程

如果你之前没用过 [Grunt](http://gruntjs.com/) ，可以参考官方教程 [Getting Started](http://gruntjs.com/getting-started) ，里面会介绍怎么创建 [Gruntfile](http://gruntjs.com/sample-gruntfile) 以及安装Grunt的插件.

一旦你熟悉这些流程后，将会用到下面的命令：

```shell
npm install grunt-at-csstidy --save-dev
```

安装完插件之后，你可以在Gruntfile.js中加上下面的任务来启用这个插件：

```js
grunt.loadNpmTasks('grunt-at-csstidy');
```

当然，你如果是用自动加载任务的形式，则不需要添加上面的启用任务。

## 插件详细配置相关

#### 支持特性：

* 支持单个文件，多个文件的自动化整理
* 支持文件夹，模糊路径的动态匹配处理
* 支持CSS,SASS,LESS的文件类型

#### 动态配置，支持文件夹模糊匹配

这是比较常用的配置形式，可以针对整个文件夹进行匹配处理。

动态匹配例子：

```js
grunt.initConfig({
    csstidy: {
        // dynamic_mappings可自定义，但grunt官方支持该名称的特性，建议保留
        dynamic_mappings: {
            expand: true, // 开启动态扩展，保留
            cwd: '/styles/css/', // 源文件相对于这个路径进行查找
            src: ['**/*.css', '!*.resorted.css'], // 目标文件，支持模糊与详细的写法，与过滤规则
            dest: '/dest/css/', // 转换生成的目标路径，如果是替换源文件，则于cwd保持一致
            ext: '.resorted.css' //生成文件的后缀别名，如果是替换源文件，则可去掉
        }
    }
});
```

#### 匹配单文件，具体某几个文件

例子如下：

```js
grunt.initConfig({
    csstidy: {
        // 任务名（如single，可自定义）
        single: {
            files: {
                // 格式:  ‘目标文件路径’:['源文件路径']
                // 如需替换文件，则编写时两者路径相同即可
                'dest/one-resorted.css': ['src/one.css'] // 匹配单个文件
            }
        },
        multi: {
            files: {
                'dest/one-resorted.css': ['src/one.css'],// 匹配多个文件
                'dest/two-resorted.css': ['src/two.css']
            }
        }
    }
});
```

#### 整理相关配置默认按照[Alloyteam的CSS团队规范](http://alloyteam.github.io/code-guide/#css)

支持自定义配置文件进行CSS代码整理，详细配置可参照[该文档](https://github.com/csscomb/csscomb.js/blob/master/doc/configuration.md)，

具体步骤：通过在 options 中添加config，并指定相应路径。

自定义整理配置例子:

```js
grunt.initConfig({
    csstidy: {
        custom: {
            options: {
                config: '/path/config.json'
            },
            files: {
                'dest/one-resorted.css': ['src/one.css']
            }
        }
    }
});
```

## 修改历史

+ v0.1.4：Fix CSS 解析语法树问题
+ v0.1.0: 初始化
