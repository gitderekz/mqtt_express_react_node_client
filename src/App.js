// import logo from './logo.svg';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import axios from 'axios';
import React, {useEffect, useState} from 'react'
import Plotly from 'plotly.js-dist'
// Import MQTT service
import { MQTTService } from "./mqttService.js";
import { server } from "./utilities/utilities.js";

function App() {
  var weather = 0,temperature = 0,humidity = 0,rain = 0,soil_moisture = 0;
  const [backendData,setBakendData] = useState([{}])
  const [toggleMenuState,setToggleMenuState] = useState(false)
  const [initializeSensorState,setInitializeSensorState] = useState(false)
  const [initializeMqttState,setInitializeMqttState] = useState(false)

  useEffect(()=>{
    // fetch(`${server}/dashboard/pub_sub`).then(
    axios.get(`${server}/dashboard/pub_sub`).then(
      response => response.data
    ).then(
      data => {setBakendData(data)}
    )
  },[])
  // })

  // useEffect(()=>{
  //       fetchMQTTConnection(); 
  // },[])

  // Holds the background color of all chart
  var chartBGColor = getComputedStyle(document.body).getPropertyValue("--chart-background");
  var chartFontColor = getComputedStyle(document.body).getPropertyValue("--chart-font-color");
  var chartAxisColor = getComputedStyle(document.body).getPropertyValue("--chart-axis-color");


  function toggleOpenMenu() {
    setToggleMenuState(toggleMenuState => true)
  }
  function toggleCloseMenu() {
    setToggleMenuState(toggleMenuState => false)
  }
  let displaySideMenu = toggleMenuState?'display:block':'display:none';

  var theme=document.querySelector('.theme-toggler');
  function toggleChangeTheme() {
    console.log([chartBGColor,chartFontColor,chartAxisColor]);
    document.body.classList.toggle("dark-theme-variables");
    theme.querySelector("span:nth-child(1)").classList.toggle("active");
    theme.querySelector("span:nth-child(2)").classList.toggle("active");
    
    // Update Chart background
    chartBGColor = getComputedStyle(document.body).getPropertyValue("--chart-background");
    chartFontColor = getComputedStyle(document.body).getPropertyValue("--chart-font-color");
    chartAxisColor = getComputedStyle(document.body).getPropertyValue("--chart-axis-color");
    updateChartsBackground();
  }


// ******************************************************************************************************************
  /*
    Plotly.js graph and chart setup code
  */
  var temperatureHistoryDiv = document.getElementById("temperature-history");
  var humidityHistoryDiv = document.getElementById("humidity-history");
  var pressureHistoryDiv = document.getElementById("pressure-history");
  var altitudeHistoryDiv = document.getElementById("altitude-history");

  var temperatureGaugeDiv = document.getElementById("temperature-gauge");
  var humidityGaugeDiv = document.getElementById("humidity-gauge");
  var pressureGaugeDiv = document.getElementById("pressure-gauge");
  var altitudeGaugeDiv = document.getElementById("altitude-gauge");

  const historyCharts = [
    temperatureHistoryDiv,
    humidityHistoryDiv,
    pressureHistoryDiv,
    altitudeHistoryDiv,
  ];

  const gaugeCharts = [
    temperatureGaugeDiv,
    humidityGaugeDiv,
    pressureGaugeDiv,
    altitudeGaugeDiv,
  ];

  // History Data
  var temperatureTrace = {
    x: [],
    y: [],
    name: "Temperature",
    mode: "lines+markers",
    type: "line",
  };
  var humidityTrace = {
    x: [],
    y: [],
    name: "Humidity",
    mode: "lines+markers",
    type: "line",
  };
  var pressureTrace = {
    x: [],
    y: [],
    name: "Pressure",
    mode: "lines+markers",
    type: "line",
  };
  var altitudeTrace = {
    x: [],
    y: [],
    name: "Altitude",
    mode: "lines+markers",
    type: "line",
  };

  var temperatureLayout = {
    autosize: true,
    title: {
      text: "Temperature",
    },
    font: {
      size: 12,
      color: chartFontColor,
      family: "poppins, san-serif",
    },
    colorway: ["#05AD86"],
    margin: { t: 40, b: 40, l: 30, r: 30, pad: 10 },
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
      gridwidth: "2",
      autorange: true,
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
      gridwidth: "2",
      autorange: true,
    },
  };
  var humidityLayout = {
    autosize: true,
    title: {
      text: "Humidity",
    },
    font: {
      size: 12,
      color: chartFontColor,
      family: "poppins, san-serif",
    },
    colorway: ["#05AD86"],
    margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
      gridwidth: "2",
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };
  var pressureLayout = {
    autosize: true,
    title: {
      text: "Pressure",
    },
    font: {
      size: 12,
      color: chartFontColor,
      family: "poppins, san-serif",
    },
    colorway: ["#05AD86"],
    margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
      gridwidth: "2",
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };
  var altitudeLayout = {
    autosize: true,
    title: {
      text: "Altitude",
    },
    font: {
      size: 12,
      color: chartFontColor,
      family: "poppins, san-serif",
    },
    colorway: ["#05AD86"],
    margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
      gridwidth: "2",
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };

  var config = { responsive: true, displayModeBar: false };
  const mediaQuery = window.matchMedia("(max-width: 600px)");

  mediaQuery.addEventListener("change", function (e) {
    handleDeviceChange(e);
  });

  function handleDeviceChange(e) {
    // fetchMQTTConnection(); 
    if (e.matches) {
      console.log("Inside Mobile");
      var updateHistory = {
        width: 323,
        height: 250,
        "xaxis.autorange": true,
        "yaxis.autorange": true,
      };
      // historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
    } else {
      var updateHistory = {
        width: 550,
        height: 260,
        "xaxis.autorange": true,
        "yaxis.autorange": true,
      };
      // historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
    }

  }

  // Gauge Data
  var temperatureData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: 0,
      title: { text: "Temperature" },
      type: "indicator",
      mode: "gauge+number+delta",
      delta: { reference: 30 },
      gauge: {
        axis: { range: [null, 50] },
        steps: [
          { range: [0, 20], color: "lightgray" },
          { range: [20, 30], color: "gray" },
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 30,
        },
      },
    },
  ];

  var humidityData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: 0,
      title: { text: "Humidity" },
      type: "indicator",
      mode: "gauge+number+delta",
      delta: { reference: 50 },
      gauge: {
        axis: { range: [null, 100] },
        steps: [
          { range: [0, 20], color: "lightgray" },
          { range: [20, 30], color: "gray" },
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 30,
        },
      },
    },
  ];

  var pressureData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: 0,
      title: { text: "Pressure" },
      type: "indicator",
      mode: "gauge+number+delta",
      delta: { reference: 750 },
      gauge: {
        axis: { range: [null, 1100] },
        steps: [
          { range: [0, 300], color: "lightgray" },
          { range: [300, 700], color: "gray" },
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 30,
        },
      },
    },
  ];

  var altitudeData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: 0,
      title: { text: "Altitude" },
      type: "indicator",
      mode: "gauge+number+delta",
      delta: { reference: 60 },
      gauge: {
        axis: { range: [null, 150] },
        steps: [
          { range: [0, 50], color: "lightgray" },
          { range: [50, 100], color: "gray" },
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 30,
        },
      },
    },
  ];

  var layout = { width: 300, height: 250, margin: { t: 0, b: 0, l: 0, r: 0 } };

  // Will hold the arrays we receive from our BME280 sensor
  // Temperature
  let newTempXArray = [];
  let newTempYArray = [];
  // Humidity
  let newHumidityXArray = [];
  let newHumidityYArray = [];
  // Pressure
  let newPressureXArray = [];
  let newPressureYArray = [];
  // Altitude
  let newAltitudeXArray = [];
  let newAltitudeYArray = [];

  // The maximum number of data points displayed on our scatter/line graph
  let MAX_GRAPH_POINTS = 12;
  let ctr = 0;
  
   
  function initial_gauge_chart(){
    try {
      Plotly.newPlot(temperatureGaugeDiv, temperatureData, layout);
      Plotly.newPlot(humidityGaugeDiv, humidityData, layout);
      Plotly.newPlot(pressureGaugeDiv, pressureData, layout);
      Plotly.newPlot(altitudeGaugeDiv, altitudeData, layout);  
      console.log("HAKUNA SHIDA: "+ temperatureGaugeDiv+ ','+temperatureData+', '+layout);
    } catch (error) {
      console.log("TATIZO: "+error);
    }      
  }

  // Event listener when page is loaded
  function initial_loading() {
    // window.addEventListener("load", (event) => {
      Plotly.newPlot(temperatureHistoryDiv,[temperatureTrace],temperatureLayout,config);
      Plotly.newPlot(humidityHistoryDiv, [humidityTrace], humidityLayout, config);
      Plotly.newPlot(pressureHistoryDiv, [pressureTrace], pressureLayout, config);
      Plotly.newPlot(altitudeHistoryDiv, [altitudeTrace], altitudeLayout, config);
     
      Plotly.newPlot(temperatureGaugeDiv, temperatureData, layout);
      Plotly.newPlot(humidityGaugeDiv, humidityData, layout);
      Plotly.newPlot(pressureGaugeDiv, pressureData, layout);
      Plotly.newPlot(altitudeGaugeDiv, altitudeData, layout); 
      console.log("HAKUNA SHIDA: "+ temperatureGaugeDiv+ ','+temperatureData+', '+layout);

      // // Run it initially
      handleDeviceChange(mediaQuery);
    // });
    
    
    // Get MQTT Connection
      fetchMQTTConnection();

      //initialize gauge charts
      initial_gauge_chart();
  }

  function updateSensorReadings(jsonResponse) {
    // console.log(typeof jsonResponse);

    let temperature = Number(jsonResponse.temperature).toFixed(2);
    let humidity = Number(jsonResponse.humidity).toFixed(2);
    let pressure = Number(jsonResponse.rain).toFixed(2);
    let altitude = Number(jsonResponse.soil_moisture).toFixed(2);

    updateBoxes(temperature, humidity, pressure, altitude);

    updateGauge(temperature, humidity, pressure, altitude);

    // Update Temperature Line Chart
    updateCharts(
      temperatureHistoryDiv,
      newTempXArray,
      newTempYArray,
      temperature,'temp'
    );
    // Update Humidity Line Chart
    updateCharts(
      humidityHistoryDiv,
      newHumidityXArray,
      newHumidityYArray,
      humidity,'humi'
    );
    // Update Pressure Line Chart
    updateCharts(
      pressureHistoryDiv,
      newPressureXArray,
      newPressureYArray,
      pressure,'pres'
    );

    // Update Altitude Line Chart
    updateCharts(
      altitudeHistoryDiv,
      newAltitudeXArray,
      newAltitudeYArray,
      altitude,'alt'
    );
    initial_gauge_chart();
  }

  function updateBoxes(temperature, humidity, pressure, altitude) {
    let temperatureDiv = document.getElementById("temperature");
    let humidityDiv = document.getElementById("humidity");
    let pressureDiv = document.getElementById("pressure");
    let altitudeDiv = document.getElementById("altitude");

    temperatureDiv.innerHTML = temperature + " C";
    humidityDiv.innerHTML = humidity + " %";
    pressureDiv.innerHTML = pressure + " hPa";
    altitudeDiv.innerHTML = altitude + " m";
  }

  function updateGauge(temperature, humidity, pressure, altitude) {
    var temperature_update = {
      value: temperature,
    };
    var humidity_update = {
      value: humidity,
    };
    var pressure_update = {
      value: pressure,
    };
    var altitude_update = {
      value: altitude,
    };
    Plotly.update(temperatureGaugeDiv, temperature_update);
    Plotly.update(humidityGaugeDiv, humidity_update);
    Plotly.update(pressureGaugeDiv, pressure_update);
    Plotly.update(altitudeGaugeDiv, altitude_update);
  }

  function updateCharts(lineChartDiv, xArray, yArray, sensorRead,from) {
    if (xArray.length >= MAX_GRAPH_POINTS) {
      xArray.shift();
    }
    if (yArray.length >= MAX_GRAPH_POINTS) {
      yArray.shift();
    }
    xArray.push(ctr++);
    yArray.push(sensorRead);
    // console.log("CTR:  "+from+" => "+ctr); // 1216,40x4
    var data_update = {
      x: [xArray],
      y: [yArray],
    };

    Plotly.update(lineChartDiv, data_update);
  }
  
  function updateChartsBackground() {
    // updates the background color of historical charts
    var updateHistory = {
      plot_bgcolor: chartBGColor,
      paper_bgcolor: chartBGColor,
      font: {
        color: chartFontColor,
      },
      xaxis: {
        color: chartAxisColor,
        linecolor: chartAxisColor,
      },
      yaxis: {
        color: chartAxisColor,
        linecolor: chartAxisColor,
      },
    };
    try {
      historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));      
    } catch (error) {
      
    }

    // updates the background color of gauge charts
    var gaugeHistory = {
      plot_bgcolor: chartBGColor,
      paper_bgcolor: chartBGColor,
      font: {
        color: chartFontColor,
      },
      xaxis: {
        color: chartAxisColor,
        linecolor: chartAxisColor,
      },
      yaxis: {
        color: chartAxisColor,
        linecolor: chartAxisColor,
      },
    };
    gaugeCharts.forEach((chart) => Plotly.relayout(chart, gaugeHistory));
  }

  // Callback function that will retrieve our latest sensor readings and redraw our Gauge with the latest readings
  try {
    initial_loading()
    backendData.message.map((message,i)=> {
      // ["id", "temperature", "humidity", "rain", "soil_moisture", "created_at"].map(property => message[property])[0]
      weather = ["id", "temperature", "humidity", "rain", "soil_moisture", "created_at"].map(property => message[property]);
      // console.log(weather);
      updateSensorReadings(message)
    });    
  } catch (error) {
    
  }

  
  /*
    MQTT Message Handling Code
  */
  var mqttStatus = document.querySelector(".status");

  function onConnect(message) {
    try {
      mqttStatus.textContent = "Connected";
    } catch (error) {
      console.log("STATUS: "+error);
      mqttStatus = document.querySelector(".status");
    }    
  }
  function onMessage(topic, message) {
    message = JSON.parse(message)

    // var stringResponse = message.toString();
    // var messageResponse = JSON.parse(stringResponse);
    
    console.log(['MES1: ',message]);
    message.map((message,i)=> {
      // weather = ["id", "temperature", "humidity", "rain", "soil_moisture", "created_at"].map(property => message[property]);
      // updateSensorReadings(message)
      console.log(['MES2: ',message]);
    });  
    // updateSensorReadings(messageResponse);
  }

  function onError(error) {
    console.log(`Error encountered :: ${error}`);
    try {
      mqttStatus.textContent = "Error";
    } catch (error) {
      console.log("STATUS: "+error);
      mqttStatus = document.querySelector(".status");
    }
  }

  var previous_data;
  function onClose() {
    console.log(`MQTT connection closed!`);
    try {
      // mqttStatus.textContent = "Closed";
      mqttStatus.textContent = "Connected";
    } catch (error) {
      console.log("STATUS: "+error);
      mqttStatus = document.querySelector(".status");
    }
    // ***********
    // fetch(`${server}/dashboard/fetch_current_weather`)
    axios.get(`${server}/dashboard/fetch_current_weather`)
    .then(
      // response => response.json(),
      response => response.data
    // console.log(response)
    ).then(
      response => {  
      // function(message) {
    // console.log('JEHOVA !')
    // console.log(response)
        response.message.map((message,i)=> {
          console.log(`C U R R E N T !`+response.name+', '+response.dashboardTitle);
          // ["id", "temperature", "humidity", "rain", "soil_moisture", "created_at"].map(property => message[property])[0]
          weather = ["id", "temperature", "humidity", "rain", "soil_moisture", "created_at"].map(property => message[property]);
          // console.log(weather);
          if (previous_data == null || (previous_data != null && weather[0] != previous_data[0])) {
            console.log('DATA CHANGED!',message);
            updateSensorReadings(message)
          }          
          previous_data = weather;
        });         
      }
    )
      .catch((error) => console.error("Error getting MQTT Connection :", error));
    // *******************
  }

  function fetchMQTTConnection() {
    // fetch(`${server}/mqttConnDetails`, {
    axios.get(`${server}/mqttConnDetails`, {
      // method: "GET",
      // headers: {
      //   "Content-type": "application/json; charset=UTF-8",
      // },
    })
      .then(function (response) {
        // return response.json();
        return response => response.data;
      })
      .then(function (data) {
        console.log(`F E T C H !`+data.mqttServer+', '+data.mqttTopic);
        initializeMQTTConnection(data.mqttServer, data.mqttTopic);
      })
      .catch((error) => console.error("Error getting MQTT Connection :", error));
  }
  function initializeMQTTConnection(mqttServer, mqttTopic) {
    console.log(
      `Initializing connection to :: ${mqttServer}, topic :: ${mqttTopic}`
    );
    var fnCallbacks = { onConnect, onMessage, onError, onClose };

    var mqttService = new MQTTService(mqttServer, fnCallbacks);
    mqttService.connect();

    mqttService.subscribe(mqttTopic);
  }

