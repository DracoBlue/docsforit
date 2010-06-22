## Adding CSS

The example app we just created looks not that good. That's why we want to
create our own css-style and stuff now.

Remove `static/images/spludo_template.png` and `static/css/screen.css`. Also
remove from `views/HtmlLayout.ejs` the line:

    <link rel="stylesheet" type="text/css" href="static/css/screen.css" />

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

