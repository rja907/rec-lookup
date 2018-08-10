# rec-lookup : the Node.js DNS Lookup API

The containing files contain code that can be used to talk to this API to check out multiple records.

#### Project structure

```
app
├── routes
│   ├── access.log      (Logs the requests of the separate endpoints for various record types.)
│   ├── auth.js         (Can be used to provide Basic Authorization for a route.)
│   ├── basicAuth.js    (Implements basic authorization at /basicAuth endpoint.)
│   ├── separate.js     (Implements separate endpoints for various record types.)
├── access.log          (Logs the response data of the root ('/') POST request.)
├── index.js            (Contains module dependency and package dependency definitions and the root ('/') POST request handler.)
├── package-lock.json   (Automatically generated for any operations where npm modifies either the node_modules tree, or package.json)
├── package.json        (Holds various metadata relevant to the project and handles the project dependencies.)
└── README.md           (Contains the information about the project and implementation instructions.)
```

#### How to implement this API (for MacOS):

1. You have to install Node.js on your computer. You can do that using this [link](https://nodejs.org/en/download/). You just follow the instructions to install it.

2. Run `node -v` on the terminal to make sure that it is installed. It will give a response like `vX.X.X` where X will change according to your node version.

3. Now, run `npm -v` to make sure that the Node Package Manager is installed. It will give a response like `X.X.X` where X will change according to your node version.

4. Download Postman [here](https://www.getpostman.com/apps) and follow the installation instructions.

5. Now, download the zip file and click twice on the zip download to unzip it and view its contents. You can choose to use an IDE like VSCode, Atom, Sublime Text, Vim to view the project files. OR To clone this repository, `cd` into your desired directory and run the following command on the terminal: `git clone https://github.com/rja907/RecLookup.git`.

   > I have deliberately not added a `.gitignore` file which could help in avoiding `node_modules` directory so that it there is not an added step of `npm install`.

6. Now, using the terminal, `cd` into the project directory. After you are in the project directory, run the following command `npm start`. This command will start a server on port 8000 that can accept different types of POST requests.

7. Now that we have a server running, open Postman to make API requests to this API!

##### _8. How to make a request on Postman:_

1. When you open the application, you'll see a Modal. Close it with `X` and you'll that you can Enter a request URL with a default `GET` method.
2. Now, click on `GET` which will open a dropdown and select `POST`.
3. Now, enter the request URL as : `http://localhost:8000`.
4. There are different buttons right below the request URL input box like Authorization, Headers, Body, Pre-request Script and Test. Click on `Body`.
5. You'll see a list of radio buttons. Choose `raw`.
6. Upon choosing `raw`, a dropdown will appear on the right with it's default value set as `Text`. Click on the dropdown and choose `JSON (application/json)`.

###### 7. Almost none of the sites support all 4 records.

- To verify response for `A`, `TXT` and `CNAME` records use the following request format:

```javascript
{
  "lookup": "www.twitter.com",
  "recordTypes": ["A", "TXT", "CNAME"]
}
```

- To verify response for `SRV` record use the following request format:

```javascript
{
  "lookup": "www.google.com",
  "recordTypes": ["SRV"]
}
```

- To verify response for `CNAME` record use the following request format:

```javascript
{
  "lookup": "www.amazon.com",
  "recordTypes": ["CNAME"]
}
```

8. After entering this request body, press the blue `Send` button to get a response!

### Bonus features:

##### _1. Capturing different metrics of requests._

I captured the metrics using [Morgan](https://github.com/expressjs/morgan), a HTTP request logger middleware for node.js which logs all the information about the requests to an `access.log` file. You can see that every single request logged here has a few following properties (in order):

1. Time at which the request was made,
2. a string with the type of request (eg. POST), the endpoint `/` and the HTTP/1.1.
3. A status code which shows `200` for OK, `400` for Bad request, `404` for not found, `-` in cases where the request didn't go through and `500` for internal server error.

##### _2. Implementing concurrent lookup for the various recordTypes at a separate endpoint._

1. To see the files for this task, you can look into routes directory and go through separate.js which goes through has the different POST requests for various types like `CNAME`, `A`, `AAAA`, `NS`, `MX`, `SRV`, `SOA` and `TXT`.
2. To make a request, enter the URL as: `http://localhost:8000/type/A` or choose whichever record type you wish to check out and append it at the end (in place of `A`) in capital letters.
3. Again, choose body, raw and JSON for the request body.
4. Request format:

```javascript
 {
   "lookup": "google.com",
   "recordType": "A"
 }
```

5. Then press the blue `Send` button to get a response.
6. If we see in the access.log file of the directory, we can clearly see that the time take to respond is about `100 ms` for record type. Whereas in the root POST request, it takes about `500 ms` for every single request as it has to check for multiple record types.

##### _3. Implement basic Auth at a separate end point._

1. Open a new tab in Postman and select `POST` with the URL as: http://localhost:8000/basicAuth.
2. Choose the body, raw, and JSON (application/json) and enter the following request:

```javascript
{
  "name": "Your name"
}
```

3. If you press the blue `Send` button here, you will get an response saying `You are not authorized!`
4. To get authorized, click the Authorization button, choose Basic Auth for the Type dropdown, and enter Username as `evo` and password as `calize`.
5. Click on the orange `Update request` button and click send again.
6. Now, you'll see a response saying `<Your name> is authorized!`

### Dependencies used and their benefits:

- `async` module for asynchronous requests.
- `basic-auth` module for adding authorization to different routes.
- `cors` module to support Cross Origin Resource Sharing.
- `express` is used as a web framework for Node to implement routes, requests and middlewares.
- `helmet` sets various HTTP headers to make a secure express application.
- `joi` will be used for input validation in the future.
- `morgan` is an HTTP request logger middleware.
- `nodemon` automatically restarts the node application when file changes in the directory are detected.

### Future plans:

1. Support all the records.
2. Add a more rigorous input validation using [Joi](https://www.npmjs.com/package/joi).
3. Add tests using [Mocha](https://www.npmjs.com/package/mocha).
4. Add caching using [Redis](https://www.npmjs.com/package/redis).
