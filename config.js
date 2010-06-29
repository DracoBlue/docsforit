config.setValues({
    "combine_css": {
        "base_url": "http://localhost:8000/"
    }
});

config.setValues({
    "logging": {
        "level": 7,
        "hide_classes": [
            "CombineCss"
        ]
    },
    "auth": {
        "user_manager_engine": "JsonFileUserManager",
        "user_manager_engine_options": {
            "file_name": __dirname + '/etc/users.json'
        }
    }
});

