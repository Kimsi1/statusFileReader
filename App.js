const fs = require('fs')
let path = require('path');


function getData() {
    try {
        const data = fs.readFileSync('status.real', 'utf8');
        return data;
        
      } catch (err) {
        console.error(err)
      }
      
}

// A function that returns the name of a package.
function getPackageName (props){
    var temp1 = props.split('\r\n',1);
    var temp2 = temp1[0].concat(": ");
    var temp3 = temp2.split(": ",2);
    
    return temp3[1];
}

// https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript/45035939

// https://stackoverflow.com/questions/4950567/reading-client-side-text-file-using-javascript


// Read the data and form it into an array.
let data = getData().toString();
let dataArray = [];
    // Split data into packages according to operating system (windows or linux)
if(process.platform === 'win32'){
    dataArray = data.split('\r\n\r\n');
} else {
    dataArray = data.split('\n\n');
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
      var temp3 = temp2[0].split("\n ");
      var temp4 = temp3[temp3.length-1].split('\n');
      temp3[temp3.length-1] = temp4[0];
           
      var temp5 = temp3.join('\n ');
      var temp6 = temp5.split(', ');
      var temp7 = [];
      
      for(let i=0;i<temp6.length;i++){
        let temp8=temp6[i].replace(/\s*\(.*?\)\s*/g, '');
        temp7.push(temp8);
      }
      
      // TODO: fix removing duplicates
      [...new Set(temp7)];
      temp7.filter((item, index) => temp7.indexOf(item) === index);
      temp7.reduce((unique, item) => 
        unique.includes(item) ? unique : [...unique, item], []);
      /*  
      
      https://medium.com/dailyjs/how-to-remove-array-duplicates-in-es6-5daa8789641c
            
      */

      return temp7
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


// Make an array of all package objects.
let packageArray = [];
for(let i=0;i<dataArray.length;i++){
    let name = getPackageName(dataArray[i]);
    let package = new Package(name, dataArray[i]);
    packageArray.push(package);

}

// Get reverse dependencies for every package object.
//https://www.sitepoint.com/javascript-large-data-processing/
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
let orderedArray = [];
for(let i=0;i<packageArray.length;i++){
    let orderedPackage = {
        name: packageArray[i].getName(),
        depends: packageArray[i].getDepends(),
        description: packageArray[i].getDescription(),
        revDepends: packageArray[i].getRevDepends()
    }
    orderedArray.push(orderedPackage);
}



// Define backend API using express
const port = 3000;
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/packages', (req, res) => {
    res.json(orderedArray);
});

app.get('/packagehtml', (req, res) => {
    res.sendFile(path.join(__dirname+'/package.html'));
});

// Use the backend API to store the package name that the user clicked last in the frontend
let name = '';
app.post('/packages/:name', (req, res) => {
    name = req.params.name;
    res.end(name);
});

// This returns the package which's name equals the name the user last clicked in the frontend
app.get('/packages/name', (req, res) => {
        let found = false;
        for (let package of orderedArray) {
            if (package.name === name) {
                found=true;
                res.json(package);
            }
        }
        // Sending 404 when not found
        if(!found){
            res.status(404).send('Not found');
        }
});


// Start the backend
app.listen(port, () => console.log(`Packages app listening on port ${port}!`))

