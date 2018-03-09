//Import JS Frameworks
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//Import auto-increment plugin
var autoIncrement = require('mongoose-auto-increment');

//Connecting to mongoDB server
var connection = mongoose.createConnection("mongoDB://localhost/recruitmentDB");

//Initialize auto-incrementation counter
autoIncrement.initialize(connection);


//Using Body-Parser to get data from requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Enable CORS and request methods
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
	next();
});

//Creating UserInfo Schema
var userInfo = connection.model("UserInfo", Schema({
    _id: String,
    _userId: String,
    password: String,
    email: String,
    userType: String,
    firstName: String,
    lastName: String
},
{
    _id: false
}));

//Creating JobPostinfInfo Schema
var jobPostingInfo = connection.model("JobPostingInfo", Schema({
    _id: String,
    _jobCode: String,
    jobTitle: String,
    recruiterUserId: String,
    approval: String,
    exprience: String,
    skills: []
},
{
    _id: false
}));

//Creating Applicant Schema
var applicantSchema = new Schema({
    _applicantId: Number,
    firstName: String,
    lastName: String,
    email: String,
    experience: String,
    skills: [],
    recruiterUserId: String
});
var applicant = connection.model("applicant", applicantSchema);
applicantSchema.plugin(autoIncrement.plugin, {
    model: 'applicant',
    field: '_applicantId',
    startAt: 1
});
// Update applicant by applicant ID 
app.put('/api/updateApplicant/:_applicantId', function(req, res){
    applicant.findOneAndUpdate({_applicantId:req.params._applicantId}, req.body,
    function(err, applicant){
        if (err) {
           res.send(err); 
        }
        res.json(applicant);
        console.log("Applicant"+applicant);
    });
});
// Update job posting by job code ID 
app.put('/api/jobPosting/:_jobCode', function(req, res){
    console.log("Type: ID "+typeof(req.params._id));
    jobPostingInfo.findOneAndUpdate({_jobCode:req.params._jobCode}, req.body,
    function(err, job){
        if (err) {
           res.send(err); 
        }
        res.json(job);
        console.log("Applicant"+job);
    });
});
//Get a user from the userinfo collection - Andrew
app.get('/api/getUserById/:id', function(req, res)
{
    userInfo.findOne({_userId : req.params.id},function(err, user)
    {
        if(err)
        {
            res.send(err);
            return;
        }
        console.log(user);
        res.json(user);
    });
});

//Get list of users from userinfo - Andrew
app.get('/api/getUsers/', function(req,res)
{
    userInfo.find(function(err, user)
    {
        if(err)
        {
            res.send(err);
            return;
        }
        console.log(user);
        res.json(user);
    });
});

//Get 10 job postings by Title - Andrew
app.get('/api/getJobsByTitle/:jobTitle', function(req, res)
{
    jobPostingInfo.find(function(err, jobs)
    {
        if(err)
        {
            res.send(err);
            return;
        }
        var title = req.params.jobTitle;
        var matchingJobs = [];
        numJobs = 0;
        for(i = 0; ((i<jobs.length)&&(numJobs <10));i++)
        {
            if(title.toLowerCase() === jobs[i].jobTitle.toLowerCase())
            {
                matchingJobs.push(jobs[i]);
                numJobs++;
            }
        }
        console.log(matchingJobs);
        res.json(matchingJobs);
    });
});

//Add a user to the userinfo collection - Thierno
app.post('/api/addUserInfo', function(req, res){
    userInfo.create(req.body, function(err, usr){
        if (err) {
            res.send(err);
            return;
        }
        console.log(usr);
        res.json(usr);
    });
});

//Add a job Posting to the JobPostinginfo collection - Thierno
app.post('/api/addJobPosting', function(req, res){
    jobPostingInfo.create(req.body, function(err, job){
        if (err) {
            res.send(err);
            return;
        } 
        console.log(job);
        res.json(job);
    });
});

//Add a user to the appicant collection - Isaac
app.post('/api/addApplicant', function(req, res){
    applicant.create(req.body, function(err, appli){
        if (err) {
            res.send(err);
            return;
        }
        console.log(appli);
        res.json(appli);
    });
});

//Testing function to create the database using a POST request - Lam Nguyen
app.post("/api/createDatabase", function(req, res) {
    console.log(req.body);
    var newUser = {
        "_userId" : "12345",
        "password" : "avcxs",
        "email" : "abc@def.com",
        "userType" : "Manager",
        "firstName" : "New",
        "lastName" : "Guy"
    };
    var newJobPost = {
        "_jobCode" : "JAR-112",
        "jobTitle" : "Java Tester",
        "recruiterUserId" : "00000",
        "approval" : "No",
        "experience" : "2 years",
        "skills" : ["Java", "SQL"]
    }
    userInfo.create(newUser, function(err, user) {
        if (err)
            res.send(err);
        console.log("test function checked!");    
    });
    jobPostingInfo.create(newJobPost, function(err, jobPost) {
        if (err)
            res.send(err);
        console.log("test2 function checked!");
    });
    res.send("req completed!");
});

//Find an applicant by id - Isaac
app.get('/api/applicants/:_applicantId', function(req, res){
    console.log(req.params._applicantId);
    applicant.find({_applicantId:req.params._applicantId}, function(err, appli){
        if(err)
            res.send(err);
        res.json(appli);
    });
});

//Search applicants by firstName - Isaac
app.get('/api/applicants/searchFirstName/:firstName', function(req, res){
    applicant.find(function(err, firstNameSearch)
    {
        if(err)
        {
            res.send(err);
            return;
        }
        var firstName = req.params.firstName;
        console.log(firstName);
        console.log(firstNameSearch.length);
        var sameFirstName = [];
        var numFirstName = 0;
        for(var i = 0; i<firstNameSearch.length;i++)
        {
            if(numFirstName == 10){
                break;
            }
            var temp = firstNameSearch[i].firstName;
            if(firstName.toLowerCase() === temp.toLowerCase())
            {
                sameFirstName.push(firstNameSearch[i]);
                numFirstName++;
            }
        }
        console.log(sameFirstName);
        res.json(sameFirstName);
    });
});

//Search applicants by LastName - Isaac
app.get('/api/applicants/searchLastName/:lastName', function(req, res){
    applicant.find(function(err, lastNameSearch)
    {
        if(err)
        {
            res.send(err);
            return;
        }
        var lastName = req.params.lastName;
        console.log(lastName);
        console.log(lastNameSearch.length);
        var sameLastName = [];
        var numLastName = 0;
        for(var i = 0; i<lastNameSearch.length;i++)
        {
            if(numLastName == 10){
                break;
            }
            var temp = lastNameSearch[i].lastName;
            if(lastName.toLowerCase() === temp.toLowerCase())
            {
                sameLastName.push(lastNameSearch[i]);
                numLastName++;
            }
        }
        console.log(sameLastName);
        res.json(sameLastName);
    });
});

//Start the API server
app.listen(3000, function() {
    console.log("Recruitment Server is up!!!");
});