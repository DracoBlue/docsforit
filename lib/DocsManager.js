require("Showdown");
var fs = require("fs");
var child_process = require('child_process');

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
