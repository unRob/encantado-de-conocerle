var Chatoas = React.createClass({
	displayName: 'Chatoas',
	render: function() {
		var chatoas = this.props.data.map(function(chatoa){
			return(
				<Chatoa key={chatoa.nombre} data={chatoa} />
			);
		});
		var count = this.props.data.length;

		return (
			<div id="chatoas">
				<div id="css-ftw">
					<h3>Tus {count} candidatoas:</h3>
				</div>
				{chatoas}
			</div>
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

			return(<li className={"partido "+np}>{p.toLowerCase()}</li>);
		});
		estilo = {backgroundImage: "url("+data.foto+");"};

		return (
			<article className="chatoa clearfix">
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