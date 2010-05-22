## Extending the DocsManager

### The etc/sections folder

The idea is now, to create a folder with all sections of our documentation
and put it in an extra folder.

The folder is called `etc/sections` and created like this:

    $ mkdir etc/sections

### The first section

Additionally we add a small file called
`etc/sections/extending-the-docs-manager.md` into that folder

    $ {{{text-editor}}} etc/sections/extending-the-docs-manager.md

with the following content:

    ## The etc/sections folder
    
    The idea is now, to create a folder with all sections of our documentation
    and put it in an extra folder.
    
    The folder is called `etc/sections` and created like this:
    
        $ mkdir etc/sections
    
    ## The first section
    
    Additionally we add a small file called
    `etc/sections/extending-the-docs-manager.md` into that folder
    
        $ {{{text-editor}}} etc/sections/extending-the-docs-manager.md


### Implement the DocsManager#getSectionAsHtml method

Now we'll finally extend the small `DocsManager` with a new method called
`getSectionAsHtml`.

In the end the `lib/DocsManager.js` looks like this:

    require("Showdown");
    var fs = require("fs");
    
    /**
     * @extends Logging
     */
    DocsManager = function(name) {
        this.name = name;
        
        this.markdown_converter = new Showdown.converter();
    };
    
    extend(true, DocsManager.prototype, Logging.prototype);
    
    DocsManager.logging_prefix = 'DocsManager';
    
    DocsManager.prototype.getName = function() {
        return this.name;
    };
    
    DocsManager.prototype.getSectionAsHtml = function(section_name) {
        var self = this;
        return function(cb) {
            fs.readFile(__dirname + '/../etc/sections/' + section_name + '.md', function(error, content) {
                if (error) {
                    cb('');
                } else {
                    var raw_html_content = self.markdown_converter.makeHtml(content.toString());
                    
                    var attributes = {
                        "text-editor": "vim"
                    };
                    
                    html_content = raw_html_content.replace(/{{{([\w\d\-]+)}}}/g, function(match, attribute_key) {
                        if (typeof attributes[attribute_key] === 'undefined') {
                            return '{{{' + attribute_key + '}}}';
                        } else {
                            return attributes[attribute_key];
                        }
                    });
                    
                    cb(html_content);
                }
            });
        };
    };


### Register the /docs/\w+/ controller

We will now extend our docs-controllers.js to handle also requests like:

    docs/this-is-my-section/
    docs/ajsdhasjkdas/
    
and so on.

For this we tune the docs-controllers file a bit

    $ {{{text-editor}}} controllers/docs-controllers.js

and append this:

    new Controller(/^docs\/([\w\d\-\/]+)\/$/, {
        "execute": function(params, context) {
            var self = this;
            var section_name = params[1];
            return function(cb) {
                context.layout_name = 'HtmlLayout';
                docs_manager.getSectionAsHtml(section_name)(function(content) {
                    if (content === '') {
                        cb('Section not found!');
                    } else {
                        cb(content);
                    }
                });
            };
        }
    });

If we relaunch the application now and open
<http://localhost:8000/docs/extending-the-docs-manager/> in the browser we see
the documentation of the documentation of the documentation in the browser!
Recursion wins! ;)