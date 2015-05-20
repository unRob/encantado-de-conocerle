var Chatoas = React.createClass({
	displayName: 'Chatoas',
	render: function() {
		var chatoas = this.props.data.map(function(chatoa){
			return(
				React.createElement(Chatoa, {key: chatoa.nombre, data: chatoa})
			);
		});
		var count = this.props.data.length;

		return (
			React.createElement("div", {id: "chatoas"}, 
				React.createElement("div", {id: "css-ftw"}, 
					React.createElement("h3", null, "Tus ", count, " candidatoas:")
				), 
				chatoas
			)
		);
	}
});

var _partidos = {
	'PARTIDO ACCIÓN NACIONAL': 'pan',
	'MOVIMIENTO CIUDADANO': 'mc',
	'NUEVA ALIANZA': 'panal',
	'PARTIDO HUMANISTA': 'ph',
	'ENCUENTRO SOCIAL': 'es',
	'COALICIÓN DE IZQUIERDA PROGRESISTA': 'prd'
};

var Chatoa = React.createClass({
	displayName: 'Chatoa',
	render: function () {
		var data = this.props.data;

		var count_partidos = data.partidos.length;
		var partidos = data.partidos.map(function(p){
			var np = _partidos[p.trim()] || p.toLowerCase();

			console.log(p);
			if (np === 'pan'){
				p = np;
			}

			return(React.createElement("li", {className: "partido "+np}, p.toLowerCase()));
		});
		estilo = {backgroundImage: "url("+data.foto+");"};

		return (
			React.createElement("article", {className: "chatoa clearfix"}, 
				React.createElement("header", {className: count_partidos+"-partidos chatoa-header"}, 
					React.createElement("div", {className: "foto", style: estilo}), 
					React.createElement("h1", null, data.nombre), 
					React.createElement("h2", null, data.suplente), 
					React.createElement("ul", {className: "partidos"}, 
						partidos
					)
				)
			)
		);
	}
});