var $ = require('jquery');

var self = null;
var Mapa = function(selector){
	this.container = $(selector);
	this.input = $('#text-locator');
	this.is_setup = null;
	self = this;
};

Mapa.prototype.setup = function(api_key){
	if (this.is_setup) {
		return false;
	}
	this.is_setup = true;
	this.container.removeClass('hidden');
	$('#fetch-me').hide();

	var script = document.createElement('script');
	script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&callback=_initialize_mapa&key='+api_key;
	document.body.appendChild(script);
	this.input.focus();

	return this;
};

Mapa.geo_query = null;
Mapa.geo_timeout = null;
Mapa.geocoder = null;
Mapa.marker = null;

Mapa.prototype.query = function(text) {
	// if (text.match(/^\d+$/)) {
	// 	console.log('buscando seccion');
	// } else {
		// console.log('geocoding');
		var request = {
			address: text,
			componentRestrictions: {country: 'MX'}
		};
		Mapa.geocoder.geocode(request, function(res){
			if (res.length > 0) {
				var geo = res[0].geometry.location;
				self.set_marker(geo);
			}
		});
	// }
};

Mapa.prototype.set_marker = function(pos) {
	if (!Mapa.marker) {
		Mapa.marker = new google.maps.Marker({
			position: pos,
			map: self.map,
			animation: google.maps.Animation.DROP
		});
	} else {
		Mapa.marker.setPosition(pos);
	}

	self.map.panTo(pos);
	self.map.setZoom(16);
	$('#fetch-me').show();
};

window._initialize_mapa = function(){
	var opts = {
		center: {lat: 22.0, lng: -100.0},
		zoom: 4,
		panControl: false,
		streetViewControl: false,
		mapTypeControl: false
	};

	self.map = new google.maps.Map(document.querySelector('#google-map'), opts);
	Mapa.geocoder = new google.maps.Geocoder();

	self.input.on('keyup', function(evt){
		$('#fetch-me').hide();
		var val = $.trim(evt.target.value);
		if (val === '') {
			return false;
		}
		clearTimeout(Mapa.geo_timeout);
		Mapa.geo_timeout = setTimeout(function(){
			self.query(val);
		}, 700);

	});
};

Mapa.instance = function(){
	if (self === null) {
		self = new Mapa(arguments[0]);
	}
	return self;
};

module.exports = Mapa;