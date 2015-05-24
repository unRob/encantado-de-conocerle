var $ = require('jquery');
var React = require('react');
var Chatoas = require('./chatoas.jsx');
var API = require('./api.js');
var Mapa = require('./mapa.js');
var api_key = 'AIzaSyD8qYIlRcEaYrYrAjKtE6Rz8XoMisOhiGI';

$(function DOMReady() {

	var loc = document.location.pathname.substr(1);

	var got_details = function(info) {
		window.title = info.nombre_distrito;
		window.history.pushState(info, "Candidatoas para Distrito "+info.nombre_distrito, "/"+info._id);
		React.render(React.createElement(Chatoas, {data: info.items, nombre: info.nombre_distrito}), document.getElementById('lista'));
	};

	var got_distrito = function(info) {
		var dto = API.distrito(info);
		dto.then(got_details);
	};

	$('#fetch-me').on('click', function(evt){
		evt.preventDefault();
		var pos = Mapa.marker.getPosition();
		API.resolve(pos.lat(), pos.lng())
			.done(function(info){
				got_distrito(info);
				$('#mapa').hide();
			})
			.fail(function(err){
				$('#mapa').show();
				alert("No encontré un distrito electoral para tu ubicación");
			});
	});

	$('#resultados').on('click', '#reload', function(evt){
		evt.preventDefault();
		window.title = 'Candidatoas 2015';
		window.history.pushState({}, "Candidatoas 2015", "/");
		$('#lista').html('');
		$('#mapa').show();
		Mapa.instance('#mapa').setup(api_key).input.focus();
		return false;
	});


	var getPositionAnd = function(doStuff) {
		if (navigator.hasOwnProperty('geolocation')){
			navigator.geolocation.getCurrentPosition(
				function geo_location(pos) {
					var coords = pos.coords;
					var resolved = API.resolve(coords.latitude, coords.longitude);
					resolved.done(got_distrito);
					resolved.fail(function(err){
						alert("No encontré un distrito electoral para tu ubicación");
						Mapa.instance('#mapa').setup(api_key);
					});
				},
				function geo_error(e) {
					if (e.code == e.PERMISSION_DENIED) {
						if (confirm("Esta aplicación usa tu información geográfica para obtener tu distrito electoral. En ningún momento se guarda tu ubicación geográfica ni se relaciona de manera personalmente identificable, porque no somos malvados, sólo queremos hacer las cosas fáciles.\n\n¿Podemos volver a intentar a pedir tu ubicación?")){
							return getPositionAnd(doStuff);
						}
					}

					Mapa.instance('#mapa').setup(api_key);
				},
				{
					enableHighAccuracy: true,
					timeout: 10000, //diez segundos
					maximumAge: 60000 //un minuto
				}
			);
		} else {
			Mapa.instance('#mapa').setup(api_key);
		}

	};

	if (loc === '') {
		getPositionAnd(got_details);
	} else {
		API.distrito({_id: loc}).then(got_details);
	}

});