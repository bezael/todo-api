let bcrypt = require('bcrypt');
let _ = require('underscore');
let cryptoJs= require('cryptojs');
let jwt = require('jsonwebtoken');


module.exports = (sequelize, DataTypes)=>{
	var user =  sequelize.define('user',{
		email:{
			type:DataTypes.STRING,
			allowNull:false,
			unique:true,
			validate:{
				isEmail:true,
			}
		},
		salt:{
			type: DataTypes.STRING
		},
		password_hash:{
			type: DataTypes.STRING
		},
		password:{
			type:DataTypes.VIRTUAL,
			allowNull:false,
			validate:{
				len:[7,50]
			},
			set: function (value){
				let salt = bcrypt.genSaltSync(10);
				let hashedPassword = bcrypt.hashSync(value, salt);
					this.setDataValue('password', value);
					this.setDataValue('salt', salt);
					this.setDataValue('password_hash',hashedPassword);
			}
		}
	},{
		hooks:{
			beforeValidate: (user,options)=>{
				if(typeof user.email === 'string'){
					user.email=user.email.toLowerCase();	
				}		
			}
		},
		classMethods:{
			auth: function(body){
				return new Promise(function(resolve, reject){
					if ( typeof body.email === 'string' && typeof body.email != 'undefine' && body.email != '' && typeof body.password === 'string' && typeof body.password != 'undefine' && body.password != ''){
						user.findOne({
							where:{
								email: body.email
							}
						}).then(function(user){
							if(!user || !bcrypt.compareSync(body.password, user.get('password_hash'))){
								return reject();
							}
							resolve(user);
						}, function(e){
							reject();
						});
					}else{
						return reject(); 
					}
				});
			},
			findByToken: function(token){
				return new Promise(function(resolve, reject){
					try{
						let decodedJWT = jwt.verify(token, 'qwerty098');
						let bytes = cryptoJs.AES.decrypt(decodedJWT.token,'abc123!@#~!');
						let tokenData = JSON.parse(bytes.toString(cryptoJs.enc.Uft8));
						user.findById(tokenData.id).then(function(user){
							if(user){
								resolve(user);
							}else{
								reject();
							}
						}, function(e){
							reject();
						});
					} catch(e){
						reject();
					}
				});
			}
			// 
			// 
		},
		instanceMethods: {
			// toPublicJSON: function(){
			// 	let json = this.toJSON();
			// 	return _.pick(json,'id','email','createdAt');
			// },
			// generateToken: function(type){
			// 	if(!_.isString(type)){
			// 		return undefined;
			// 	}
			// 	try {
			// 		let stringData = JSON.stringify({id: this.get('id'), type: type});
			// 		let encryptedData=  cryptojs.AES.encrypt(stringData, 'abc123!@#~!').toString();
			// 		let token = jwt.sign({
			// 			token: encryptedData
			// 		}, 'qwerty098');
			// 		return token;
			// 	} catch(e){
			// 		console.log(e);
			// 		return undefined;
			// 	}
			// }
		}
	});
	return user;
};