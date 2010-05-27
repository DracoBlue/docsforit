exports.createElementXml = function(options) {
    if (typeof options.tag === 'undefined') {
        throw new Error('The option .tag is not set!');
    }
    if (typeof options.key === 'undefined') {
        throw new Error('The option .key is not set!');
    }

    var key = options.key;
    var tag = options.tag;
    var content = options.content || '';

    var js_behaviour_config = config.get('js-behaviour', {});
    var prefix = js_behaviour_config.prefix || 'jsb_';
    
    var xml = ['<'];
    
    xml.push(tag);
    xml.push(' class="');
    
    if (options['class']) {
        xml.push(options['class'] + ' ');
    }
    
    xml.push(prefix);
    xml.push(' ');
    
    xml.push(prefix);
    xml.push(key);
    xml.push('">');
    
    if (typeof options.value !== 'undefined') {
        xml.push('<input type="hidden" value="' + StringToolkit.encodeXml(JSON.stringify(options.value)) + '" />');
    }

    if (options['inner']) {
        xml.push(options['inner']);
    }
    
    xml.push('</');
    xml.push(tag);
    xml.push('>');

    return xml.join('');
};
