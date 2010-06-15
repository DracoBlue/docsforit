## New Project

### Creating the app directory

Create a new folder as spludo workspace. For instance:

    $ mkdir spludo-workspace
    $ cd spludo-workspace

Download spludo into that directory.

The folder should look like this now:

    spludo-workspace/
        spludo/
            core/ - core classes
            build/ - necessary for build
            spludotests/ - the test application for spludo
            splud-gen - the generator application

Execute:

    $ spludo/spludo-gen new-project

Response should be something like this:
  
     Spludo-Generator - http://spludo.com/
      
       Template: new-project
    
    Name of the Project (e.g. myapp): docsforit
    Spludo Directory [/home/spludo/spludo/spludo/]: 
      
       Working ... 
    
    Directory created: /home/jan/spludo-workspace/docsforit/
    Created file: /home/jan/spludo-workspace/docsforit/run_console.js
    Created file: /home/jan/spludo-workspace/docsforit/run_server.js
    Created folder: /home/jan/spludo-workspace/docsforit/controllers
    Created file: /home/jan/spludo-workspace/docsforit/config.js
    Created folder: /home/jan/spludo-workspace/docsforit/static
    Created folder: /home/jan/spludo-workspace/docsforit/lib
    Created file: /home/jan/spludo-workspace/docsforit/lib/index.js
    Created file: /home/jan/spludo-workspace/docsforit/build.xml
    Created folder: /home/jan/spludo-workspace/docsforit/views
      
       Finished!    
       
Enter the folder

    $ cd docsforit

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

and watch the app with your browser at <{{{base-url}}}>. You should see:

    Welcome to DocsForIt!

Awesome ;).

