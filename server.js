const express = require('express');
const app = express();
const port = process.env.port || 3000;

let todos =[{
	description: 'Meet mom for lunch',
	completed: false
}];



app.get('/', function(req, res){
	res.send('Todo-api ROOT');
});

app.listen(port, function(){
	console.log('Server running on port: '+ port);
});
