const { src, dest, watch, series, parallel } = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const del = require('del');
const pug = require('gulp-pug');
const htmlmin = require('gulp-htmlmin');
const sassGlob = require('gulp-sass-glob');
const sass = require('gulp-sass')(require('sass'));
const less = require('gulp-less')(require('less'));
const stylus = require('gulp-stylus')(require('stylus'));
const csso = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify-es').default;
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const avifWebpHTML = require("gulp-avif-webp-html");

function watching() {
  browserSync.init({
    server: {
      baseDir: "dist",
    }
  });
  watch("dist/*.html").on("change", browserSync.reload);
  watch(["src/*.html" || "src/pug/**/*.pug)"], html).on("change", browserSync.reload);
  watch(["src/sass/**/*.+(scss|sass)" || "src/less/**/*.less" || "src/stylus/**/*.styl"], styles).on("change", browserSync.reload);
  watch(["src/js/**/*.js)"], scripts).on("change", browserSync.reload);
  watch(["src/fonts/**/*.+(ttf|eot|woff|woff2)"], fonts);
  watch(["src/icons/**/*.+(png|svg|webp)"], icons);
  watch(["src/img/**/*.+(jpg|png|webp))"], images);
  watch(["src/bg/**/*.+(jpg|png|webp))"], bg);
  watch(["src/bg/**/*.gif"], gif);
  watch(["src/libr/**/*.+(css|js)"]);
}

function clear() {
  return del('dist')
}

function html() {
    return src("src/*.html")
      .pipe(plumber({
        errorHandler: notify.onError({
          title: 'html',
          message: 'Error: <%= error.message %>',
          sound: false
        })
      }))
      .pipe(changed("dist"))
    
    .pipe(src("src/pug/**/*.pug"))
    .pipe(plumber({
      errorHandler: notify.onError({
        title: 'pug',
        message: 'Error: <%= error.message %>',
        sound: false
      })
    }))
    .pipe(changed("dist"))
      .pipe(pug({ pretty: true }))
    
    .pipe(avifWebpHTML())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("dist"))
}

function styles() {
    return src("src/sass/**/*.sass")
      .pipe(plumber({
        errorHandler: notify.onError({
          title: 'sass',
          message: 'Error: <%= error.message %>',
          sound: false
        })
      }))
      .pipe(changed("dist/css"))
      .pipe(sassGlob())
        .pipe(sass({ outputStyle: "compressed" }))

      .pipe(src("src/scss/**/*.scss"))
      .pipe(plumber({
        errorHandler: notify.onError({
          title: 'scss',
          message: 'Error: <%= error.message %>',
          sound: false
        })
      }))
      .pipe(changed("dist/css"))
      .pipe(sassGlob())
      .pipe(sass({ outputStyle: "compressed" }))

      .pipe(src("src/less/**/*.less"))
      .pipe(plumber({
        errorHandler: notify.onError({
          title: 'less',
          message: 'Error: <%= error.message %>',
          sound: false
        })
      }))
      .pipe(changed("dist/css"))
      .pipe(sassGlob())
        .pipe(less())
        .pipe(csso())

      .pipe(src("src/stylus/**/*.styl"))
      .pipe(plumber({
        errorHandler: notify.onError({
          title: 'stylus',
          message: 'Error: <%= error.message %>',
          sound: false
        })
      }))
      .pipe(changed("dist/css"))
      .pipe(sassGlob())
        .pipe(stylus())
        .pipe(csso())

      .pipe(rename({ suffix: ".min", prefix: "" }))
        .pipe(autoprefixer({
          overridebrowserslist: ['last 2 versions']
        }))
      .pipe(dest("dist/css"))
    .pipe(browserSync.stream())
}

function scripts() {
  return src("src/js/**/*.js")
    .pipe(plumber({
      errorHandler: notify.onError({
        title: 'scripts',
        message: 'Error: <%= error.message %>',
        sound: false
      })
    }))
    .pipe(changed("dist/js"))
      .pipe(uglify())
      .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream())
}

function libraries() {
  return src("src/libr/**/*.css")
    .pipe(plumber({
      errorHandler: notify.onError({
        title: 'csslibraries',
        message: 'Error: <%= error.message %>',
        sound: false
      })
    }))
    .pipe(changed("dist/libr"))
    .pipe(csso())
      .pipe(rename({ suffix: ".min", prefix: "" }))
      .pipe(dest("dist/libr"))
    .pipe(browserSync.stream())

    .pipe(src("src/libr/**/*.js"))
    .pipe(plumber({
      errorHandler: notify.onError({
        title: 'jslibraries',
        message: 'Error: <%= error.message %>',
        sound: false
      })
    }))
    .pipe(changed("dist/libr"))
    .pipe(dest("dist/libr"))
    .pipe(browserSync.stream())
}


function fonts() {
  return src("src/fonts/**/*.ttf")
    .pipe(changed("dist/fonts"))

    .pipe(src("src/fonts/**/*.ttf"))
      .pipe(fonter({
      formats: ['woff']
    }))

    .pipe(src("src/fonts/**/*.ttf"))
      .pipe(fonter({
      formats: ['eot']
    }))

    .pipe(src("src/fonts/**/*.ttf"))
      .pipe(ttf2woff2())

  .pipe(dest("dist/fonts"))
}

function images() {
  return src("src/img/**/*.+(jpg|png)")
    .pipe(changed("dist/img"))
  .pipe(src("scr/img/**/*.jpg"))
    .pipe(avif({quality: 50}))

  .pipe(src("src/img/**/*.png"))
    .pipe(webp({quality: 50}))

  .pipe(src("src/img/**/*.webp"))

  .pipe(src("src/img/**/*.avif"))

  .pipe(dest("dist/img"))
}

function bg() {
  return src(["src/bg/**/*.+(jpg|png))", "!src/bg/*.+(webp|avif)"])
    .pipe(changed("dist/bg"))
  .pipe(src("src/bg/**/*.jpg"))
    .pipe(avif({quality: 50}))

  .pipe(src("src/bg/**/*.png"))
    .pipe(webp({quality: 50}))

  .pipe(src("src/bg/**/*.webp"))

  .pipe(src("src/bg/**/*.avif"))

  .pipe(dest("dist/bg"))
}

function icons() {
  return src("src/icons/**/*.png|webp|svg")
    .pipe(changed("dist/icons"))
  .pipe(src("src/icons/**/*.png"))
    .pipe(webp({quality: 50}))

  .pipe(src("src/icons/**/*.webp"))

  .pipe(src("src/icons/**/*.svg"))
    .pipe(imagemin())

  .pipe(dest("dist/icons"))
}

function gif() {
  return src("src/gif/**/*.gif")
    .pipe(changed("dist/gif"))
      .pipe(dest("dist/gif"))
}

exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.libraries = libraries;
exports.fonts = fonts;
exports.images = images;
exports.icons = icons;
exports.bg = bg;
exports.gif = gif;
exports.watching = watching;

exports.clear = series(clear);
exports.default = parallel(html, styles, scripts, libraries, fonts, images, bg, icons, gif, watching);