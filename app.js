var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var supervisorRouter = require('./routes/supervisor');
var customerRouter = require('./routes/customer');
var booksRouter = require('./routes/books');
var fitnessRouter = require('./routes/fitness');
var healthRouter = require('./routes/health');
var recipesRouter = require('./routes/recipes');

var session = require('express-session')
var mysql = require('mysql')
var app = express();



app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/supervisor', supervisorRouter);
app.use('/customer', customerRouter);
app.use('/books', booksRouter);
app.use('/fitness', fitnessRouter);
app.use('/health', healthRouter);
app.use('/recipes', recipesRouter);

app.post('/login',function(req,res){

    // catching the data from the POST
    var user =req.body.username;
    var pass = req.body.password;


	console.log("User name = "+ user);
    console.log("Password = "+ pass);

    // Connect to the database
    var mysql = require('mysql')
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      port : 3306,
      database : 'betteryou'
    });

    connection.connect()

    connection.query('SELECT * from users WHERE username = "'+user+'" AND password = "'+pass+'"', function (err, rows, fields) {
      if (err) throw err
      for(var i=0; i< rows.length; i++){
           console.log('Acc type: ', rows[i].acctype);
           res.send(rows[i].acctype); // send the account type back to jQuery mobile.
      }
    })

    connection.end()
});

app.post('/register',function(req,res){

  // catching the data from the POST
  var NewUser = req.body.username;
  var NewPass = req.body.password;
  var NewAccT = 'customer';

    console.log("Username = "+ NewUser);
    console.log("Password = "+ NewPass);

  // Connect to the database
  var mysql = require('mysql')
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    port : 3306,
    database : 'betteryou'
  });

  connection.connect()
  var sql = "INSERT INTO users (username, password, acctype) VALUES ('"+NewUser+"' , '"+NewPass+"', '"+NewAccT+"')";
  console.log(sql);
  connection.query(sql);
}); //end of register

app.get("/getUsers", function(req,res,next)
{
    var sql = "SELECT username,acctype FROM users;";
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        port : 3306,
        database : 'betteryou'
    });
    connection.connect(function(err){
        connection.query(sql,function (err, rows, fields){
            if (err) throw err;
            res.send({users: rows});
        }); // end query
    }); // end connection
});

app.post('/adminDeleteUser',function(req,res){
    var user = req.body.user;
    var sql = "DELETE FROM users WHERE username = '" + user + "';";

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        port : 3306,
        database : 'betteryou'

    });
    connection.connect(function(err){
        try{
            connection.query(sql);
            res.status(200);
            res.send("User successfully deleted!");
        }
        catch (err){
            res.send("Unexpected error " + err.message + " occured!");
        }
    });
});

app.post("/EditUser", function(req,res)
{
    var user = req.body.user;
    var accType = req.body.user;
    var sql = "UPDATE users SET username = '" + user + "',acctype = '" + accType + "' WHERE username = '" + user + "';";

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        port : 3306,
        database : 'betteryou'
    });

    connection.connect(function(err)
    {
        try
        {
            connection.query(sql);
            res.status(200);
            res.send("User edited successfully!");
        }
        catch (err)
        {
            res.send("Unexpected error " + err.message + " occured!");
        }
    }); // end connection
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
