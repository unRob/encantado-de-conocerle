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
	show: function() {
		$('#resultados').addClass('detallados');
		var node = document.getElementById('candidatoa');
		React.unmountComponentAtNode(node);
		React.render(React.createElement(Candidatoa, {data: this.props.data}), node);
	},
	render: function () {
		var data = this.props.data;

		var count_partidos = data.partidos.length;
		var partidos = data.partidos.map(function(p){
			var np = _partidos[p.trim()] || p.toLowerCase();
			if (np === 'pan'){
				p = np;
			}

			return(React.createElement("li", {className: "partido "+np}, p.toLowerCase()));
		});
		estilo = {backgroundImage: "url("+data.foto+");"};

		return (
			React.createElement("article", {className: "chatoa clearfix", onClick: this.show}, 
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

var Candidatoa = React.createClass({
	displayName: 'Candidatoa',
	hide: function(){
		$('#resultados').removeClass('detallados');
	},
	lines: function(text) {
		return text.split("\n").map(function(l){ return(React.createElement("p", null, l)); });
	},
	mentiras: function(d) {
		var laboral, trayectoria;
		if (d.mentiras.laborales || d.mentiras.trayectoria) {
			if (d.mentiras.laborales) {
				laboral = (
					React.createElement("div", {class: "mentira"}, 
						React.createElement("h3", null, "Historia Profesional/laboral"), 
						this.lines(d.mentiras.laborales)
					)
				);
			}

			if (d.mentiras.trayectoria) {
				trayectoria = (
					React.createElement("div", {class: "mentira"}, 
						React.createElement("h3", null, "Trayectoria política"), 
						this.lines(d.mentiras.trayectoria)
					)
				);
			}

			return (
				React.createElement("div", {id: "mentiras"}, 
					laboral, 
					trayectoria
				)
			);
		}
	},
	social: function(data) {
		console.log(data);
		var redes = data.map(function(datum){
			return (
				React.createElement("li", null, 
					React.createElement("a", {className: datum.red, href: datum.url}, datum.red)
				)
			);
		});

		return(
			React.createElement("ul", {id: "social"}, 
				redes
			)
		);
	},
	body: function(){
		var d = this.props.data;

		var otros = [];
		if (d.telefono) {
			otros.push({red: 'telefono', url: "tel://"+d.telefono});
		}

		if (d.correo) {
			otros.push({red: 'correo', url: "mailto:"+d.correo});
		}


		var social = this.social(otros.concat(social || []));

		return (
			React.createElement("div", {id: "datum"}, 
				social, 

				this.mentiras(d)
			)
		);
	},
	render: function(){
		var data = this.props.data;
		var partidos = data.partidos.map(function(p){
			var np = _partidos[p.trim()] || p.toLowerCase();
			if (np === 'pan'){
				p = np;
			}

			return(React.createElement("li", {className: "partido "+np}, p.toLowerCase()));
		});

		estilo = {backgroundImage: "url("+data.foto+");"};

		var templete;

		if (data.mentiras.templete) {
			templete = this.lines(data.mentiras.templete);
		}

		return (
			React.createElement("section", null, 
				React.createElement("button", {id: "regresar", onClick: this.hide}, "« regresar"), 
				React.createElement("header", {className: "chatoa-header"}, 
					React.createElement("div", {className: "foto", style: estilo}), 
					React.createElement("h1", null, data.nombre), 
					React.createElement("h2", null, data.suplente), 

					React.createElement("ul", {className: "partidos"}, 
						partidos
					), 

					React.createElement("div", {className: "templete"}, templete)

				), 

				this.body()

			)
		);
	}
});