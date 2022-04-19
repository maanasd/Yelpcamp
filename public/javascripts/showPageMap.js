mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 4 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ Offset: 25 })
    .setHTML(
        `<h3>${campground.title}</h3>
        <p>${campground.location}</p>`
    )
)
.addTo(map);