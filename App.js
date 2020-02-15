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


function getDescription (props){
    var temp1 = props.split('Description: ');
    var temp2 = temp1[1].split(': ');
    var temp3 = temp2[0].split("\n ");
    var temp4 = temp3[temp3.length-1].split('\n');
    temp3[temp3.length-1] = temp4[0];

    return temp3.join('\n ');
}



// https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript/45035939

// https://stackoverflow.com/questions/4950567/reading-client-side-text-file-using-javascript


var data = getData().toString();
var dataArray = data.split('\n\n');

/*
var fixedDataArray = [];


for(i=0;i<dataArray.length-1;i++){
    fixedDataArray[i] = dataArray[i].concat("EndOfBlock");
    
}
*/


console.log(dataArray);


console.log(getPackageName(dataArray[2]));
console.log(getDescription(dataArray[2]));



