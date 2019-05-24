//引入依赖模块
var gulp = require('gulp'),
    uglify = require('gulp-uglify'), // js混淆压缩
    imgMin = require('gulp-imagemin'), // 图片压缩
    csso = require('gulp-clean-css'), // css压缩
    htmlmin = require('gulp-htmlmin'),// html压缩
    clean = require('gulp-clean'),//清除文件
    sftp = require('gulp-sftp-up4'),//上传到服务器
    babel = require("gulp-babel"),//es6转es5
    react = require('gulp-react'),
    del = require('del'),
    rename = require("gulp-rename"),
    vinylPaths = require('vinyl-paths'),
    zip = require("gulp-zip"),
    war = require("gulp-war"),
    gulpIf = require("gulp-if"),
    config=require('./config.json');

gulp.task('checkParam',function(done){
    if(config.rootUrl==="" || typeof config.rootUrl ==="undefined"){
        console.log("rootUrl不能为空");
        return  false;
    }
    if(config.packageName==="" || typeof config.packageName ==="undefined"){
        console.log("packageName不能为空");
        return  false;
    }
    if(config.buildUrl==="" || typeof config.buildUrl ==="undefined"){
        config.buildUrl="gaoq/";
        console.log("buildUrl值为:"+config.buildUrl);
    }

    if(config.taskList!=="" && typeof config.taskList !=="undefined"){
        let taskList=config.taskList;
        if(taskList.other!=="" && typeof taskList.other !=="undefined"){
            let other=taskList.other;
            if(other.start==="true"){
                if(other.fileStyle==="" || typeof other.fileStyle ==="undefined"){
                    other.fileStyle="*";
                }
            }
        }
    }
    done();
});


//html  任务
gulp.task('html', function (done) {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    return gulp.src(config.rootUrl+"**/*.html")
        .pipe(gulpIf(config.taskList.html==="true",htmlmin(options)))
        .pipe(gulp.dest(config.buildUrl+config.rootUrl));
    done();
});

//图片任务
gulp.task('img', function (done) {
    return gulp.src(config.rootUrl+"**/*.{png,jpg,gif,ico,jpeg}")
        .pipe(gulpIf(config.taskList.img==="true",imgMin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true,
            multipass: true
        })))
        .pipe(gulp.dest(config.buildUrl+config.rootUrl));
    done();
});

// css 任务
gulp.task('css', function (done) {
    return gulp.src(config.rootUrl+"**/*.css")
        .pipe(gulpIf(config.taskList.css==="true",csso()))
        .pipe(gulp.dest(config.buildUrl+config.rootUrl));
    done();
});

//js任务
gulp.task('js', function (done) {
    return gulp.src([config.rootUrl+"**/*.js","!"+config.rootUrl+"/**/component/*.js"])
        .pipe(gulpIf(config.taskList.js==="true",uglify()))
        .pipe(gulp.dest(config.buildUrl+config.rootUrl));
    done();
});

//jsx任务
gulp.task('jsx', function (done) {
    return gulp.src(config.rootUrl+"**/component/*.js")
        .pipe(react())  //转换jsx代码
        .pipe(babel({
            presets:['@babel/env']    //插件数组
        }))  //es6转es5
        .pipe(gulpIf(config.taskList.jsx==="true",uglify()))
        .pipe(gulp.dest(config.buildUrl+config.rootUrl));
    done();
});
//other任务 执行复制
gulp.task('other', function (done) {
    var otherItem=config.taskList.other;
    gulp.src([config.rootUrl+"**/*."+otherItem.fileStyle,"!"+config.rootUrl+"**/*.js","!"+config.rootUrl+"**/*.css",
        "!"+config.rootUrl+"**/*.{png,jpg,gif,ico,jpeg}","!"+config.rootUrl+"**/*.html"])
        .pipe(gulp.dest(gulpIf(otherItem.start==="true",config.buildUrl+config.rootUrl)));
    done();
});
//打包任务
gulp.task('war', function (done) {
    gulp.src(config.buildUrl+'portal/**/*')
        .pipe(gulpIf(config.taskList.war==="true",war({
            welcome: 'index.html',
            displayName: 'Grunt WAR',
        })))
        .pipe(gulpIf(config.taskList.war==="true",zip(config.packageName+'.war')))
        .pipe(gulpIf(config.taskList.war==="true",gulp.dest(config.buildUrl)));
    done();

});

//上传服务器
gulp.task('upload', function (done) {
    console.log('## 正在部署到服务器上')
    var devDist = {
        //部署到服务器的路径
        remotePath: '/home/tomcat/apache-tomcat-8.5.24/webapps/',
        //ip地址
        host: '172.**.**.146',
        //帐号
        user: '******',
        //密码
        pass: '******'
    };
    gulp.src(config.buildUrl+'*.war').pipe(sftp(devDist));
    done();
});

//发布到生产环境
gulp.task('build', gulp.series('checkParam',gulp.parallel('img','js','jsx','css','html','other'),'war'));





























