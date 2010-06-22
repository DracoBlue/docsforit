## DocsManager

### The (stub) DocsManager class

Now we'll create our very first client side javascript prototypical class.

It's called DocsManager and lives within the lib folder:

    $ {{{text-editor}}} lib/DocsManager.js

it has the following content for the start:

    /**
     * @extends Logging
     */
    DocsManager = function(name) {
        this.name = name;
    };
    
    extend(true, DocsManager.prototype, Logging.prototype);
    
    DocsManager.logging_prefix = 'DocsManager';
    
    DocsManager.prototype.getName = function() {
        return this.name;
    }

Now we'll register the DocsManager with a generally available global variable.
Of course there are cases when a global is a good choice and other cases, when
it's not. In this case it helps us to make this application easy, but you
should refrain from using globals like `a` and `b` or use a better named one
only at one point.

The global registration works as follows. Update the `lib/index.js`

    $ {{{text-editor}}} lib/index.js
    
and *append*:

    bootstrap_manager.whenReady(["plugin.markdown-views"], function() {
        require("./DocsManager");
        docs_manager = new DocsManager('DocsForIt!');
    });
 
### Adding the controller

Since we'll do lots of stuff with the docs manager now, we will create an own
`controllers/docs-controllers.js` to keep it.

Create the file:

    $ {{{text-editor}}} controllers/docs-controllers.js

And store it with this example content:

    new Controller("docs/", {
        "execute": function(params, context) {
            var self = this;
            return function(cb) {
                context.layout_name = 'HtmlLayout';
                cb('<h2>' + StringToolkit.encodeXml(docs_manager.getName()) + '</h2>');
            };
        }
    });

Now we may run the app again

    $ node run_server.js

and are able to see <{{{base-url}}}> and <{{{base-url}}}docs/>
which shows just a h2 with the contents `"DocsForIt"`. This is exactly this,
what we registered in the new docs-controllers file.