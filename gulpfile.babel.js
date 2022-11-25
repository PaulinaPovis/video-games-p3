const gulp = require('gulp'); 
const pug = require('gulp-pug');
 
gulp.task('pug', () => {
  return gulp.src([
    'public/pug/views/**/*.pug'
  ]).pipe( pug() )
    
    .pipe( gulp.dest('./public') )
})

 gulp.task('default', function () {
    gulp.watch('public/pug/**/*.pug', gulp.series('pug'));
});