  var curUser = '';
  function doGet(e) {
  Logger.log(JSON.stringify(e));
  if (!e.parameter.page) {
    return HtmlService.createTemplateFromFile('Index').evaluate();
  }else {
     return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate();
  }
}

function getScriptUrl() {
 var url = ScriptApp.getService().getUrl();
 return url;
}
function newPage(page) {
  return HtmlService.createHtmlOutputFromFile(page).getContent() 
}

function login(username, password) {
      try {
        var url = "jdbc:google:mysql://cs348-airline-tracker:us-central1:airline-tracker/airport";
        var user = "cs348flighttracker"
        var pass = "cs348"
        const conn = Jdbc.getCloudSqlConnection(url, user, pass);
        const stmt1 = conn.createStatement();
        const results1 = stmt1.executeQuery('SELECT passengerID FROM Passenger WHERE passengerID=\'' + username + '\' AND password =\'' + password + '\';');
        var count = 0;
        while(results1.next()) {
          count = count + 1;
        }
        results1.close();
        stmt1.close();
        if (count == 1) {
          return 1;
        }

      } catch (err) {
        // TODO(developer) - Handle exception from the API
        Logger.log('Failed with an error %s', err.message);
      }
        return 0;
}

function insertPassenger(username, password, fname, age, gender) {
      try {
        var url = "jdbc:google:mysql://cs348-airline-tracker:us-central1:airline-tracker/airport";
        var user = "cs348flighttracker"
        var pass = "cs348"
        const conn = Jdbc.getCloudSqlConnection(url, user, pass);
        const stmt1 = conn.createStatement();
        const results1 = stmt1.executeQuery('SELECT passengerID FROM Passenger WHERE passengerID=\'' + username + '\';');
        var count = 0;
        while(results1.next()) {
          count = count + 1;
        }
        results1.close();
        stmt1.close();
        if (count == 0) {
          const stmt = conn.prepareStatement('INSERT INTO Passenger ' + '(passengerID, password, name, age, gender) values (?, ?, ?, ?, ?)');
          Logger.log(username);
          stmt.setString(1, username);
          stmt.setString(2, password);
          stmt.setString(3, fname);
          stmt.setString(4, age);
          stmt.setString(5, gender);
          stmt.execute();
          return 1;
        } 
      } catch (err) {
        // TODO(developer) - Handle exception from the API
        Logger.log('Failed with an error %s', err.message);
      }
        return 0;
      }


function readDestinations() {
  try {
    var dbUrl = "jdbc:google:mysql://cs348-airline-tracker:us-central1:airline-tracker/airport";
    var user = "cs348flighttracker"
    var userPwd = "cs348"
    const conn = Jdbc.getCloudSqlConnection(dbUrl, user, userPwd);
    const start = new Date();
    const stmt = conn.createStatement();
    stmt.setMaxRows(1000);
    const results = stmt.executeQuery('SELECT distinct destination FROM Flight;');
    const numCols = results.getMetaData().getColumnCount();

    var destinations = ""
    while (results.next()) {
      let rowString = '';
      for (let col = 0; col < numCols; col++) {
        rowString += results.getString(col + 1) + '\t';
        destinations += '<option>' + rowString + '</option>';
      }
      
      Logger.log(rowString);
    }

    results.close();
    stmt.close();

    const end = new Date();
    Logger.log('Time elapsed: %sms', end - start);
  } catch (err) {
    // TODO(developer) - Handle exception from the API
    Logger.log('Failed with an error %s', err.message);
  }
  return destinations;
}


function readFlights(dest) {
  try {
    var dbUrl = "jdbc:google:mysql://cs348-airline-tracker:us-central1:airline-tracker/airport";
    var user = "cs348flighttracker"
    var userPwd = "cs348"
    const conn = Jdbc.getCloudSqlConnection(dbUrl, user, userPwd);
    const start = new Date();
    const stmt = conn.createStatement();
    stmt.setMaxRows(1000);
    const results = stmt.executeQuery('SELECT destination, date, flightID FROM Flight WHERE destination=\'' + dest + '\';');
    const numCols = results.getMetaData().getColumnCount();

    var flights = ""
    while (results.next()) {
      let rowString = '';
      for (let col = 0; col < numCols - 1; col++) {
        rowString += results.getString(col + 1) + '\t';
      }
      var flightID = results.getString(numCols);
      flights += '<input type="Radio" name="foo"' +' value=\'' + flightID + '\'>' + rowString + '<br><br>';
      Logger.log(rowString);
    }

    results.close();
    stmt.close();

    const end = new Date();
    Logger.log('Time elapsed: %sms', end - start);
  } catch (err) {
    // TODO(developer) - Handle exception from the API
    Logger.log('Failed with an error %s', err.message);
  }

  return flights;
}


