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
    
    Name of the Project Folder (e.g. myapp): docsforit
    Title of the Project (e.g. My Super App): Docsforit
    Spludo Directory [/home/jan/spludo-workspace/spludo/]: 
      
       Working ... 

    Directory created: /home/jan/spludo-workspace/docsforit/
    Created file: /home/jan/spludo-workspace/docsforit/run_console.js
    Created file: /home/jan/spludo-workspace/docsforit/run_server.js
    Created folder: /home/jan/spludo-workspace/docsforit/controllers
    Created file: /home/jan/spludo-workspace/docsforit/controllers/main-controllers.js
    Created file: /home/jan/spludo-workspace/docsforit/config.js
    Created folder: /home/jan/spludo-workspace/docsforit/static
    Created folder: /home/jan/spludo-workspace/docsforit/static/images
    Created (binary) file: /home/jan/spludo-workspace/docsforit/static/images/spludo_template_bg.png
    Created folder: /home/jan/spludo-workspace/docsforit/static/css
    Created file: /home/jan/spludo-workspace/docsforit/static/css/screen.css
    Created folder: /home/jan/spludo-workspace/docsforit/lib
    Created file: /home/jan/spludo-workspace/docsforit/lib/index.js
    Created file: /home/jan/spludo-workspace/docsforit/build.xml
    Created folder: /home/jan/spludo-workspace/docsforit/views
    Created file: /home/jan/spludo-workspace/docsforit/views/HtmlLayout.ejs
    Created file: /home/jan/spludo-workspace/docsforit/views/Homepage.ejs

       Finished!    
       
Enter the folder

    $ cd docsforit

### Welcome to DocsForIt!

Now launch the application with:

    $ node run_server.js

and watch the app with your browser at <{{{base-url}}}>. You should see the project skeleton app.

Awesome ;).

