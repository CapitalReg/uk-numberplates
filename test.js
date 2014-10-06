// Include the validation module...
validation = require('./uk-numberplates.js');

// Build an array of scrambled registrations to work with...
var registrations = new Array();
registrations.push('a123sTe');
registrations.push('a1');
registrations.push('BAZ76');
registrations.push('rgbHEX');
registrations.push('999tst');
registrations.push('ab98ste');

// Loop each registration and run it through the validator...
for(var i = 0; i<registrations.length; i++) {
	var reg = registrations[i];
	validation.validate(reg, function(err,data) {

		console.log('Registration checked = ' + reg);
		console.log('Response: ');
		console.log('Error: ' + err);
		console.log(data);
		console.log('-----------------------------');

	});
}