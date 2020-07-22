import React ,{useState,useEffect} from 'react';
import './App.css';
import { Card,CardContent} from '@material-ui/core';
import InfoBox from "./InfoBox";
import {  MenuItem,FormControl,Select} from '@material-ui/core';
import Map from "./Map";
import Table from "./Table"
import {sortData} from './util'
import LineGraph from './LineGraph'
import "leaflet/dist/leaflet.css";

function App() {
// state is used to write a variable in react
const [countries ,setCountries] = useState([]);
const [country,setCountry]=useState('worldwide');
const [ countryInfo,setCountryInfo]=useState({});
const [tableData,setTableData]=useState([])
const [mapCenter,setMapCenter]=useState({lat:34.80746,lng:-40.4796});
const [mapZoom,setMapZoom]=useState(3);
const [mapCountries,setMapCountries]=useState([]);
const [casesType,setCasesType]= useState('cases');

useEffect(() =>{
fetch('https://disease.sh/v3/covid-19/all')
.then(response=>response.json())
.then(data=>{
  setCountryInfo(data);
});
},[])


useEffect(() => {
  const  getcountriesData  =async()=>{
await fetch("https://disease.sh/v3/covid-19/countries")
.then((response)=>response.json())
.then((data)=>{
  const countries=data.map((country)=>(
    {
      name:country.country,
      value:country.countryInfo.iso2

  }
  ));
  const sortedData =sortData(data)
  setTableData(sortedData);
  setMapCountries(data);
  setCountries(countries);
});

  };
  getcountriesData();
}, []);

const onCountryChange= async(event)=>{
const  countryCode=event.target.value;
// console.log("ha::::",countryCode);
setCountry(countryCode);
const url= countryCode==="worldwide"
          ?"https://disease.sh/v3/covid-19/countries/all"
          :`https://disease.sh/v3/covid-19/countries/${countryCode}`
 await fetch(url)
 .then(response=>response.json())
.then(data=>{
  setCountry(countryCode);
 setCountryInfo(data);
 setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
 setMapZoom(4);
})

};
// console.log("info",countryInfo)
/* HEADER */
    // * INPUT +DROPDOWN MENU  */
  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">

     
      <h1>COVID19-TRACKER</h1> 
      <FormControl className="app__dropdown">

       <Select
           variant ="outlined"  onChange={onCountryChange}value={country}
           >
      <MenuItem value="worldwide">worldwide</MenuItem>       
{
countries.map((country)  =>(
  < MenuItem value={country.value} >{country.name}</MenuItem>
))



}
          
{/* <MenuItem   value="worldwide" >worldwide</MenuItem>
<MenuItem   value="worldwide" >worldwide</MenuItem>
<MenuItem   value="worldwide" >worldwide</MenuItem> */}

       </Select>
</FormControl>
      </div>
    <div className="app__stats">

<InfoBox

active={casesType==="cases"}
 onClick={e=>setCasesType("cases")}
 title="CORONA VIRUS CASES"
  cases ={countryInfo.todayCases} 
  total={countryInfo.cases}/>
<InfoBox 
active={casesType==="recovered"}
onClick={e=>setCasesType("recovered")}
title="RECOVERED" 
cases ={countryInfo.todayRecovered}
 total={countryInfo.recovered}/>
<InfoBox 
active={casesType==="deaths"}
onClick={e=>setCasesType("deaths")}
title="DEATHS"
 cases ={countryInfo.todayDeaths}
  total={countryInfo.deaths}/>

    {/* INBOXES  coron virus cases*/}
    {/* INBOXES coron arecovers */}
    {/* INBOXES */}
    </div>
    
    <Map 
    casesType={casesType}
    countries={mapCountries}
    center={mapCenter}
    zoom={mapZoom}
    />


    </div>
    {/* MAP  */}
        <Card className="app__right">
          <CardContent>
            <h3>live cases by country</h3>
            <Table countries = {tableData} />
<h3>worldwide new cases</h3>
            <LineGraph caseType={casesType} />
{/* TABLE  */}
    {/* GRAPH  */}
          </CardContent>
          
          </Card> 
    </div>
  );
}

export default App;
