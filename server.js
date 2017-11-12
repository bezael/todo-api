const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
let _ = require('underscore');

let todos =[];
let todoNextId=1;

app.use(bodyParser.json());

app.use(express.static(__dirname+'/public'));

//GET /todos?completed=true&q=house
app.get('/todos', (req, res)=>{
	let queryParams = req.query;
	let filteredTodos = todos;

	if(queryParams.hasOwnProperty('completed') && queryParams.completed==='true'){
		filteredTodos = _.where(filteredTodos, {completed: true});		
	}else if(queryParams.hasOwnProperty('completed') && queryParams.completed==='false'){
		filteredTodos = _.where(filteredTodos, {completed: false});		
	}

	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
		filteredTodos = _.filter(filteredTodos, (todo)=>{ 
			return todo.description.toLowerCase().indexOf(queryParams.q)  > -1;
		});		
	}

	res.json(filteredTodos);
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

app.listen(port, ()=>{
	console.log('Server running on port: '+ port);
});