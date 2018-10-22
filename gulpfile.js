var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	underscore = require('underscore'),
	autoprefixer = require('gulp-autoprefixer'),
	file2json = require('gulp-file-to-json');
var jsonConcat = require('gulp-json-concat');
 
 

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task ('scripts', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
		'app/libs/underscore/underscore-min.js'
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('concat-js', function() {
	return gulp.src([
		'app/js/common.js',
		'app/js/localization.js',
		'app/js/muvies.js',
		'app/js/muvies_info.js',
		])
	.pipe(concat('common.min.js'))
	.pipe(gulp.dest('app/js'));
});


gulp.task ('css-libs', ['sass'], function(){
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
})

gulp.task ('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task ('clean', function() {
	return del.sync('dist')
})

gulp.task ('clean-json', function() {
	return del.sync('app/js/templates/json') 
})
gulp.task ('clean-compiled-json', function() {
	return del.sync('app/js/templates/compiled_json') 
})

gulp.task('json-parts', function () {
  return gulp.src('app/js/templates/*.ejs')
    .pipe(file2json())
    .pipe(gulp.dest('app/js/templates/json'));
});

gulp.task('json', ['clean-json', 'clean-compiled-json', 'json-parts'], function () {
  return gulp.src('app/js/templates/json/*.json')
    .pipe(jsonConcat('compiled.json',function(data){
      return new Buffer.from(JSON.stringify(data));
    }))
    .pipe(gulp.dest('app/js'));
});


gulp.task ('clear', function() {
	return cache.clearAll();
})



gulp.task('img', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		})))
	.pipe(gulp.dest('dist/img'));
})


gulp.task ('watch', ['browser-sync', 'css-libs', 'scripts', 'concat-js', 'json'], function () {
	gulp.watch('app/sass/**/*.sass', [sass]);
	gulp.watch('app/**/*.html', browserSync.reload)
	gulp.watch('app/js/**/*.js', browserSync.reload)
	gulp.watch('app/js/*.json', browserSync.reload)
});


gulp.task('build', ['clean', 'sass', 'scripts', 'img'], function() {
	var buildCss = gulp.src([
		'app/css/main.css',
		'app/css/libs.min.css'
	])
	.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src([
		'app/fonts/**/*'
		])
	.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src(['app/js/**/*.js'])
	.pipe(gulp.dest('dist/js'));

	var buildJSON = gulp.src(['app/js/*.json'])
	.pipe(gulp.dest('dist/js/templates'));

	var buildHtml =gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));
});

