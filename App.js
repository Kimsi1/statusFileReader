const fs = require('fs')



function getData() {
    try {
        const data = fs.readFileSync('statusLess.real', 'utf8');
        return data;
        
      } catch (err) {
        console.error(err)
      }
      
}

// A function that returns the name of a package.
function getPackageName (props){
    var temp1 = props.split('\n',1);
    var temp2 = temp1[0].concat(": ");
    var temp3 = temp2.split(": ",2);
    
    return temp3[1];
}



// https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript/45035939

// https://stackoverflow.com/questions/4950567/reading-client-side-text-file-using-javascript



// Read the data and form it into an array.
let data = getData().toString();

while (true){
    if(data.includes('\n\n',data.length-4)){
        data.slice(data.length-4, data.length);
    }else{
        break;
    }
}

let dataArray = data.split('\n\n');



// Create a class of a package.
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
    
        return temp3.join('\n ');
    }

    setRevDepends (props){
        this.revDepends = props;
    }

    getRevDepends(){
        return this.revDepends;
    }

}


/*
var fixedDataArray = [];
for(i=0;i<dataArray.length-1;i++){
    fixedDataArray[i] = dataArray[i].concat("EndOfBlock");
    
}

*/


// Make an array of all package objects.
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


/*
if(packageArray[1].getDepends().includes(packageArray[3].getName())){
    packageArray[3].setRevDepends(packageArray[1].getName());
}

*/

let testLog = [];

for(let i=0;i<packageArray.length;i++){
    
    let testPackage = {
        name: packageArray[i].getName(),
        depends: packageArray[i].getDepends(),
        description: packageArray[i].getDescription(),
        revDepends: packageArray[i].getRevDepends()

    }
    
    testLog.push(testPackage);
    
}


console.log(testLog);
