const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
let _ = require('underscore');

let todos =[
		{
		    "description": "Mansion",
		    "completed": false,
		    "id": 1
		},
		{
		    "description": "Apart",
		    "completed": true,
		    "id": 2
		},
		{
		    "description": "Casa",
		    "completed": false,
		    "id": 3
		},
		{
		    "description": "Finca",
		    "completed": false,
		    "id": 4
		}
];
let todoNextId=1;

app.use(bodyParser.json());

// app.get('/', function(req, res){
// 	res.send('Todo-api ROOT');
// });

app.use(express.static(__dirname+'/public'));


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


//DELETE /todos/:id
app.delete('/todos/:id', (req, res)=>{
	let todoId = parseInt(req.params.id,10);
	let matchedTodo = _.findWhere(todos, {id:todoId});
		todos = _.without(todos, matchedTodo);
	
	if(matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).json({"error": "no todo found with that id"});
	}
});


//PUT /todos/:id
app.put('/todos/:id',(req, res)=>{
	let todoId = parseInt(req.params.id,10);
	let matchedTodo = _.findWhere(todos, {id:todoId});

	let body = _.pick(req.body, 'description', 'completed');
	let validAttibutes ={};

	if(!matchedTodo){
		return res.status(404).send();
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttibutes.completed =body.completed;
	}else if(body.hasOwnProperty('completed')){
		return res.status(400).send();
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttibutes.description=body.description;
	}else if(body.hasOwnProperty('description')){
		return res.status(400).send();
	}
	_.extend(matchedTodo, validAttibutes);
	res.json(matchedTodo);
});




app.listen(port, function(){
	console.log('Server running on port: '+ port);
});
