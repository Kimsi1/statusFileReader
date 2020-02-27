const fs = require('fs')
let path = require('path');

let fileName = 'status.real'
let orderedArray = [];


// Reads data from a file
function getData() {
    try {
        const data = fs.readFileSync(fileName, 'utf8');
        console.log(data);
        return data;
        
      } catch (err) {
        console.error(err)
      }  
}

// Returns the name of a package from a block of text.
function getPackageName (props){
    var temp1 = props.split('\r\n',1);
    var temp2 = temp1[0].concat(": ");
    var temp3 = temp2.split(": ",2);
    
    return temp3[1];
}



// Define a package object as a class
class Package {
    constructor(name, packageText) {
        this.name = name;
        this.packageText = packageText;
        this.revDepends = 'No reverse dependencies'
    }

    getName (){
        return this.name;
    }

    getDepends (){
      var temp1 = this.packageText.split('Depends: ');
      
      if(temp1.length < 2){
          return "No dependencies.";
      } else {
      
      var temp2 = temp1[1].split(': ');
      var temp3 = temp2[0].split('Conffiles:');
      var temp4 = temp3[0].split("\n ");
      var temp5 = temp4[temp4.length-1].split('\n');
      temp4[temp4.length-1] = temp5[0];
           
      var temp6 = temp4.join('\n ');
      var temp7 = temp6.split(', ');
      var temp8 = [];
      
      for(let i=0;i<temp7.length;i++){
        // Find and remove anything between brackets, and spaces from the front and back of the brackets
        let temp9=temp7[i].replace(/\s*\(.*?\)\s*/g, '');
        
        temp8.push(temp9);

        
      }
      // Remove duplicates.
      return Array.from(new Set(temp8));
      }
    }
    
    getDescription (){
        var temp1 = this.packageText.split('Description: ');
        var temp2 = temp1[1].split(': ');
        var temp3 = temp2[0].split("\n ");
        var temp4 = temp3[temp3.length-1].split('\n');
        temp3[temp3.length-1] = temp4[0];
        let temp5=temp3.join('\n ');
        let temp6=temp5.replace(/\n/g, "<br>");
        return temp6;
    }

    setRevDepends (props){
        if(this.revDepends==='No reverse dependencies'){
            this.revDepends=[];
        }
        this.revDepends.push(props);
    }

    getRevDepends(){
        return this.revDepends;
    }
}

// This function gets called when new filedata needs to be processed
function processData(){
    
    // Clear previous data.
    orderedArray = [];


    // Read the data and form it into an array.
    let data = getData().toString();
    let dataArray = [];
    // Check if the data contains at least 1 package text.
    if(data.includes('Package: ')){
        // Split data into packages according to operating system (windows or linux)
        if(process.platform === 'win32'){
            dataArray = data.split('\r\n\r\n');
        } else {
            dataArray = data.split('\n\n');
        }
    } else {
        // If there was no package text, exit the function.
        return;
    }

    // Make an array and store all package objects there.
    let packageArray = [];
    for(let i=0;i<dataArray.length;i++){
        let name = getPackageName(dataArray[i]);
        let package = new Package(name, dataArray[i]);
        packageArray.push(package);

    }

    // Get reverse dependencies for every package object.
    for(let i=0;i<packageArray.length;i++){
        let pack = packageArray[i];
        for (let j=0;j<packageArray.length;j++){
            if(packageArray[j].getDepends().includes(pack.getName())){
                pack.setRevDepends(packageArray[j].getName());
            }
                
        }
    }


    // Remove packages from the end of the package array, that have no name.
    while (true){
        if(packageArray[packageArray.length-1].getName()===''){
            packageArray.pop();
        } else {
            break;
        }
    }


    // Sort packages in the package array alphapetically
    packageArray.sort(function(a, b){
        return a.getName().localeCompare(b.getName());
    })


    // Create a formally ordered array out of the package array
    for(let i=0;i<packageArray.length;i++){
        let orderedPackage = {
            name: packageArray[i].getName(),
            depends: packageArray[i].getDepends(),
            description: packageArray[i].getDescription(),
            revDepends: packageArray[i].getRevDepends()
        }
        orderedArray.push(orderedPackage);
        console.log(orderedArray);
    }
}



// Define backend API using express
const port = 3000;
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');

app.use(fileUpload(), express.static(__dirname + '/client'));

// HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/index.html'));
});

app.get('/list', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/list.html'));
});

app.get('/packagehtml', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/package.html'));
});


// All packages
app.get('/packages', (req, res) => {
    if(orderedArray.length>0){
        res.status(200).json(orderedArray);
    } else {
        res.status(200).json({name:'NOT FOUND'})
    }
    
});


// Use the backend API to store the package name that the user clicked last in the frontend
let name = '';
app.post('/packages/:name', (req, res) => {
    name = req.params.name;
    res.end(name);
    
});

// This API returns the package which's name is equal to the name that was last clicked in the frontend
app.get('/packages/name', (req, res) => {
        let found = false;
        for (let package of orderedArray) {
            if (package.name === name) {
                found=true;
                res.json(package);
            }
        }
        // When not found, send data to reflect that
        if(!found){
            let notFound = new Package('NOT FOUND','Depends: NOT FOUND\n Description: NOT FOUND\n')
            res.json(notFound);
        }
});

// Receive a file from client and save it to the server.
app.post('/upload/file', (req, res) => {
    if (!req.files){
        return res.status(400).send('No files were uploaded.');
    }
    let filu = req.files.file;
    filu.mv(__dirname+'/fileLess.real', function(err) {
        if (err){
            return res.status(500).send(err);
        }
        // Use the data in the new file to create package data.
        fileName='fileLess.real';
        processData();
        return res.status(200).send('File uploaded!');
    })
});

app.get('/example', (req, res) => {
    fileName='status.real';
    processData();
    return res.status(200).send('Using example data');
    
});


// Start the backend
processData();
//app.listen(port, () => console.log(`App listening on port ${port}!`))
app.listen(process.env.PORT || port, () => console.log(`App listening on port ${port}!`))

