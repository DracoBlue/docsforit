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

DocsManager.prototype.logging_prefix = 'DocsManager';

DocsManager.prototype.getName = function() {
    return this.name;
};

DocsManager.prototype.getSectionContent = function(section_name) {
    var self = this;
    return function(cb) {
        self.trace("getSectionContent", section_name);
        fs.readFile(__dirname + '/../etc/sections/' + section_name + '.md', function(error, content) {
            if (error) {
                cb('');
            } else {
                cb(content.toString());
            }
        });
    };
};

DocsManager.prototype.storeSectionContent = function(section_name, content) {
    var self = this;
    return function(cb) {
        self.trace("storeSectionContent", section_name, content);
        fs.writeFile(__dirname + '/../etc/sections/' + section_name + '.md', content, 'utf8', function (error) {
            cb(error);
        });
    };
};

DocsManager.prototype.getSectionAsHtml = function(section_name) {
    var self = this;
    return function(cb) {
        self.trace("getSectionAsHtml", section_name);
        fs.readFile(__dirname + '/../etc/sections/' + section_name + '.md', function(error, content) {
            if (error) {
                cb('');
            } else {
                var attributes = {
                    "text-editor": "vim",
                    "base-url": "http://localhost:8000/"
                };
                
                var expanded_content = content.toString().replace(/{{{([\w\d\-]+)}}}/g, function(match, attribute_key) {
                    if (typeof attributes[attribute_key] === 'undefined') {
                        return '{{{' + attribute_key + '}}}';
                    } else {
                        return attributes[attribute_key];
                    }
                });
                
                cb(self.markdown_converter.makeHtml(expanded_content));
            }
        });
    };
};

DocsManager.prototype.getSections = function() {
    var self = this;
    return function(cb) {
        fs.readFile(__dirname + '/../etc/sections.json', function(error, content) {
            if (error) {
                cb([]);
            } else {
                var sections = [];
                
                var raw_section_files = JSON.parse(content.toString());
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
