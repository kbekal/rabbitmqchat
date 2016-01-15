var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var userSchema = new Schema({
	id: {
		type: String,
		index: true
	},
	name: String,
	first_name: String,
	last_name: String,
	login_type: String,
	create_date: String,
	last_login: String,
	friends: [String]
	
});

var User = mongoose.model('User', userSchema);
module.exports = {User: User};