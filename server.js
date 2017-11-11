const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
let _ = require('underscore');

let todos =[];
let todoNextId=1;

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('Todo-api ROOT');
});

//GET /todos
app.get('/todos', (req, res)=>{
	res.json(todos);
});

//GET /todos/:id
app.get('/todos/:id', (req, res)=>{
	let todoId = parseInt(req.params.id, 10);
	let matchedTodo = _.findWhere(todos, {id: todoId});

	if(matchedTodo){
		res.json(matchedTodo);	
	}else{
		res.status(404).send('Element not found!');
	}
});

// POST /todos
app.post('/todos',(req, res)=>{
	let body = _.pick(req.body, 'description', 'completed');

	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();	
	}

	body.description = body.description.trim();
	body.id = todoNextId++;
	todos.push(body);
	res.json(todos);
});


app.listen(port, function(){
	console.log('Server running on port: '+ port);
});
