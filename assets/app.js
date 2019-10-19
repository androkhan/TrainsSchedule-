

  var config = {
    apiKey: "AIzaSyBW4lREFLy0N_-4EdAlojiBVMZ4drv0se8",
    authDomain: "trains-193b9.firebaseapp.com",
    databaseURL: "https://trains-193b9.firebaseio.com",
    projectId: "trains-193b9",
    storageBucket: "trains-193b9.appspot.com",
    messagingSenderId: "442611315404",
    // appId: "1:442611315404:web:c93e3587babd02e7b94869",
    // measurementId: "G-W6KXT6C0WB"
  }
    ;

    firebase.initializeApp(config);
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var database = firebase.database();
// var connections = database.ref('connections');

var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

$("#add-train-button").on("click",function(event){

    event.preventDefault();
    
    let trainName = $("#train-name-input").val().trim();
    let destination = $("#destination-input").val().trim();
    let startTime = $("#first-time-input").val().trim();
    let frequency = $("#frequency-input").val().trim();
    
    
    let data = {
        trainName:trainName,
        destination:destination,
        startTime:startTime,
        frequency:frequency
    }

    // Push the data into the firebase.
    database.ref().push(data);

    // update the display
    updateDisplay();

    // clear the input fields.
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-time-input").val("");
    $("#frequency-input").val("");
});

// Function to retrieve, calculate and display the data.
function updateDisplay(){

    $("#display-table-body").empty();

    // Get the data from the firebase and display on the table.
    database.ref().on("child_added",function(snaphotChild){

        // Get the datas from firebase to variables.
        let trainName = snaphotChild.val().trainName;
        let destination = snaphotChild.val().destination;
        let startTime = snaphotChild.val().startTime;
        let frequency = snaphotChild.val().frequency;

        let pastTime = moment(startTime,"HH:mm").subtract(1,"year");
        let diffTime = moment().diff(pastTime,"minutes");
        let modulusTime = diffTime%frequency;
        let remainTime = frequency - modulusTime;
        let trainTime = moment().add(remainTime,"minutes").format("hh:mm a");

        // Display the datas on to the table.
        let newRow = $("<tr>").append(
            $("<td>").text(trainName.toUpperCase()),
            $("<td>").text(destination.toUpperCase()),
            $("<td>").text(frequency),
            $("<td>").text(trainTime),
            $("<td>").text(remainTime)
        )
        $("#display-table-body").append(newRow);
    });

}

// Call funtion to display the data.
updateDisplay();

// Update the data in every 60 seconds.
setInterval(updateDisplay,60*1000);