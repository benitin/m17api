var express = require('express')
var app     = express()
var http    = require('http').Server(app)
var bodyParser= require('body-parser')


var config  = require('./config')
var cliente = require('./controllers/cliente')
var pedido = require('./controllers/pedido')
var producto = require('./controllers/producto')

app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

// Code

app.get('/*', function(req, res, next){ 
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  next(); 
});
var router = express.Router()

router.get('/', function(req, res){
	res.status(200).jsonp({message:'API Rest - With Node JS - Event Driven Architecture'})
})

// Cliente
router.route('/login')
	.post(cliente.login)
router.route('/cliente/pedidos/:idCliente')
    .get(cliente.pedidos)
router.route('/cliente/puntosentrega/:idCliente')
    .get(cliente.puntosentrega)

// Pedido
router.route('/pedido')
    .post(pedido.save)
router.route('/pedido/:estado')
    .get(pedido.list)
// Producto    
router.route('/producto')
    .get(producto.list)

/* Test
router.route('/test')
 	.get(cliente.testList)
	.post(cliente.test)*/

	
// Init Listening
app.use('/api', router)
app.disable('etag')




// End Code

// RTA
var io     = require('socket.io')(http),
    events = require('events')
 global.serverEmitter = new events.EventEmitter()
// RTA
io.on('connection', function (socket) {
    /*socket.on('chat message', function(msg){
        io.emit('chat message', msg)
    })*/
    global.serverEmitter.on("emit",function(data){
    	socket.emit("emit",data)
    })
    console.log('user connect')
})
// end RTA


// Inciamos la api
http.listen(config.serverconfig.port, function(){
	console.log(new Date().toISOString().substring(0, 19)+':escuchando en el puerto *:' + config.serverconfig.port)
})

