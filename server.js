const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const _ = require('underscore');
let db = require('./db.js');

let todos = [];
let todoNextId = 1;

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

//GET /todos?completed=true&q=house
app.get('/todos', (req, res) => {
	let query = req.query;
	let where={};
	
	if(query.hasOwnProperty('completed') && query.completed === 'true'){
		where.completed=true;
	}else if(query.hasOwnProperty('completed') && query.completed==='false'){
		where.completed=false;
	}

	if(query.hasOwnProperty('q') && query.q.length > 0){
		where.description = {
			$like: '%' + query.q + '%'
		};
	}
	db.todo.findAll({where: where}).then(function(todos){
		res.json(todos);
	}, function(e){
		res.status(500).send();
	});

});

//GET /todos/:id
app.get('/todos/:id', (req, res) => {
	let todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function(todo){		
		if(!!todo){	
			res.json(todo.toJSON());
		}else{
			res.status(404).json();
		}
	}, function(e){
		res.status(500).send();
	});		
});

// POST /todos
app.post('/todos', (req, res) => {
	let body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function(todo){	
		res.json(todo.toJSON());
	}, function(e){
		res.status(400).json(e);
	});
});


//DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
	let todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
	   where: {id: todoId}
	}).then(function(rowDelete){ 
	  if(rowDelete === 0){
	     res.status(404).json({
	     	error: 'No todo with id'
	     });
	   }else{
	   	res.send(204).send();
	   }
	}, function(err){
	    res.status(500).send(); 
	});

});


//PUT /todos/:id
app.put('/todos/:id', (req, res) => {
	let todoId = parseInt(req.params.id, 10);
	let matchedTodo = _.findWhere(todos, {
		id: todoId
	});

	let body = _.pick(req.body, 'description', 'completed');
	let validAttibutes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttibutes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttibutes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}
	_.extend(matchedTodo, validAttibutes);
	res.json(matchedTodo);
});

db.sequelize.sync().then(function(){
	app.listen(port, () => {
		console.log('Server running on port: ' + port);
	});	
});
