// Initialize map
var map = L.map('map', {
    fullscreenControl: true
//}).setView([61.15, -149.7], 9);
}).setView([60.9, -150.1], 8);



// Define  individual tile layers
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

var esriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxzoom: 18,
    attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics'
});

var labelLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',{
    maxZoom: 18,
    attribution: 'Places © Esri'
});

var streetLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',{
    maxZoom: 18,
    attribution: 'Street labels © Esri'
});

var googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0','mt1','mt2','mt3'],
    attribution: '© Google'
});

var googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Map data &copy; Google'
});

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: © OpenStreetMap, SRTM | Map style: © OpenTopoMap'
});

var usgsTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16,
    attribution: 'Tiles courtesy of the <a href="https://www.usgs.gov/">U.S. Geological Survey</a>'
});

var esriHybrid = L.layerGroup([esriSat, labelLayer, streetLabels])

// Add default layer to the map
esriHybrid.addTo(map);

// Basemap control panel
var baseMaps = {
    "OpenStreetMap": osm,
    "Esri Satellite Imagery": esriSat,
    "Esri Hybrid Imagery": esriHybrid,
    "Google Satellite Imagery": googleSat,
    "Google Hybrid Imagery": googleHybrid,
    "USGS Topographic Map": usgsTopo,
    "OpenTopoMap": topo
};

// Add control panel to map
var layerControl = L.control.layers(baseMaps).addTo(map);
// L.control.layers(baseMaps).addTo(map);

var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    div.id = "legend";

    div.innerHTML = `
        <div id="legend-toggle" style="cursor:pointer;font-weight:bold;">
            Fuel Treatment Legend ▼
        </div>
        <div id="legend-content" style="display:none;"></div>
    `;
    
    var areas = {
      "Basher 1": "#2ff381",
      "Basher 2": "#00692c",
      "Basher 3": "#249754",
      "Basher 4": "#7cfb98",

      "Stuckagain Heights 1": "#08009c",
      "Stuckagain Heights 2": "#2033ac",

      "Gasline 1": "#d86609",
      "Gasline 2": "#fda000",

      "Heights Hill": "#ff00c8",

      "Hilltop": "#ff2108",
      "Hilltop 2": "#d55020",
      "Prospect Heights": "#d43d17",

      "Abbott Loop Northwest": "#ffd900",
      "Abbott Loop Northeast": "#d1bc00",
      "Abbott Loop West": "#efff08",
      "Abbott Loop West Pre": "#e4f127",
      "Abbott Loop Center": "#c7c713",
      "Abbott Loop Center Pre": "#dfdf47",
      "Abbott Loop East": "#fffc52",
      "Abbott Loop East Pre": "#fffd90",

      "Speedway East": "#b0821f",
      "Speedway West": "#b79900",

      "Sahalee": "#720303",

      "Hiland Upper": "#68bdf5",
      "Hiland Lower": "#2182c3",

      "Grandview": "#221236",
      "Moose River": "#ac05c2",
      "Three Johns North": "#6e1893",
      "Three Johns Center": "#9746e8",
      "Three Johns South": "#821cc1",
      "USFWS Preset": "#3e2c73",

      "100th Street Fire": "#666378",
      "Goose Lake Fire": "#797c82"};

    const content = div.querySelector("#legend-content");

    for (const area in areas) {
        content.innerHTML += `
            <i style="background:${areas[area]}"></i>
            ${area}<br>
        `;
    }

    const toggle = div.querySelector("#legend-toggle");

    toggle.addEventListener("click", function () {
        if (content.style.display === "none") {
            content.style.display = "block";
            toggle.innerHTML = "Fuel Treatment Legend ▲";
        } else {
            content.style.display = "none";
            toggle.innerHTML = "Fuel Treatment Legend ▼";
        }
    });


    div.innerHTML += "</div>";

    return div;
  };

legend.addTo(map);

document.getElementById("legend-toggle").onclick = function () {
    const content = document.getElementById("legend-content");
    const toggle = document.getElementById("legend-toggle");

    if (content.style.display === "none") {
        content.style.display = "block";
        toggle.innerHTML = "Fuel Treatment Legend ▲";
    } else {
        content.style.display = "none";
        toggle.innerHTML = "Fuel Treatment Legend ▼";
    }
};

var title = L.control({ position: "topleft" });

title.onAdd = function (map) {
    var div = L.DomUtil.create("div", "map-title");
    div.innerHTML = `
        360° Tour of Anchorage-Area Fuel Treatments
        <div class="map-subtitle">Imagery taken by Springer Moore, Jen Schmidt and Adina Salant, 2026</div>
    `;
    return div;
};

title.addTo(map);


