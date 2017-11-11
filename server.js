const port = process.env.PORT || 3000;
const express = require('express');
const app = express();

let todos =[
	{
		id: 1,
		description: 'Meet mom for lunch',
		completed: false
	},
	{
		id: 2,
		description: 'Go to market',
		completed: false
	},
	{
		id: 3,
		description: 'Go to barber shop',
		completed: true
	}
];

//GET /todos
app.get('/todos', (req, res)=>{
	res.json(todos);
});

//GET /todos/:id
app.get('/todos/:id', (req, res)=>{
	let todoId = parseInt(req.params.id, 10);
	let matchedTodo;
	todos.forEach(function(element){
		if(element.id === todoId){			
			matchedTodo=element;
		}
	});

	if(matchedTodo){
		res.json(matchedTodo);	
	}else{
		res.status(404).send('Element not found!');
	}
});

app.get('/', function(req, res){
	res.send('Todo-api ROOT');
});

app.listen(port, function(){
	console.log('Server running on port: '+ port);
});
