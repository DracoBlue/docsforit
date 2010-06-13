## Authentication

### JsonFileUserManager - A UserManager

A `UserManager` is an interface, which provides authentication features. Most
user manager classes also provide a system to create new users or delete
existing ones.

We'll be using the `JsonFileUserManager`, which does all authentication based
on a small json file. Thus it's easy to create new accounts.

Download the [json-file-user-manager plugin][json-file-user-manager-plugin]

  [json-file-user-manager-plugin]: http://todo.tld

and install it as json-file-user-manager.

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

  [auth-plugin]: http://todo.tld

### Configuring the plugin mix

Now we finally need to configure the setup. Open the `config.js`

    $ {{{text-editor}}} config.js

and append:

    config.setValues({
        "auth": {
            "when_ready": ["json-file-user-manager"],
            "user_manager_engine": "JsonFileUserManager",
            "user_manager_options": {
                "file": __dirname + "/etc/users.json"
            }
        }
    })