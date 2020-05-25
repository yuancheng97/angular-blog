let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');

const secret_key = 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c';

router.get('/', function(req,res,next){
	if (!checker(req)){
		res.status(301).redirect("//localhost:3000/login?redirect=/editor/");
	}
	next();
});


function checker(req){
	let token = req.cookies.jwt;
	if(!token){
		console.log("JWT does not exist.");
		return false;
	}
	try{
		let decode = jwt.verify(token,secret_key);
		let now = Math.floor(Date.now()/1000);
		console.log("expire: " + decode.exp + "now: " + now);
		if (decode.exp <= now){
			return false;
		}
	}
	catch(err){
		console.log("Error with jwt");
		return false;
	}

	console.log("JWT OK");
	return true;
}


module.exports = router;