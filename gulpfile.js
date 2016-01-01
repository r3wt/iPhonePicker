var gulp  = require('gulp'),
	fs    = require('fs'),
	jsp = require('uglify-js').parser,
	pro = require('uglify-js').uglify;



gulp.task('default', function() {
	var code = '',
	replace = {
		'{{version}}':'1.1.1',
	};
	var copyright = fs.readFileSync('./copyright.txt','utf8') + '\r\n',
		file = fs.readFileSync('./iphonepicker.js','utf8');
		
	for(var prop in replace){
		var reg = new RegExp(prop, 'g');
		copyright = copyright.replace(reg,replace[prop]);
		file = file.replace(reg,replace[prop]);
	}
	var tmp = file.split('\r\n');
	for(var j=0;j<tmp.length;j++){
		tmp[j] = tmp[j]+'\r\n';
	}
	file = tmp.join('');
	code +=file.replace(/\t/g,'    ');
	fs.writeFile('./build/iphonepicker-'+replace['{{version}}']+'.js',copyright+code, 'utf8',function(){
		var ast = jsp.parse(code); // parse code and get the initial AST
		ast = pro.ast_mangle(ast); // get a new AST with mangled names
		ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
		var final_code = pro.gen_code(ast); // compressed code here
		fs.writeFile('./build/iphonepicker-'+replace['{{version}}']+'.min.js',copyright+final_code,'utf8');
	});

});
