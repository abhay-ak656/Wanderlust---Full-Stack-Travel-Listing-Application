mapboxgl.accessToken = window.MAPBOX_TOKEN
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v12', // style URL
	center:window.listing.geometry.coordinates, // starting position [lng, lat]
	zoom: 9, // starting zoom
});


const marker1=new mapboxgl.Marker({color:'red'})
.setLngLat(window.listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${window.listing.title|| 'Location'}</h4>Exact location provided after booking`))
.addTo(map);
