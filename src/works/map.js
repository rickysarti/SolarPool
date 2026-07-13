import { LitElement, html, css } from 'lit';
import { Loader } from "@googlemaps/js-api-loader"
{
  let head = document.querySelector("head");
  let scriptElement = document.createElement("script");
  scriptElement.src="/js/markerclusterer.min.js";
  head.appendChild(scriptElement);
}
const loader = new Loader({
        apiKey: "AIzaSyCT7Uv6H4luf18FhuPFjfhQn_Oquiz4I5k",
        version: "weekly",
      });
      
//const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");


class CustomerMap extends LitElement {
  static properties = {
    userLocation: { type: Object },
    customers: { type: Array },
    //map: { type: Object },
    fetchedBounds: { type: Array },
  };

  constructor() {
    super();
    this.userLocation = { lat: -34.529, lng: -58.485 };
    this.customers = new Map();
    this.map = null;
    this.fetchedBounds = [];
    this.markers = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this._getUserLocation();
  }

  async _getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.map.setCenter(this.userLocation);
        },
        () => console.error('Error getting user location')
      );
    } else {
      console.error('Geolocation not supported');
    }
  }

  _loadMap(maps) {
    this.map = new maps.Map(this.shadowRoot.getElementById('map'), {
      center: this.userLocation,
      zoom: 14,
      mapId: "DEMO_MAP_ID"
    });

    this.map.addListener('bounds_changed', () => {
      const bounds = this.map.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      if (!this._isBoundsFetched(ne, sw)) {
        this._fetchCustomers(ne, sw);
      }
    });
  }

  _isBoundsFetched(ne, sw) {
    // Checks if the new bounds are within any of the previously fetched bounds
    return this.fetchedBounds.some(b => 
      b.ne.lat >= ne.lat() && b.ne.lng >= ne.lng() &&
      b.sw.lat <= sw.lat() && b.sw.lng <= sw.lng()
    );
  }

  async _fetchCustomers(ne, sw) {
    console.log(ne.lat(), ne.lng(), sw.lat(), sw.lng());
    try {
      const response= await fetch(`https://api.solarpool.com.ar/near/obras?minLat=${sw.lat()}&maxLat=${ne.lat()}&minLon=${sw.lng()}&maxLon=${ne.lng()}`);
      let customers = await response.json();
      //this.customers=[];
      this.fetchedBounds.push({ ne: { lat: ne.lat(), lng: ne.lng() }, sw: { lat: sw.lat(), lng: sw.lng() } });
      customers.forEach(customer => {
        if(!this.customers.get(customer.id)) {
          this.customers.set(customer.id, customer);
          this.addMarquer(customer);
        }
      });
      //this._updateMarkers();
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  }

  addMarquer(customer){
    if(!this.cluster){
      this.cluster=new MarkerClusterer(this.map, this.markers, {  });
    }
    const marker = new google.maps.Marker({
      position: { lat: customer.latitude +.003 , lng: customer.longitude -.002 },
      map: this.map,
      //title: customer.calle,
      icon:"/pin.svg"
    });
    const infoWindow = new google.maps.InfoWindow({
      content: `<div>
                  <h3>${customer.ciudad} ${customer.mes_cierre}</h3>
                  <img src="https://solarpool.com.ar/obras/${customer.id}/${customer.id}.jpg" alt="${customer.id}" style="width:300px;">
                </div>`,
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });
    this.markers.push(marker);
    this.cluster.addMarker(marker);
  }

  _updateMarkers() {
    if(this.cluster) {
      this.cluster.clearMarkers();
      this.cluster=null;
    }
    if(this.markers) {
      this.markers.forEach(marker => marker.setMap(null));
    }
    this.markers = [];
    this.customers.forEach(customer => {
      const marker = new google.maps.Marker({
        position: { lat: customer.latitude +.003 , lng: customer.longitude -.002 },
        map: this.map,
        //title: customer.calle,
        icon:"/pin.svg"
      });
      const infoWindow = new google.maps.InfoWindow({
        content: `<div>
                    <h3>${customer.ciudad} ${customer.mes_cierre}</h3>
                    <img src="https://solarpool.com.ar/obras/${customer.id}/${customer.id}.jpg" alt="${customer.id}" style="width:300px;">
                  </div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });
      this.markers.push(marker);
    });
    
    this.cluster=new MarkerClusterer(this.map, this.markers, {  });
  }

  render() {
    return html`
      <div id="map" ></div>
    `;
  }

  firstUpdated() {
    loader
        .importLibrary('maps')
        .then((maps) => {
                this._loadMap(maps);
                this.requestUpdate();
        })
        .catch((e) => {
          // do something
      });    

  }

  static styles = css`
    :host {
      display: block;
      height: 100vh;
      width: 100%;
    }
    #map { width: 100%; height: 100%; }  
  `;
}

customElements.define('customer-map', CustomerMap);
