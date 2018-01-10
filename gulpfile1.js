var gulp = require('gulp'),
		less = require('gulp-less'),
		sourcemaps = require('gulp-sourcemaps'),
		livereload = require('gulp-livereload'); 

gulp.task('less', function() {
  // 将你的默认的任务代码放在这
// 	gulp.src('application-manage/less/*.less')
 	gulp.src('internalControl/css/*.less')
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(sourcemaps.write())
//    .pipe(gulp.dest('application-manage/css'));
      .pipe(gulp.dest('internalControl/mincss'));
});

gulp.task('auto',function(){
    //监听文件修改，当文件修改则执行less任务
    gulp.watch('internalControl/**/*.less',['less'])
});

gulp.task('watch', function() {
    livereload.listen();//这里需要注意！旧版使用var server = livereload();已经失效    
    // app/**/*.* 的意思是 app 文件夹下的 任何文件夹 的 任何文件  
    gulp.watch('internalControl/**/*.*', function(event) {
        livereload.changed(event.path);  
    });  
});  

gulp.task('default',['less','auto','watch'])

