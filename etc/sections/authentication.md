## Authentication

### JsonFileUserManager - A UserManager

A `UserManager` is an interface, which provides authentication features. Most
user manager classes also provide a system to create new users or delete
existing ones.

We'll be using the `JsonFileUserManager`, which does all authentication based
on a small json file. Thus it's easy to create new accounts.

Download the [json-file-user-manager plugin][json-file-user-manager-plugin]
and install it as json-file-user-manager.

  [json-file-user-manager-plugin]: http://github.com/DracoBlue/spludo-plugins/tree/master/json-file-user-manager/

### The users file

We now need to setup a users file

    $ {{{text-editor}}} etc/users.json

with the contents:

    [
        {
            "id": 1,
            "login": "admin",
            "password": "1234",
            "properties": {
                "first_name": "Alice"
            }
        }
    ]

You should easily figure out, that our user can login with `admin`:`1234` and
has his first name set to `Alice`.

### auth plugin

Since authentication is a pretty common matter, there is already a plugin
called [auth][auth-plugin] which provides authentication against a user
manager implementation.

  [auth-plugin]: http://github.com/DracoBlue/spludo-plugins/tree/master/auth/

### Configuring the plugin mix

Now we finally need to configure the setup. Open the `config.js`

    $ {{{text-editor}}} config.js

and append:

    config.setValues({
        "auth": {
            "user_manager_engine": "JsonFileUserManager",
            "user_manager_options": {
                "file_name": __dirname + "/etc/users.json"
            }
        }
    })

### Adding a Login-Field to the HtmlLayout

Now we need to update the HtmlLayout

   $ {{{text-editor}}} views/HtmlLayout.ejs

and replace this:

                <div id="page_navigation">
                    <h2>Sections</h2>

with the following:

                <div id="page_navigation">
    <%
        if (context.session) {
    %>
                    <h2>Welcome</h2>
                    <p>Hello <%= context.session.user_name %>. <a href="/logout">Logout</a>?</p>
    <%        
        } else {
    %>
                    <h2>Welcome</h2>
                    <p>Please <a href="/login">login</a></p>
    <%
        }
    %>        
                    <h2>Sections</h2>

This will show us a nice info, that and if you are logged in at all.

Now go and test if you are able to login with login: `admin` and
password `1234`.

### Editing Sections only for authed people

Now we'll add a little addition to `docs-controllers.js`

Replace:

    new Controller("docs.api.storeSection", {
        "execute": function(params, context) {
            var self = this;
            return function(cb) {
                var section_name = context.params.section;
                var content = context.params.content;
                
                docs_manager.storeSectionContent(section_name, content)(function(error) {
                    cb(JSON.stringify(error ? false : true));
                });
            };
        }
    });

with:

    new Controller("docs.api.storeSection", {
        "execute": function(params, context) {
            var self = this;
            return function(cb) {
                var section_name = context.params.section;
                var content = context.params.content;

                if (!context.session) {
                    cb(JSON.stringify(false));
                    return ;
                }
                
                docs_manager.storeSectionContent(section_name, content)(function(error) {
                    cb(JSON.stringify(error ? false : true));
                });
            };
        }
    });

Now only authenticated users will capable to make changes to any sections.
