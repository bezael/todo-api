let Sequelize = require('sequelize');
let sequilize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage':__dirname + '/basic-sqlite-database.sqlite'
});

let Todo = sequilize.define('todo', {
	description:{
		type:Sequelize.STRING,
		allowNull: false,
		validate: {
			len:[1,250]			
		}
	},
	completed:{
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequilize.sync({
	//force:true
}).then(function(){
	console.log('Everthing is synced');
	Todo.findById(3).then(function(todo){
		
		if(todo){	
			console.log(todo.toJSON());
		}else{
			console.log('no todo found');
		}
	});
	// Todo.create({
	// 	description: 'Pick up bread',		
	// }).then(function(todo){
	// 	return Todo.create({
	// 		description: 'Clean office'
	// 	});
	// }).then(function(){
	// 	// return Todo.findById(1);
	// 	 return Todo.findAll({ 
	// 	 	where: {
	// 	 		description: {
	// 	 			$like: '%office%'
	// 	 		}
	// 	 	}
	// 	  });
	// }).then(function(todos){
	// 	if(todos){
	// 		todos.forEach(function(todo){
	// 			console.log(todo.toJSON());
	// 		});
			
	// 	}else{
	// 		console.log('no todos found!');
	// 	}
	// }).catch(function(e){
	// 	console.log(e);
	// });
});