$(function DOMReady() {

	var loc = document.location.pathname;

	var rpatito = "http://representantes.dev/busqueda/de-distrito/";


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

	var fetch = function(dto) {
		var req = $.ajax({url: "/data/"+dto._id+".json"});
		req.fail(function fetch_ajax_error(err){
			console.error(err);
		});
		req.done(render);
	};

	var render = function(chatoas){
		React.render(React.createElement(Chatoas, {data: chatoas}), document.getElementById('lista'));
		setTimeout(function(){
			// $('.chatoa').eq(1).click();
		}, 500);
	};


	var getPositionAnd = function(doStuff) {
		navigator.geolocation.getCurrentPosition(
			function geo_location(pos) {
				var coords = pos.coords;
				getDetails('diputados', coords.latitude, coords.longitude).done(fetch);
			},
			function geo_error(e){ alert("Lo siento, no pude encontrarte :/"); },
			{
				enableHighAccuracy: true,
				timeout: 10000, //diez segundos
				maximumAge: 60000 //un minuto
			}
		);
	};

	if (loc == '/') {
		getPositionAnd(fetch);
	} else {
		fetch({_id: loc});
	}

});