function doGet(e) {
  if (!e.parameter.page) {
    return HtmlService.createTemplateFromFile('Index').evaluate();
  }else if (e.parameter['page'] == 'Login')
    Logger.log(JSON.stringify(e));
    return HtmlService.createTemplateFromFile('Login').evaluate();
}
/*function getScriptUrl() {
 var url = ScriptApp.getService().getUrl();
 return url;
}*/

function writeOneRecord(username, password, fname, age, gender) {
      try {
        var url = "jdbc:google:mysql://cs348-airline-tracker:us-central1:airline-tracker/airport";
        var user = "cs348flighttracker"
        var pass = "cs348"
        const conn = Jdbc.getCloudSqlConnection(url, user, pass);
        const stmt = conn.prepareStatement('INSERT INTO Passenger ' + '(passengerID, password, name, age, gender) values (?, ?, ?, ?, ?)');
        Logger.log(username)
        stmt.setString(1, username);
        stmt.setString(2, password);
        stmt.setString(3, fname);
        stmt.setString(4, age);
        stmt.setString(5, gender);
        
        stmt.execute();
      
      } catch (err) {
        // TODO(developer) - Handle exception from the API
        Logger.log('Failed with an error %s', err.message);
      }
        //alert('The output has been modified');
        return;
      }