const {
	mix
} = require('laravel-mix');


/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

//Disable uglify, it's having some issues minifying ES6 features
// mix.options({
// 	uglify: true
// });

mix.setPublicPath('./');
mix.js('src/easy-requests.js','./dist')