// ******************************************************************************************************************

  return [
    <div>
    
    <link href="https://fonts.googleapis.com/icon?family=Material+Symbols+Sharp" rel="stylesheet"/>
    {/* <script src="https://cdn.plot.ly/plotly-2.16.1.min.js"></script> */}
    {/* <script src="https://github.com/gitderekz/saidizi/blob/main/mqtt.min.js"></script> */}

      {
        ( typeof backendData.message === 'undefined')?(<p>Loading..</p>)
        :(backendData.message.map((message,i)=> {
            // 
            <p key={["id", "temperature", "humidity", "rain", "soil_moisture", "created_at"].map(property => message[property])[0]}>
              {["id", "temperature", "humidity", "rain", "soil_moisture", "created_at"].map(property => message[property])[0]},
              {' => '+["id", "temperature", "humidity", "rain", "soil_moisture", "created_at"].map(property => message[property])[1]},
              {' => '+["id", "temperature", "humidity", "rain", "soil_moisture", "created_at"].map(property => message[property])[2]},
              {' => '+["id", "temperature", "humidity", "rain", "soil_moisture", "created_at"].map(property => message[property])[3]},
              {' => '+["id", "temperature", "humidity", "rain", "soil_moisture", "created_at"].map(property => message[property])[4]},
              {' => '+["id", "temperature", "humidity", "rain", "soil_moisture", "created_at"].map(property => message[property])[5]}
            </p>

            weather = ["id", "temperature", "humidity", "rain", "soil_moisture", "created_at"].map(property => message[property]);

          }
        ))
      }

    <div className="container">
      <aside style={{displaySideMenu}}>
        <div className="top">
          <div className="logo">
            <img src="./images/logo.png" alt="" />
            {/* <h2><%=name%></h2> */}
          </div>
          <div className="close" id="close-btn" onClick={toggleCloseMenu}>
            <span className="material-symbols-sharp"> close </span>
          </div>
        </div>
        <div className="sidebar">
          <a href="#" className="active">
            <span className="material-symbols-sharp"> dashboard </span>
            <h3>Dashboard</h3>
          </a>
        </div>
      </aside>
      <main>
        {/* <h1><%=dashboardTitle%></h1> */}
        {/* <h6><%=data%></h6> */}
        <div className="connection-status">
          <h3>Connection Status: <span className="status">Disconnected</span></h3>
        </div>
        <div className="insights">
          <div className="temperature">
            <div className="middle">
              <div className="left">
                <h3>Temperature</h3>
                <h1 id="temperature">{weather[1]}</h1>
              </div>
              <div className="icon">
                <span className="material-symbols-sharp"> device_thermostat </span>
              </div>
            </div>
          </div>
          {/* <!-- End of temperature --> */}
          <div className="humidity">
            <div className="middle">
              <div className="left">
                <h3>Humidity</h3>
                <h1 id="humidity">{weather[2]}</h1>
              </div>
              <div className="icon">
                <span className="material-symbols-sharp">
                  humidity_percentage
                </span>
              </div>
            </div>
          </div>
          {/* <!-- End of humidity --> */}
          <div className="pressure">
            <div className="middle">
              <div className="left">
                <h3>Pressure</h3>
                <h1 id="pressure">{weather[3]}</h1>{/* rain */}
              </div>
              <div className="icon">
                <span className="material-symbols-sharp"> speed </span>
              </div>
            </div>
          </div>
          {/* <!-- End of pressure --> */}
          <div className="altitude">
            <div className="middle">
              <div className="left">
                <h3>Approx Altitude</h3>
                <h1 id="altitude">{weather[4]}</h1>
              </div>
              <div className="icon">
                <span className="material-symbols-sharp"> altitude </span>
              </div>
            </div>
          </div>
          {/* <!-- End of altitude --> */}
        </div>
        {/* <!-- End of Insights --> */}
        <div className="histories">
          <h2>Historical Charts</h2>
          <div className="history-charts">
            <div id="temperature-history" className="history-divs"></div>
            <div id="humidity-history" className="history-divs"></div>
            <div id="pressure-history" className="history-divs"></div>
            <div id="altitude-history" className="history-divs"></div>
          </div>
        </div>
      </main>
      <div className="right">
        <div className="top">
          <button id="menu-btn" onClick={toggleOpenMenu}>
            <span className="material-symbols-sharp"> menu </span>
          </button>
          <div className="theme-toggler" onClick={toggleChangeTheme}>
            <span className="material-symbols-sharp active"> light_mode </span>
            <span className="material-symbols-sharp"> dark_mode </span>
          </div>
        </div>
        {/* <!-- End of top --> */}
        <div className="gauge-charts">
          <h2>Gauge Charts</h2>
          <div className="item">
            <div id="temperature-gauge">{weather[1]}</div>
          </div>
          <div className="item">
            <div id="humidity-gauge">{weather[2]}</div>
          </div>
          <div className="item">
            <div id="pressure-gauge">{weather[3]}</div>
          </div>
          <div className="item">
            <div id="altitude-gauge">{weather[4]}</div>
          </div>
        </div>
      </div>
    </div>

    {/* <script type="module" src="./index.js"></script> */}
    {/* <script type="module" src="./mqttService.js"></script> */}
    </div>
  ]
}
export default App

