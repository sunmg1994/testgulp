const gulp = require("gulp");
sass = require("gulp-sass");
fileinclude = require("gulp-file-include");
autoprefixer = require("gulp-autoprefixer");
uglify = require("gulp-uglify");
imagemin = require("gulp-imagemin");
concat = require("gulp-concat");
connect = require("gulp-connect");
// 复制font到dist
gulp.src(['./src/font/*', './src/page/*'], { base: './src' })
  .pipe(gulp.dest('dist'));
// 开启服务器
gulp.task("connect", function () {
  connect.server({
    root: "dist",
    livereload: true
  });
});

gulp.task("html", function () {
  gulp.src("dist/*.html").pipe(connect.reload());
});

// 引入html文件
gulp.task("fileinclude", function () {
  gulp
    .src("src/**.html")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file"
      })
    )
    .pipe(gulp.dest("dist"));
});

// 合并scss
gulp.task("sass", function () {
  gulp
    .src("src/**/*.scss")
    .pipe(sass({ outputStyle: "nested" }).on("error", sass.logError))
    .pipe(
      autoprefixer({
        browsers: [
          "last 2 versions",
          "Safari >0",
          "Explorer >0",
          "Edge >0",
          "Opera >0",
          "Firefox >=20"
        ], //last 2 versions- 主流浏览器的最新两个版本
        cascade: true, //是否美化属性值 默认：true 像这样：
        remove: true //是否去掉不必要的前缀 默认：true
      })
    )

    .pipe(concat("main.css"))
    // CSS样式输出(nested | expanded | compact | compressed)
    .pipe(gulp.dest("dist/css/"));
});

// 压缩图片
gulp.task("imageMin", () =>
  gulp
    .src("src/images/*")
    // .pipe(imagemin())
    .pipe(imagemin({
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
    }))
    .pipe(gulp.dest("dist/images"))
);

// 压缩js
gulp.task("scripts", function () {
  gulp
    .src("src/js/*.js")
    // .pipe(concat("main.js"))
    // .pipe(uglify())
    .pipe(gulp.dest("dist/js"));
});

// 监听
gulp.task("watch", function () {
  gulp.watch("src/js/*.js", ["scripts"]);
  gulp.watch("src/images/*", ["imageMin"]);
  gulp.watch("src/**/*.scss", ["sass"]);
  gulp.watch("src/**/*.html", ["fileinclude"]);
  gulp.watch(["dist/*.html"], ["html"]);
  gulp.watch(["dist/css/*.css"], ["html"]);
});

gulp.task("default", ["sass", "scripts", "fileinclude", "imageMin"]);
// gulp dev 调用监听刷新
gulp.task("dev", ["connect", "watch"]);

/*
  -- 常用的方法 --
  gulp.task - Define tasks 定义任务
  gulp.src - Point to files to use 找到需要执行任务的文件
  gulp.dest - Points to folder to output 执行任务的文件的去处
  gulp.watch - Watch files and folders for changes 监听文件改变
*/
