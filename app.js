require( 'dotenv' ).config();
const express = require( 'express' );
const ejs = require( 'ejs' );
const mongoose = require( 'mongoose' );
const encrypt = require( 'mongoose-encryption' );

const app = express();

app.use( express.urlencoded( { extended: true } ) );
app.use( express.static( 'public' ) );
app.set( 'view engine', 'ejs' );

mongoose.connect( 'mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true } );

const userSchema = new mongoose.Schema( {
	email: String,
	password: String
} );


userSchema.plugin( encrypt, { secret: process.env.SECRET, encryptedFields: [ 'password' ] } );

const User = mongoose.model( 'User', userSchema );


app.get( '/', ( req, res ) => {
	res.render( 'home' );
} );

app.get( '/register', ( req, res ) => {
	res.render( 'register' );
} );

app.get( '/login', ( req, res ) => {
	res.render( 'login' );
} );


app.post( '/register', ( req, res ) => {
	const user = new User( {
		email: req.body.username,
		password: req.body.password
	} );

	user.save( err => {
		if ( err ) {
			console.log( err );
		} else {
			res.render( 'secrets' );
		}
	} );
} );

app.post( '/login', ( req, res ) => {
	const username = req.body.username;
	const password = req.body.password;

	User.findOne( { email: username }, ( err, foundUser ) => {
		if ( err ) {
			console.log( err );
		} else {
			if ( foundUser.password === password ) {
				res.render( 'secrets' );
			}
		}
	} );
} );










app.listen( 3000, () => {
	console.log( 'Server running on port 3000' );
} );