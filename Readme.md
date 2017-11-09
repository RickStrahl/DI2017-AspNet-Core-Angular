# Angular Applications with ASP.NET Core
### Session Samples and Slides for ASP NET Intersection 2017

These materials cover both Part 1 and Part 2 of the sessions given at Dev Intersection 2017:

* **Angular Applications with ASP.NET Core: Part 1 - Getting Started**

* **Angular Applications with ASP.NET CORE: Part 2 - Putting it all together**

This repo contains the source code to the Todo sample application that we built in Part 1 as well as the combined slide deck for both sessions.


* [Updated Slides](https://github.com/RickStrahl/DI2017-AspNet-Core-Angular/blob/master/Documents/Strahl_Angular_AspNet.pptx?raw=true)
* [AlbumViewer Sample Application on GitHub](https://github.com/RickStrahl/AlbumViewerVNext)
* [AlbumViewer Online Sample](https://albumviewer.west-wind.com/albums)

Please note that the linked slide deck includes many more slides than were shown during the two sessions. The slides in the combined PPTX provide a more complete story that's meant to be free standing. The actual slides used in the sessions are also available in the `/Documents` folder.

### Setting up the Todo Application
In development the client side and server applications are run using separate Web Servers:

* WebPack Dev Server + Live Reload for Angular (port 4200)
* Kestrel Web Server for ASP.NET Core  (port 5000)

#### Client Side Application
To run the client side application:

* Install the latest version of the Angular CLI
* `npm install @angular/cli -g`

Next restore and start the Dev Server:

* cd into `TodoSample/src/todo`
* `npm install` to restore packages
* `ng serve` to start the dev server
* navigate to http://localhost:4200/

#### Server side Application
Make sure the .NET SDK installed:

* [.NET Core SDK Downloads ](https://www.microsoft.com/net/download/core)

Next restore the application and run it:

* cd into `TodoSample/TodoService`
* run `dotnet restore`
* run `dotnet run` or `dotnet watch run`
* navigate to http://localhost:5000/api/todos


Note the final .NET application has the client side application installed in the `wwwroot` folder so you should also be able to run the entire sample (without dev features) from http://localhost:5000/.
