'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const xml2js = require('xml2js');
const _version = require('./version');
const { Command } = require('commander');

let sqlstr = '';

// ------------------
// main async and catching all exceptions
main().catch (e => {
	console.error(e);
	process.exitCode = -1;
});

// ------------------
// main
async function main () {

	const program = new Command();
	program
		.name('xml to sql')
		.description('CLI conversion xml zo sqlauthor: philippe simonet')
		.addHelpText('after',
			`\n\n xxx, \n` +
			'  xxx ')
		// .version('version : ' + _version)
		.option('--dataPath <datapath>', 'path of xml files', './')
		.option('--fileFilter <fileFilter>', 'file filter patter (regexp)', '.*')
		.option('--output <output>', 'output sql file', 'out.sql')
		.option('--tablePrefix <output>', 'sql table prefix', '')

	program.parse();
	const options = program.opts();

	if (!fs.existsSync(options.dataPath)){
		throw 'error: data path not found'
	}

	let types = {};
	fs.readdirSync(options.dataPath, { withFileTypes: true }).forEach(file => {

		let fn = file.name.match(/^(.*)\.xml$/);

		if (!fn || fn.length < 2) return;
		if (!file.name.match(options.fileFilter)) return;

		const fkey = fn[1];
		console.log(`processing ${fkey}`);

		let xmlfile = path.join(options.dataPath, file.name);
		const xmlstr = fs.readFileSync(xmlfile, {encoding:'utf8', flag:'r'});

		let tablename = options.tablePrefix + fkey;

		sqlstr += `
DROP TABLE IF EXISTS \`${tablename}\`;
CREATE TABLE \`${tablename}\` (
  \`type\` varchar(20) DEFAULT NULL,
  \`msecs\` int(5) DEFAULT NULL,
  \`type2\` varchar(35) DEFAULT NULL,
  \`value\` varchar(26) DEFAULT NULL,
  \`units\` varchar(7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO \`${tablename}\` (\`type\`, \`msecs\`, \`type2\`, \`value\`, \`units\`) VALUES
`;

		xml2js.parseString(xmlstr,
			{explicitArray:false, trim: true, mergeAttrs:true},
			function (err, result) {
				if (err) {
					throw err;
				} else {
					result?.eventList?.evt.forEach((evt) => {
						evt?.param.forEach((param) => {
							// console.log(fkey, evt.type, evt.msecs, param.type, param.value ||'-', param.units ||'-');
							sqlstr += `('${evt.type}',${evt.msecs},'${param.type}','${param.value ||''}','${param.units ||''}'),\n`;

							// some statistics
							if (types[evt.type] === undefined) {
								types[evt.type] = {};
							}
							// types[evt.type]++;
							types[evt.type][param.type] = param.units;
						});
					})
				}
			}
		);
		sqlstr = sqlstr.slice(0,-2)+ `;\n`;
		// console.log(sqlstr);
		// console.log(types);
		// process.exit(0);
	});

	fs.writeFileSync(options.output,
		sqlstr,
		{	encoding: "utf8", flag: "w"}
	);


	// const xmlstr = fs.readFileSync(xmlfile, {encoding:'utf8', flag:'r'});
	// console.log(sqlstr);
	// console.log(types);
}
