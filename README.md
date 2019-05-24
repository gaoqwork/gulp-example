# gulp-example
gulp 做的一些简单例子，对代码进行 压缩 打包  上传到服务器

gulp 文件使用指南
1、nodejs环境搭建---详见文件gulp环境搭建.docx

2、把config.json文件、gulpfile.js文件和package.json文件拷贝到项目中与 node_modules 同级的文件路径下

3、执行命令npm install 或cnpm install，会生成node_modules文件夹

4、config.json文件是执行任务的配置文件，参数介绍如下：

buildUrl：打包压缩后，存储文件的路径，非必填，默认是"build/"; packageName: 包名称，即生成war包的包名称，必填; rootUrl:进行文件处理的根路径，即对哪一个文件夹下的代码进行操作处理， 该文件夹应该包括要处理的所有文件，特殊情况，特殊处理 taskList：任务列表，非必填，如果没有，则任务全部不执行

html：执行html任务，非必填，true为执行，如果没有该项或值非true， 则不执行

css： 执行css任务，非必填，true为执行，如果没有该项或值非true， 则不执行

js： 执行js任务，非必填，true为执行，如果没有该项或值非true， 则不执行

jsx： 执行jsx任务(react代码)，非必填，true为执行，如果没有该项 或值非true，则不执行

img： 执行jsx任务(react代码)，非必填，true为执行，如果没有该项 或值非true，则不执行

other： 执行除上述之外的文件处理任务(即为代码复制)，非必填， 如果没有该项，则不执行 start：是否执行other任务，非必填，true为执行，如果没有该项 或值非true，则不执行； fileStyle：执行复制操作的文件类型，非必填，如果没有该项或值 为空，而start值为true，则除了上述的文件类型外，其他文件类型 都执行复制操作；

      如果文件类型只有一个，写法如下：
        "other":{
              "start":"true",
              "fileStyle":"doc"
            }
      如果文件类型有多个，写法如下：
        "other":{
              "start":"true",
              "fileStyle":"{doc,docx,xlsx,xls,war,zip,txt}"
            }
        或
        "other":{
              "start":"true",
              "fileStyle":"*"
            }
 5、执行
   执行npm  run build命令  或 gulp 任务名
