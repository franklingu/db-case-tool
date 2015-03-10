db-case-tool
=================================

### Setup
1. Make sure Node.js and npm are installed before hand. Clone the repo.
2. Run ```npm install``` all the dependencies and ```npm start``` to start the server.

### Explanation
1. Regarding the folder the structure, "bin" contains everything that does not fit nicely inside npm script(e.g. hook, configuration and etc); "node_modules" is where npm put all locally installed node packages(and usually we put that into .gitignore because dependencies in package.json specified already); "public" contains all static files, spreadsheets, images and front-end JavaScripts; "routes" defines routes for the application; "views" contains jade files which will be processed to be html and served to users.
2. The entry point of the application is specified in package.json--"./bin/www" and later test method may be added. Watch out for changes in package.json.
3. Install nodemon globally and save the trouble of restarting the server when backend js files change.
