## The HtmlLayout

The page we just created looks not that good. There is all the cool html stuff
missing. So we will create a basic HtmlLayout now, which will be used within 
the entire project.

Create the `views/HtmlLayout.ejs`

    $ {{{text-editor}}} views/HtmlLayout.ejs

with the following contents:

    <%
    
        context.headers = context.headers || {};
        context.headers["Content-Type"] = "text/html; charset=UTF-8";
        
        var base_url = "http://" + context.request_headers["host"] + "/";
    
        var application_title = "DocsForIt!";
        
    %><?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
    <html
        xmlns="http://www.w3.org/1999/xhtml"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xml:lang="en">
    <head>
        <title><%= StringToolkit.encodeXml(application_title) %></title>
    
        <base href="<%= base_url %>" />
    
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    
    <%  
        if (context.javascripts) {
            var javascripts = context.javascripts;
            var javascripts_length = javascripts.length;
            for (var i=0; i < javascripts_length; i++) {
     %>
            <script type="text/javascript" src="<%= javascripts[i] %>"> </script>
    <% 
     
            }
        }
    %>
        </head>
        <body id="body">
            <div id="page_margins">
                <div id="page_header">
                    <h1><a href="<%= base_url %>"><%= StringToolkit.encodeXml(application_title) %></a></h1>
                </div>
                <div id="page_main">
                    <%= inner %>
                </div> <!-- /#main -->
                
                <div id="page_footer">
                    © 2010 by You | Powered by <a href="http://spludo.com">Spludo</a>
                </div> <!-- /#page_footer -->
            </div> <!-- /#page_margins -->
        </body>
    </html>

## Using the HtmlLayout for the Frontpage

Update your main-controllers

    $ {{{text-editor}}} controllers/main-controllers.js

for something like this:

    new Controller("", {
        "execute": function(params, context) {
            var self = this;
            return function(cb) {
                context.layout_name = 'HtmlLayout';
                cb('Welcome to DocsForIt!');
            };
        }
    });
    
## Adding CSS

### Adding CombineCss
Download the [combine-css] plugin and unpack it to `docsforit/plugins`.

Your apps folder structure should look like this now:

    docsforit/
        run_server.js
        lib/
        controllers/
            main-controllers.js
        views/
            HtmlLayout.ejs
        plugins/
            combine-css/
                README.md
                lib/index.js
                lib/CombineCss.js
                tests/*

If you would run your app again:

    $ node run_server.js
    
it would fail like this:

    Error: Please configure combine_css.base_url in your (local.)config.js!

So we'll configure our application's base_url now. There for we create a
`docsforit/config.js`.

    $ {{{text-editor}}} config.js
    
with the following contents:

    config.setValues({
        "combine_css": {
            "base_url": "{{{base-url}}}" // mind the trailing slash!
        }
    });

Running the app again now, will work like a charm, but nothing changed, yet ;).

### The "Design"

All static files are only available from the static folder.

Since I am not that good at designing nor at creating a stunning design within
minutes, I created a small `.zip` file with everything needed.

Take all files in that .zip and extract them into your static folder.

It's a pitty, but since the tutorial is not yet finished, you may not find
a finished .zip somewhere. Please get the latest files by downloading all files
from the <http://github.com/DracoBlue/docsforit/tree/master/static/> folder
at github.

Your `docsforit/static` folder should look like this now:

    static/
        css/
            screen/
                reset.css
                base.css
        images/
            bg_page.png

### Creating the `screen.css`

To create the combined `screen.css` on the fly, we need to update our `lib/index.js`

    $ {{{text-editor}}} lib/index.js

with the contents:

    bootstrap_manager.whenReady(["plugin.combine-css"], function() {
        combine_css.addFile('static/css/screen/reset.css', 'screen.css', 'screen');
        combine_css.addFile('static/css/screen/base.css', 'screen.css', 'screen');
    });

Now we add this lines between `<head>` and `</head>` in our `views/HtmlLayout.ejs`:

    <%= combine_css.getHeader('screen.css') %>

Running the app again with:

    $ node run_server.js
        
Now we see the amazing blue background with white font and of course our
"Welcome to DocsForIt!" text.

## Adding Javascript

Since we want to use Mootools on the client side (every other javascript
client side framework would be fine, too!), we will add it now.

Head to http://mootools.net/download and download the uncompressed release.

Create a new folder `plugins/mootools` with the following structure:

    $ mkdir plugins/mootools
    $ mkdir plugins/mootools/static/
    $ mkdir plugins/mootools/static/js

And copy the downloaded `mootools-1.2.4-core-nc.js` into the folder

    $ cp mootools-1.2.4-core-nc.js mkdir plugins/mootools/static/js/mootools-1.2.4-core-nc.js

We just created our first *own* module, because it will be easier for us to
distinguish between third-party plugins and our own code.

Now we add this lines between `<head>` and `</head>` in our `views/HtmlLayout.ejs`:

    <script type="text/javascript" src="static/js/mootools-1.2.4-core-nc.js"> </script>

