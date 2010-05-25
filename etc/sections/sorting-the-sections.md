## Sorting the sections

### Creating etc/sections.json

Even though we have all sections available in the sidebar now, the
sections are still in order by name. This does not help much, if you
want to step through all documentation parts step by step.

That's why we create a new file called `etc/sections.json`. It contains only
an array of all information we know about the sections. At this time this
is just the name of the section file, thus each entry is a string of the
sections slug.

Creating the `etc/sections.json`:

    $ {{{text-editor}}} etc/sections.json

with the content:

    [
        "new-project",
        "base-html-structure",
        "markdown-views",
        "docs-manager",
        "extending-the-docs-manager",
        "sections-navigation"
    ]

### Reimplement DocsManager#getSections with sorting

Since we now read the selected sections right from the sections.json, we do
not need to figure out the sections filename by listing them. That's why we
will load the sections.json now, convert the json code to an array and step
through it to figure out the name of the section.

The new DocsManager#getSections method will be appended to `lib/DocsManager.js`

    $ {{{text-editor}}} lib/DocsManager.js

and looks like this:

    DocsManager.prototype.getSections = function() {
        var self = this;
        return function(cb) {
            child_process.exec('cat ' + __dirname + '/../etc/sections.json', function(error, content) {
                if (error) {
                    cb([]);
                } else {
                    var sections = [];
                
                    var raw_section_files = JSON.parse(content);
                    var raw_section_files_length = raw_section_files.length;
                    for (var i = 0; i < raw_section_files_length; i++) {
                        var section_key = raw_section_files[i];
                        var section_caption = section_key.replace( /(^|[\s\-])([a-z])/g , function(m,p1,p2){
                            return p1+p2.toUpperCase();
                        });
                        
                        section_caption = section_caption.replace(/-/g, " ");
                        
                        sections.push([section_caption, section_key]);
                    }
                    cb(sections);
                }
            });
        };
    };

Since we do not need the child_process module anymore, we can remove the
`var child_process = require('child_process');` line form `lib/DocsManager.js`.
