# django-react-graphql-starter

A starter kit for Django and React, connected by GraphQL

## Why it matters

Django is a great tool for rapid backend development.  

React is a great tool for rapid frontend development.

This starter brings these two great tools together!

Django has excellent GraphQL support via the Graphene library.   
With a great deal of ease and very little code you can create your database 
models and expose them via a GraphQL interface, and then use them in your React app 
via the wonderful Apollo Client.

This starter kit also helps you get authentication working via JSON Web Tokens.

## Requirements

* Python
* Node.js
* Yarn (optional)

## Install / Run

### Backend

Edit myapp/settings.py if you want to setup a database connection other than the default sqlite.

```bash
cd be
pip install -r requirements.txt
./manage.py migrate
./manage.py createsuperuser
./manage.py runserver 9090

```

### Frontend

```bash
cd ui
yarn install
yarn start
```

After install, go to http://localhost:3000 and try logging in with the user you created.


Have fun!
