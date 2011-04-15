var http = new ActiveXObject("HTTPWatch.Controller"), // Creating the http ActiveX Object
    ie = http.IE.New(); // Getting a new IE instance

// Clear browser cache
ie.clearCache();
// Show HTTPWatch window
ie.OpenWindow(false);
// Start recording
ie.Record();
// Open the demo page
ie.GotoUrl("scriptloader_demo.html");