function readTrips(username) {
  try {
    var dbUrl = "jdbc:google:mysql://cs348-airline-tracker:us-central1:airline-tracker/airport";
    var user = "cs348flighttracker"
    var userPwd = "cs348"
    const conn = Jdbc.getCloudSqlConnection(dbUrl, user, userPwd);
    const start = new Date();
    const stmt = conn.createStatement();
    stmt.setMaxRows(1000);
    const results = stmt.executeQuery('SELECT confirmationID, seatID, numberBags FROM Trip WHERE passengerID=\'' + username + '\';');
    const numCols = results.getMetaData().getColumnCount();

    var trips = ""
    while (results.next()) {
      var conf = "";
      var seat = 0;
      var bags = 0;
      conf = results.getString(1);
      seat = results.getString(2);
      bags = results.getString(3);
      trips += '<div><p>CONFIRMATION NUMBER:' + conf + '</p><br><p>SEAT NUMBER: '+ seat+'</p><br><p>NUMBER OF BAGS: ' + bags+'&emsp; &emsp; &emsp; <input type="number" name="bags" id="newbags" min="0" max="10"> <button id="change" onclick="updateTrip(' + conf + ')">Change Number of Bags</button></p><button id="delt" onclick= "deleteTrip('+ conf + ')">Cancel Trip</button></div>-----------------------------------------------------<br><br>';
      Logger.log(conf);
    }

    results.close();
    stmt.close();

    const end = new Date();
    Logger.log('Time elapsed: %sms', end - start);
  } catch (err) {
    // TODO(developer) - Handle exception from the API
    Logger.log('Failed with an error %s', err.message);
  }
  return trips;
}


function trip(passenger, flight, bags) {
  try {
    var dbUrl = "jdbc:google:mysql://cs348-airline-tracker:us-central1:airline-tracker/airport";
    var user = "cs348flighttracker"
    var userPwd = "cs348"
    var conn = Jdbc.getCloudSqlConnection(dbUrl, user, userPwd);
    const start = new Date();
    var stmt = conn.createStatement();
    callstoredprocedure = "{call CreateTrip(?, ?, ?)}";
    stmt = conn.prepareCall(callstoredprocedure);
    stmt.setString(1, passenger);
    stmt.setString(2, flight);
    stmt.setString(3, bags);
    stmt.executeUpdate();

    const end = new Date();
    Logger.log('Time elapsed: %sms', end - start);
    return 1;
  } catch (err) {
    // TODO(developer) - Handle exception from the API
    Logger.log('Failed with an error %s', err.message);
  }
  return 0;
}

function deletetrip(conf) {
  try {
    var dbUrl = "jdbc:google:mysql://cs348-airline-tracker:us-central1:airline-tracker/airport";
    var user = "cs348flighttracker"
    var userPwd = "cs348"
    var conn = Jdbc.getCloudSqlConnection(dbUrl, user, userPwd);
    const start = new Date();
    var stmt = conn.createStatement();
    callstoredprocedure = "{call DeleteTrip(?)}";
    stmt = conn.prepareCall(callstoredprocedure);
    stmt.setString(1, conf);
    stmt.executeUpdate();

    const end = new Date();
    Logger.log('Time elapsed: %sms', end - start);
    return 1;
  } catch (err) {
    // TODO(developer) - Handle exception from the API
    Logger.log('Failed with an error %s', err.message);
  }
  return 0;
}

function update(confID, numbags) {
  try {
    var dbUrl = "jdbc:google:mysql://cs348-airline-tracker:us-central1:airline-tracker/airport";
    var user = "cs348flighttracker"
    var userPwd = "cs348"
    var conn = Jdbc.getCloudSqlConnection(dbUrl, user, userPwd);
    const start = new Date();
    stmt = conn.createStatement();
    stmt.executeUpdate('UPDATE Trip SET numberBags=\'' + numbags + '\' WHERE confirmationID=\'' + confID + '\';');
    
    const end = new Date();
    Logger.log('Time elapsed: %sms', end - start);
    return 1;
  } catch (err) {
    // TODO(developer) - Handle exception from the API
    Logger.log('Failed with an error %s', err.message);
  }
  return 0;
}


