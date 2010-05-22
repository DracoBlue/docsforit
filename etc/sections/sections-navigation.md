## Sections Navigation

We really need all possible sections now. Our docs start to get bigger and
bigger, so it's difficult to know all the urls.

### Getting all sections

To retrieve all possible .md files in the `etc/sections` folder we do the
following new thing in DocsManager.js

    $ {{{text-editor}}} lib/DocsManager.js
    
and prepend at top:

    var child_process = require('child_process');

and append at bottom:

    DocsManager.prototype.getSections = function() {
        var self = this;
        return function(cb) {
            child_process.exec('cd ' + __dirname + '/../etc/sections/ && ls *.md', function(error, content) {
                if (error) {
                    cb([]);
                } else {
                    var sections = [];
                    
                    var raw_section_files = content.split("\n");
                    var raw_section_files_length = raw_section_files.length;
                    for (var i=0; i<raw_section_files_length; i++) {
                        var section_key = raw_section_files[i];
                        if (section_key !== "") {
                            section_key = section_key.substr(0, section_key.length - 3);
                            
                            var section_caption = section_key.replace( /(^|[\s\-])([a-z])/g , function(m,p1,p2){
                                return p1+p2.toUpperCase();
                            });
                            
                            section_caption = section_caption.replace(/-/g, " ");
                            
                            sections.push([section_caption, section_key]);
                        }
                    }
                    cb(sections);
                }
            });
        };
    };

### Adding a internal controller for the sections

Append at the bottom of your `controllers/docs-controllers.js`

    $ {{{text-editor}}} controllers/docs-controllers.js

the following:

    new Controller("docs._sections/", {
        "execute": function(params, context) {
            var self = this;
            return function(cb) {
                docs_manager.getSections()(function(sections) {
                    var sections_length = sections.length;
                    
                    var html = [ ];
                    
                    html.push("<ul>");
                    
                    for (var i = 0; i < sections_length; i++) {
                        html.push("<li>");
                        html.push("<a href=\"");
                        html.push("docs/" + StringToolkit.encodeXml(sections[i][1]) + "/");
                        html.push("\">");
                        html.push(StringToolkit.encodeXml(sections[i][0]));
                        html.push("</a>");
                        html.push("</li>");
                    }
                    
                    html.push("</ul>");
                    
                    cb(html.join(""));
                });
            };
        }
    });

This creates a nice `<ul>` with all sections. Of course you could open just the
sections navigation now, by opening <{{{base-url}}}docs._sections/>
but we want to use it in the site.

### Using a slot

It's been a while since we last touched the `views/HtmlLayout.ejs` file. But
now we add right **after**:

    <div id="page_main">
        <%= inner %>
    </div> <!-- /#main -->
            
the following:

    <div id="page_navigation">
        <h2>Sections</h2>
        <% slot("docs._sections/") %>
    </div>
    
If you navigate back to <{{{base-url}}}docs/extending-the-docs-manager/>
again, you'll see the nice sections navigation right in our website!
