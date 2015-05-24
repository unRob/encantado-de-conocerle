var $ = require('jquery');

var API = {};

API.resolve = function() {
	var path = [].slice.call(arguments) //Javascript: WINNING!
			.map(function(i) {return i.toString();})
			.join('/');

	var url = API.URL.location+path;
	var req = $.ajax({url: url, type: 'get'});
	return req;
};

API.distrito = function(dto) {
	var url = API.URL.distrito+dto._id+'.json';
	var req = $.ajax({url: url, type: 'get'});
	var promise = $.Deferred();

	req.fail(function fetch_ajax_error(err){
		promise.reject(err);
	});

	req.done(function fetch_ajax_success(res){
		var partes = dto._id.split('-').slice(1,3);
		var nombre_distrito = partes.pop()+'/'+API.entidades[parseInt(partes.pop(), 10)-1];
		var data = {
			_id: dto._id,
			items: res
		};
		data.nombre_distrito = nombre_distrito;
		promise.resolve(data);
	});

	return promise;
};

API.URL = {
	location: "http://representantes.pati.to/busqueda/de-distrito/diputados/",
	distrito: "http://elecciones.rob.mx/candidatoas/"
};

API.entidades = ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Coahuila", "Colima", "Chiapas", "Chihuahua", "Distrito Federal", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"];

module.exports = API;