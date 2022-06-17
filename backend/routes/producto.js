'use_strict'


var express = require('express');
var productoController = require('../controllers/ProductoController');

var api = express.Router();
var auth = require('../middlewares/athenticate');
const { get } = require('mongoose');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir : './uploads/productos'});

// Metodos para productos

api.post('/registro_producto_admin',[auth.auth,path],productoController.registro_producto_admin);
api.get('/listar_productos_admin/:filtro?',auth.auth,productoController.listar_productos_admin);
api.get('/obtener_portada/:img',productoController.obtener_portada);
api.get('/obtener_producto_admin/:id',auth.auth,productoController.obtener_producto_admin);
api.put('/actualizar_producto_admin/:id',[auth.auth,path],productoController.actualizar_producto_admin);
api.delete('/eliminar_producto_admin/:id',auth.auth,productoController.eliminar_producto_admin);
api.put('/actualizar_producto_variedades_admin/:id',auth.auth,productoController.actualizar_producto_variedades_admin);
api.put('/agregar_imagen_galeria_admin/:id',[auth.auth,path],productoController.agregar_imagen_galeria_admin);
api.put('/eliminar_imagen_galeria_admin/:id',auth.auth,productoController.eliminar_imagen_galeria_admin);

// Metodos para inventario

api.get('/listar_inventario_producto_admin/:id',auth.auth,productoController.listar_inventario_producto_admin);
api.delete('/eliminar_inventario_producto_admin/:id',auth.auth,productoController.eliminar_inventario_producto_admin);
api.post('/registro_inventario_producto_admin',auth.auth,productoController.registro_inventario_producto_admin);
module.exports = api;

// Metodos publicos
api.get('/obtener_productos_slug_publico/:slug',productoController.obtener_productos_slug_publico);
api.get('/listar_productos_publico/:filtro?',productoController.listar_productos_publico);



module.exports = api;