map.on("popupopen", function () {
    document.getElementById("legend").style.display = "none";
    document.querySelector(".map-title").style.display = "none";
});

map.on("popupclose", function () {
    document.getElementById("legend").style.display = "block";
    document.querySelector(".map-title").style.display = "block";
});


// Load GeoJSON dynamically
//fetch("https://raw.githubusercontent.com/jenniferschmidt/fuelbreaks-webmap/refs/heads/main/points.geojson")
fetch("./points.geojson")
  .then(response => response.json())
  .then(data => {
    const markerColors = {
      "Basher 1": "#2ff381",
      "Basher 2": "#00692c",
      "Basher 3": "#249754",
      "Basher 4": "#7cfb98",

      "Stuckagain Heights 1": "#08009c",
      "Stuckagain Heights 2": "#2033ac",

      "Gasline 1": "#d86609",
      "Gasline 2": "#fda000",

      "Heights Hill": "#ff00c8",

      "Hilltop": "#ff2108",
      "Hilltop 2": "#d55020",
      "Prospect Heights": "#c82d06",

      "Abbott Loop Northwest": "#ffd900",
      "Abbott Loop Northeast": "#d1bc00",
      "Abbott Loop West": "#efff08",
      "Abbott Loop West Pre": "#e4f127",
      "Abbott Loop Center": "#c7c713",
      "Abbott Loop Center Pre": "#dfdf47",
      "Abbott Loop East": "#fffc52",
      "Abbott Loop East Pre": "#fffd90",

      "Speedway East": "#b0821f",
      "Speedway West": "#b79900",

      "Sahalee": "#720303",

      "Hiland Upper": "#68bdf5",
      "Hiland Lower": "#2182c3",

      "Grandview": "#221236",
      "Moose River": "#ac05c2",
      "Three Johns North": "#6e1893",
      "Three Johns Center": "#9746e8",
      "Three Johns South": "#821cc1",
      "USFWS Preset": "#3e2c73",

      "100th Street Fire": "#666378",
      "Goose Lake Fire": "#797c82"};

      
    var pointLayer = L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        const area = feature.properties.name;
        const color = markerColors[area] || "#000000"; // fallback black

        return L.circleMarker(latlng, {
          radius: 7,
          fillColor: color,
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.9});
      },

      onEachFeature: function (feature, layer) {

        layer.on('click', function () {

          // Unique container ID for each popup
          var containerId = "pano_" + Date.now();

          const collectionDate = feature.properties.col_date;

          var popupContent = `
            <div style="font-size:14px; margin-bottom:6px;">
                ${feature.properties.name} </b>Point</b> ${feature.properties.flag_id} <br>
                <b> Date Collected:</b> ${collectionDate}
            </div>

            <div class="pano-container" id="${containerId}"></div>
          `;

          layer.bindPopup(popupContent, { maxWidth: 450 }).openPopup();

          // Delay to ensure popup is rendered
          setTimeout(function () {
            pannellum.viewer(containerId, {
              type: "equirectangular",
              //panorama: feature.properties.image_url, //(github upload)
              //panorama: feature.properties.wordpress_url, //wordpress upload
              panorama: "https://alaskanrm.com/360images/"+feature.properties.filename+".jpg",
              autoLoad: true,
              showZoomCtrl: true,
              fullscreenButton: true
            });
          }, 200);
        });
      }
    }).addTo(map);
    layerControl.addOverlay(pointLayer, "360° Image Points");
    
  });

// Load line layer with attached 360° videos
//fetch("https://raw.githubusercontent.com/jenniferschmidt/fuelbreaks-webmap/refs/heads/main/lines.geojson")
fetch("./lines.geojson")
  .then(response => response.json())
  .then(lines => {

    var lineLayer = L.geoJSON(lines, {
      style: function(feature) {
        return {
          color: "#ff6600",
          weight: 4,
          opacity: 0.9
        };
      },

      onEachFeature: function(feature, layer) {

          layer.on("click", function() {

              const youtubeId = feature.properties.youtube;
              const collectionDate = feature.properties.col_date;

              layer.bindPopup(
                  `
                  <div style="width:800px;">
                      <div style="margin-bottom:8px; font-size:14px;">
                          <b>Date Collected:</b> ${collectionDate}
                      </div>

                      <iframe
                          width="800"
                          height="450"
                          src="https://www.youtube.com/embed/${youtubeId}?playsinline=1&rel=0"
                          title="360° Video"
                          frameborder="0"
                          referrerpolicy="strict-origin-when-cross-origin"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowfullscreen>
                      </iframe>
                  </div>
                  `,
                  {
                      maxWidth: 1400
                  }
              ).openPopup();

          });

      }
    });

    lineLayer.addTo(map);
    layerControl.addOverlay(lineLayer, "360° Video Lines");
  });
