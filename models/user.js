let bcrypt = require('bcrypt');
let _ = require('underscore');

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
			}
		},
		instanceMethods: {
			toPublicJSON: function(){
				let json = this.toJSON();
				return _.pick(json,'id','email','createdAt');
			}
		}
	});
	return user;
};