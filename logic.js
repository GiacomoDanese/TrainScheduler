$(document).ready(function() {

    var config = {
    apiKey: "AIzaSyCsj3Mt9Od2xQ4kDTucMeG-2IrOBP2k88o",
    authDomain: "trainscheduler-30e21.firebaseapp.com",
    databaseURL: "https://trainscheduler-30e21.firebaseio.com",
    projectId: "trainscheduler-30e21",
    storageBucket: "trainscheduler-30e21.appspot.com",
    messagingSenderId: "582213864555"
  };
  firebase.initializeApp(config);
    var trainData = firebase.database();
    // 2. Button for adding Trains
    $("#addTrainBtn").on("click", function(event) {
        event.preventDefault();

        // Grabs user input and assign to variables
        var trainName = $("#trainNameInput").val().trim();
        var destination = $("#destinationInput").val().trim();
        var trainTimeInput = moment($("#trainTimeInput").val().trim(), "HH:mm").subtract(10, "years").format("X");;
        var frequencyInput = $("#frequencyInput").val().trim();

        // Test for variables entered
        console.log(trainName);
        console.log(destination);
        console.log(trainTimeInput);
        console.log(frequencyInput);

        // Creates local "temporary" object for holding train data
        // Will push this to firebase
        var newTrain = {
            name: trainName,
            destination: destination,
            trainTime: trainTimeInput,
            frequency: frequencyInput,
        }

        // pushing trainInfo to Firebase
        trainData.ref().push(newTrain);

        // clear text-boxes
        $("#trainNameInput").val("");
        $("#destinationInput").val("");
        $("#trainInput").val("");
        $("#frequencyInput").val("");

        
        
    });

    trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());

        // assign firebase variables to snapshots.
        var firebaseName = childSnapshot.val().name;
        var firebaseDestination = childSnapshot.val().destination;
        var firebaseTrainTimeInput = childSnapshot.val().trainTime;
        var firebaseFrequency = childSnapshot.val().frequency;

        var diffTime = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes");
        var timeRemainder = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes") % firebaseFrequency;
        var minutes = firebaseFrequency - timeRemainder;

        var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A");

        // Test for correct times and info
        console.log(minutes);
        console.log(nextTrainArrival);
        console.log(moment().format("hh:mm A"));
        console.log(nextTrainArrival);
        console.log(moment().format("X"));

        // Append train info to table on page
        $("#trainTable > tbody").append("<tr><td>" + firebaseName + "</td><td>" + firebaseDestination + "</td><td>" + firebaseFrequency + " mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");

    });
});
