const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

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

// POST /todos
app.post('/todos',(req, res)=>{
	let body = req.body;
		body.id = todoNextId++;
	todos.push(body);
	res.json(todos);
});


app.listen(port, function(){
	console.log('Server running on port: '+ port);
});
