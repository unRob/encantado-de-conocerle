var $ = require('jquery');
var React = require('react');
var Chatoas = require('./chatoas.jsx');

$(function DOMReady() {

	var loc = document.location.pathname.substr(1);

	var rpatito = "http://representantes.pati.to/busqueda/de-distrito/";

	var getDetails = function() {
		var path = [].slice.call(arguments) //Javascript: WINNING!
			.map(function(i) {return i.toString();})
			.join('/');

		var url = rpatito+path;
		var req = $.ajax({url: url, type: 'get'});
		req.fail(function ajax_error(data){
			console.error(data);
		});
		return req;
	};

	var entidades = ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Coahuila", "Colima", "Chiapas", "Chihuahua", "Distrito Federal", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"];

	var fetch = function(dto) {
		var req = $.ajax({url: "http://elecciones.rob.mx/candidatoas/"+dto._id+".json"});
		req.fail(function fetch_ajax_error(err){
			console.error(err);
		});
		req.done(function(res){
			var partes = dto._id.split('-').slice(1,3);
			var nombre_distrito = partes.pop()+'/'+entidades[parseInt(partes.pop(), 10)-1];
			window.title = nombre_distrito;
			res.nombre_distrito = nombre_distrito;
			render(res);
			window.history.pushState(dto, "Candidatoas para Distrito "+nombre_distrito, "/"+dto._id);
		});
	};

	var render = function(chatoas){
		React.render(React.createElement(Chatoas, {data: chatoas}), document.getElementById('lista'));
	};


	var getPositionAnd = function(doStuff) {
		navigator.geolocation.getCurrentPosition(
			function geo_location(pos) {
				var coords = pos.coords;
				getDetails('diputados', coords.latitude, coords.longitude).done(fetch);
			},
			function geo_error(e) {
				if (e.code == e.PERMISSION_DENIED) {
					if (confirm("Esta aplicación usa tu información geográfica para obtener tu distrito electoral. En ningún momento se guarda tu ubicación geográfica ni se relaciona de manera personalmente identificable, porque no somos malvados, sólo queremos hacer las cosas fáciles.\n\n¿Podemos volver a intentar a pedir tu ubicación?")){
						getPositionAnd(doStuff);
					} else {
						$('#resultados').html("Ni que hacerle, revisa tus candidatos en el <a href='http://www.ine.mx/portal/Elecciones/Proceso_Electoral_Federal_2014-2015/CandidatasyCandidatos/'>INE</a>.");
					}
				} else {
					alert("Algo no funcionó al intentar localizarte, y el programador que hizo este asunto no contempló que esto fuera a suceder, lo siento!");
				}
			},
			{
				enableHighAccuracy: true,
				timeout: 10000, //diez segundos
				maximumAge: 60000 //un minuto
			}
		);
	};

	if (loc === '') {
		getPositionAnd(fetch);
	} else {
		fetch({_id: loc});
	}

});