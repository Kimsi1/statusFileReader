// Sends the name of the package as a POST request to the backend.
let savePackageName=async(event, name)=>{
    event.preventDefault();
    let url = "http://localhost:3000/packages/"+name;
    fetch(url, {method: "POST"}).then(() => {
      location.href = event.target.href;
    });
  }


  let allNames = [];

  // This is called when the page is loaded.
  const loadPackages = () => {
    // Get all of the packages from backend and save their names on an array.
    fetch('http://localhost:3000/packages/')
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        for(package of myJson){
          allNames.push(package.name);
        }
        
        // Get the package that the user clicked
        fetch('http://localhost:3000/packages/name')
          .then((response) => {
            return response.json();
          })
          .then((myJson) => {

            // Insert package name and description into the html table.
            let name = document.getElementById("name");
            name.innerHTML = myJson.name;
            let description = document.getElementById("description");
            description.innerHTML = myJson.description;  

            // Insert dependensies into the html table.
            let depends = document.getElementById("depends");
            if(myJson.depends==='No dependencies.'){
              depends.innerHTML = myJson.depends; 
            } else {
              
              for (let package of myJson.depends) {
                
                // If there is a pipe character, deal with the linking.
                if(package.toString().includes('| ')){
                  let splitList = package.toString().split('| ');
                  
                  for(let i=0;i<splitList.length;i++){
                    // There might be a '\r' when the App is run in Windows OS, so it is removed.
                    let key = splitList[i].split('\r')
                    // Remove whitespaces from the name.
                    key[0]=key[0].replace(/\s/g, '');
                    // If the package name list includes the dependency name, create a link to it.
                    if(allNames.includes(key[0])){
                      // If there are more items left, put a '|' character to the end
                      if(i<splitList.length-1){
                        const x = `
                          <a href="http://localhost:3000/packagehtml" onclick="javascript:savePackageName(event, '${key[0]}')">${key[0]}</a> |
                        `
                        document.getElementById('depends').innerHTML = document.getElementById('depends').innerHTML + x;
                      } else {
                        const x = `
                          <a href="http://localhost:3000/packagehtml" onclick="javascript:savePackageName(event, '${key[0]}')">${key[0]}</a>
                        `
                        document.getElementById('depends').innerHTML = document.getElementById('depends').innerHTML + x;
                      }
                    } else {
                      // Name was not found in the package name list, so no link will be created.
                      // If there are more items left, put a '|' character to the end
                      if(i<splitList.length-1){
                        const x = `
                        ${splitList[i]} |
                        `
                        document.getElementById('depends').innerHTML = document.getElementById('depends').innerHTML + x;
                      } else {
                        const x = `
                        ${splitList[i]}
                        `
                        document.getElementById('depends').innerHTML = document.getElementById('depends').innerHTML + x;
                      }
                    }  
                  }

                } else {
                  // No pipe character was found in dependency entry.
                  // There might be a '\r' when run in windows OS, so it is removed.
                  let key = package.toString().split('\r')
                  // If the package name list includes the dependency name, create a link to it.
                  if(allNames.includes(key[0])){
                    const x = `
                        <p><a href="http://localhost:3000/packagehtml" onclick="javascript:savePackageName(event, '${key[0]}')">${key[0]}</a></p>
                    `
                    document.getElementById('depends').innerHTML = document.getElementById('depends').innerHTML + x;
                  } else {
                    // Name was not found in the package name list, so no link will be created.
                    const x = `
                        <p>${key[0]}</p>
                    `
                    document.getElementById('depends').innerHTML = document.getElementById('depends').innerHTML + x;
                  }  
                } 
              }
            }

        // List reverse dependencies as links.
        let revDepends = document.getElementById("revDepends");
        if(myJson.revDepends==='No reverse dependencies'){
          revDepends.innerHTML = myJson.revDepends;
        } else {
          for (let package of myJson.revDepends) {
              const x = `
                  <p><a href="http://localhost:3000/packagehtml" onclick="javascript:savePackageName(event, '${package}')">${package}</a></p>
              `
              document.getElementById('revDepends').innerHTML = document.getElementById('revDepends').innerHTML + x;
          }
        }
    });
  })
}

  
loadPackages();