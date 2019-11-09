import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import MonthCalender from './components/MonthCalendar'
import CaroselView from './components/CaroselView'
import DayCalendar from './components/DayCalendar'
import { LinearGradient } from 'expo-linear-gradient';
import MapView from 'react-native-maps';
import moment from "moment";

//Keep the data at the highest level and then 
//have it flow to lower sub components. 


//converted to functional component 
export default function App() {
  //Screen really only has two states
  //Month and events 
   const [month, setMonth] = useState(new Date().getMonth());  
   const [events, setEvents] = useState([]);  
   const [currentLatitude, setCurrentLatitude] = useState(0);
   const [currentLongitude, setCurrentLongitude] = useState(0);

  //Hook The fires on onmount and gets data 
  useEffect(() => {
      const fetchData = async () => {
        let response = await fetch(
          'https://www.cs.virginia.edu/~dgg6b/Mobile/ScrollLabJSON/cards.json'
        );
        let parseObject = await response.json();
        setEvents(assignIDs(parseObject));
      };
      fetchData();

      // fetching current location found here
      // https://medium.com/@princessjanf/react-native-maps-with-direction-from-current-location-ab1a371732c2
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          setCurrentLatitude(position.coords.latitude)
          setCurrentLongitude(position.coords.longitude)
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
      );

    },[]);
    

//AssignIDs  this function will be remove in the future as id will be added to the invitations

function assignIDs(events){
  return events.map((event, index)=>{
    event.id = index
    event.date = moment(event.date, "DD-MM-YYYY hh:mm:ss")

    return event
  })
}

  //Method That Filters Events
  //This methods returns the events for a specific month
  function eventsForMonth(events, month){
    return events.filter((event)=>{
      //Get Month check to see if matches
        return event.date.month() === month 
         & event.accepted === true ? true : false
    })
  }

  //Method For setting MonthState 
  function callBackForSettingMonth(monthID){
    //Remember these will get merged into a single object
    setMonth(monthID)
  }

  //Methods for accepting invitation
  function acceptInvitation(eventID){
    setEvents(
        events.map(event => {
            if (event.id === eventID) event.accepted = true
            return event
        })
    )
  }

  //Methods for declining invitation
  function declineInvitation(eventID){
    setEvents(
        events.filter(event => {
           return event.id === eventID ? false : true
        })
    )
  }

  //Method that filters Events Pending
  function eventsPending(events){
      return events.filter(event => {
           return event.accepted === undefined ? true : false
        })
  }


    return (
      <View style={styles.map}>
      <MapView 
          style={styles.mapStyle} 
          initialRegion={{
            latitude:38.03257352085919, 
            longitude:-78.49453241736464,
            latitudeDelta:1, 
            longitudeDelta:1,
          }}
      />

      <MapView.Marker
         coordinate={{"latitude":38.03257352085919,"longitude":-78.49453241736464}}
         title={"Your Location"}
       />
        

      {/* <View style={{height: 40, width: "100%"}}/>
      <LinearGradient
          colors={['#FFFFFF', '#D3DAEB', '#FFFFFF']}>
      <MonthCalender 
        selectedMonth = {month} 
        monthData ={monthData} 
        callBackOnPress = {callBackForSettingMonth}
      />
      <CaroselView 
          eventsData = {eventsPending(events)} 
          acceptInvitationCallBack = {acceptInvitation} 
          declineInvitationCallBack = {declineInvitation}/>
      <DayCalendar eventsForMonth = {eventsForMonth(events, month)} month= {month}/>
      </LinearGradient> */}
      
      </View>
    );
}


//Month Data Ideally we would fetch this to allow for internationization
const monthData = [
        {
          label: "January"
        }, 
        {
          label: "Feburary"
        }, 
        {
          label: "March"
        }, 
        {
          label: "April"
        }, 
        {
          label: "May"
        }, 
        {
          label: "June"
        }, 
        {
          label: "July"
        }, 
        {
          label: "August"
        }, 
        {
          label: "Setember"
        }, 
        {
          label: "October"
        }, 
        {
          label: "November"
        }, 
        {
          label: "December"
        } 
    ]


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: 'flex-start',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'white',
  }, 
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
