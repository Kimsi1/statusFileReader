const fs = require('fs')

function getData() {
    try {
        const data = fs.readFileSync('statusLess.real', 'utf8');
        return data;
        
      } catch (err) {
        console.error(err)
      }
      
}

function getPackageName (props){
    var temp1 = props.split('\n',1);
    var temp2 = temp1[0].concat(": ");
    var temp3 = temp2.split(": ",2);
    
    return temp3[1];
}









// https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript/45035939

// https://stackoverflow.com/questions/4950567/reading-client-side-text-file-using-javascript



var data = getData().toString();
var dataArray = data.split('\n\n');

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
        
      for (i = 0; i<temp6.length;i++){
          var temp8=temp6[i].split(' (');
          temp7[i]=temp8[0];
      }
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


let nameAndDependsArray = [];


console.log(nameAndDependsArray);


*/

let packageArray = [];

for(i=0;i<dataArray.length;i++){
    let name = getPackageName(dataArray[i]);
    let package = new Package(name, dataArray[i]);
    packageArray.push(package);

}

/*
console.log(dataArray);
console.log(getPackageName(dataArray[2]));
console.log(getDescription(dataArray[2]));
console.log(getDepends(dataArray[2]));


*/

let testName = packageArray[1].getName;
console.log(testName);