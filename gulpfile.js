var gulp = require('gulp');
var jade = require('gulp-jade');
var foreach = require('gulp-foreach');
var concat = require('gulp-concat');
var path = require('path');

gulp.task('templates', function() {
  gulp.src('./public/templates/forcompile/*.jade')
    .pipe(foreach(function(stream,file){
            var filename = path.basename(file.path);
            filename = filename.split('.')[0]
            return stream
                .pipe(jade({
                    client: true,
                    name: filename
                }));
        }))
        .pipe(concat('all.js'))
    .pipe(gulp.dest('./public/js/'))
});