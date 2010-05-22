## New Project

### Creating the app directory

Head right into your spludo directory.

    $ cd spludo
    
Create a new folder called `docsforit`. This will be our application folder.

    $ mkdir docsforit
    
Let's create a basic folder structure:

    $ mkdir docsforit/lib
    $ mkdir docsforit/controllers
    $ mkdir docsforit/views
    $ mkdir docsforit/plugins
    $ mkdir docsforit/static
    
Enter the folder

    $ cd docsforit

### Create the dispatcher

We need a dispatcher for the webserver

    $ {{{text-editor}}} run_server.js

looking like that:

    require("./../core");
    
    new ServerApplication( {
        "port": 8000
    }).run();


### Welcome to DocsForIt!

We'll create now a happy welcome page for the users of our application.

Let's make some basic controllers for the main purposes of our application:

    $ {{{text-editor}}} controllers/main-controllers.js
    
and fill it with the contents:

    new Controller("", {
        "execute": function(params, context) {
            var self = this;
            return function(cb) {
                cb('Welcome to DocsForIt!');
            };
        }
    });
    
Now launch the application with:

    $ node run_server.js

and watch the app with your browser at <http://localhost:8000>. You should see:

    Welcome to DocsForIt!

Awesome ;).

