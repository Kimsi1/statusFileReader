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

function getDepends (props){
    var temp1 = props.split('Depends: ');
    
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


//console.log(getPackageName(dataArray[2]));
//console.log(getDescription(dataArray[2]));
//console.log(getDepends(dataArray[2]));

let nameAndDependsArray = [];

for(i=0;i<dataArray.length;i++){
    var name=getPackageName(dataArray[i]);
    console.log(name);
    var depends=getDepends(dataArray[i]);
    nameAndDependsArray[i]={name,depends};
}



console.log(nameAndDependsArray);

