import React, {Component} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Venue from './Venue';
import './App.css';

var clientId = 'OT5KXBDTYUP2H45X5PLCC0FSFFPG5A2ABOILIHR3UYZUG5J4';
var clientSecret = 'R3BAQ03WPPPRD5AOFXV1C5WJALW2MMHULEPGAROILQ12N2Q2';
var key = '?client_id='+clientId+'&client_secret='+clientSecret+'&v=20190801';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      venues: [
        // {
        //   id: "4b7a3d65f964a5203d272fe3",
        //   name: "Coco's Cantina",
        //   address: ["376 Karangahape Rd", "Newton", "New Zealand"],
        //   category: "Bistro",     
        // },
        // {
        //   id: "4b4d4133f964a52070cf26e3", 
        //   name: "Real Groovy", 
        //   address: ["369 Queen Street", "Auckland 1010", "New Zealand"],
        //   category: "Record Shop"
        // },
        // {
        //   id: "4b5a5f48f964a520ccc028e3", 
        //   name: "Verona Cafe", 
        //   address: ["169 Karangahape Rd", "Auckland 1010", "New Zealand"],
        //   category: "Coffee Shop"
        // }
      ],
      isModalOpen: false,
      watchedVenue: null,
    }
  }

  loadVenues = () => {
    var latlng = '-36.857018,174.764438';
    var venuesURL = 'https://api.foursquare.com/v2/venues/explore'+key+'&ll='+latlng; 
    fetch(venuesURL)
        .then(res => res.json())
        .then((data) => data.response.groups[0].items)
        .then((data) => {
            return data.map((item) => {
                
                var venue = {
                    id: item.venue.id,
                    name: item.venue.name,
                    address: item.venue.location.formattedAddress,
                    category: item.venue.categories[0].shortName
                };
                return venue;
            });
        })
        .then((data) => {
          this.setState({venues:data});
        })   
  }

  loadVenue = (venueId) => {
    this.setState({watchedVenue: null});

    var venueURL = 'https://api.foursquare.com/v2/venues/'+venueId+key;
    fetch(venueURL)
      .then(res => {res.json()})
      .then((data) => {
          var item = data.response.venue;

          var venue = {
              name: item.name,
              description: item.description,
              category: item.categories[0].shortName,
              address: item.location.formattedAddress,
              photo: item.bestPhoto.prefix + '300x300' + item.bestPhoto.suffix
          };

          this.setState({watchedVenue:venue});
      })    
  }

  componentDidMount(){
    this.loadVenues();
  }

  openModal = () => {
    this.setState({isModalOpen:true});
  }

  closeModal = () => {
    this.setState({isModalOpen:false});
  }

  render(){
    return (
      <div className="app">
      <div className="container">
        <div className="venues">

          {
            this.state.venues.map((venue) => {

              var venueProps={
                ...venue,
                key: venue.id,
                openModal: this.openModal,
                loadVenue: this.loadVenue
              };

              return(
                <Venue {...venueProps}/>
              );
            })
          }

        </div> 

        <div className="venue-filters">
          
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <div role="group" className="btn-group btn-group-toggle">
              <label className="venue-filter btn active btn-primary">
                <input name="venue-filter" type="radio" autoComplete="off" value="all"/>All
              </label>
              <label className="venue-filter btn btn-primary">
                <input name="venue-filter" type="radio" autoComplete="off" value="food"/>Food
              </label>
              <label className="venue-filter btn btn-primary">
                <input name="venue-filter" type="radio" autoComplete="off" value="drinks"/>Drinks
              </label>
              <label className="venue-filter btn btn-primary">
                <input name="venue-filter" type="radio" autoComplete="off" value="others"/>Others
              </label>
            </div>
          </div>
        </div>
      </div>

      <Modal show={this.state.isModalOpen} onHide={() => {this.closeModal()}}>
        <Modal.Body>

          { this.state.watchedVenue !== null ? (
            <div className="venue-popup-body row">
              <div className="col-6">
                <h1 className="venue-name">
                  {this.state.watchedVenue.name}
                </h1>
                <p>
                  {this.state.watchedVenue.description}
                </p>
                <p>
                  {this.state.watchedVenue.address[0]}
                </p>
                <p>
                  {this.state.watchedVenue.address[1]}
                </p>
                <p><span className="badge venue-type">
                  {this.state.watchedVenue.category}
                  </span></p>
              </div>
              <div className="col-6">
                <img src={this.state.watchedVenue.photo}/>
              </div>
            </div>
          ) : 'Loading...'}
   
        </Modal.Body>
      </Modal>

    </div>
    );  
  }
  
}

export default App;
