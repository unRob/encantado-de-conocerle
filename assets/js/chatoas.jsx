var React = require('react');
var $ = require('jquery');

var Chatoas = React.createClass({
	displayName: 'Chatoas',
	render: function() {
		var count = this.props.data.length;

		return (
			<div id="chatoas">
				<div id="css-ftw">
					<h3>Tus {count} candidatoas:</h3>
					<h2>Distrito {this.props.nombre} <a id="reload">x</a></h2>
				</div>
				{this.props.data.map(function(chatoa){
					return <Chatoa key={chatoa.nombre.toLocaleLowerCase().replace(/\s/g, '-')} data={chatoa} />
				})}
			</div>
		);
	}
});

var _partidos = {
	'movimiento ciudadano': 'mc',
	'nueva alianza': 'panal',
	'partido humanista': 'ph',
	'encuentro social': 'es',
};

var Chatoa = React.createClass({
	displayName: 'Chatoa',
	show: function() {
		$('#resultados').addClass('detallados');
		var node = document.getElementById('candidatoa');
		React.unmountComponentAtNode(node);
		React.render(<Candidatoa data={this.props.data} />, node);
	},
	render: function () {
		var data = this.props.data;

		var count_partidos = data.partidos.length;
		var partidos = data.partidos.map(function(p){
			var np = _partidos[p.trim()] || p.toLowerCase();
			return(<li key={np} className={"partido "+np}>{p.toLowerCase()}</li>);
		});
		estilo = {backgroundImage: "url("+data.foto+")"};

		return (
			<article className="chatoa clearfix" onClick={this.show}>
				<header className={count_partidos+"-partidos chatoa-header"}>
					<div className="foto" style={estilo}></div>
					<h1>{data.nombre}</h1>
					<h2>{data.suplente}</h2>
					<ul className="partidos">
						{partidos}
					</ul>
				</header>

			</article>
		);
	}
});

var Candidatoa = React.createClass({
	displayName: 'Candidatoa',
	hide: function(){
		$('#resultados').removeClass('detallados');
	},
	lines: function(text) {
		return text.split("\n").map(function(l){ return(<p>{l}</p>); });
	},
	mentiras: function(d) {
		var laboral, trayectoria;
		if (d.mentiras.laborales || d.mentiras.trayectoria) {
			if (d.mentiras.laborales) {
				laboral = (
					<div className="mentira">
						<h3>Historia Profesional/laboral</h3>
						{this.lines(d.mentiras.laborales)}
					</div>
				);
			}

			if (d.mentiras.trayectoria) {
				trayectoria = (
					<div className="mentira">
						<h3>Trayectoria política</h3>
						{this.lines(d.mentiras.trayectoria)}
					</div>
				);
			}

			return (
				<div id="mentiras">
					{laboral}
					{trayectoria}
				</div>
			);
		}
	},
	social: function(data) {
		var redes = data.map(function(datum){
			return (
				<li>
					<a className={datum.red} href={datum.url} target="_blank">{datum.red}</a>
				</li>
			);
		});

		return(
			<ul id="social">
				{redes}
			</ul>
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


		var social = this.social(otros.concat(d.social || []));

		return (
			<div id="datum">
				{social}

				{this.mentiras(d)}
			</div>
		);
	},
	render: function(){
		var data = this.props.data;
		var partidos = data.partidos.map(function(p){
			var np = _partidos[p.trim()] || p.toLowerCase();
			if (np === 'pan'){
				p = np;
			}

			return(<li key={np} className={"partido "+np}>{p.toLowerCase()}</li>);
		});

		estilo = {backgroundImage: "url("+data.foto+")"};

		var templete;

		if (data.mentiras.templete) {
			templete = this.lines(data.mentiras.templete);
		}

		return (
			<section>
				<button id="regresar" onClick={this.hide}>&laquo; regresar</button>
				<header className="chatoa-header">
					<div className="foto" style={estilo}></div>
					<h1>{data.nombre}</h1>
					<h2>{data.suplente}</h2>

					<ul className="partidos">
						{partidos}
					</ul>

					<div className="templete">{templete}</div>

				</header>

				{this.body()}

			</section>
		);
	}
});

module.exports = Chatoas;