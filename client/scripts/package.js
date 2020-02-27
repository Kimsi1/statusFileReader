// Sends the name of the package as a POST request to the backend.
let savePackageName=async(event, name)=>{
    event.preventDefault();
    let url = "/packages/"+name;
    fetch(url, {method: "POST"}).then(() => {
      location.href = event.target.href;
    });
  }


  let allNames = [];

  // This is called when the page is loaded.
  const loadPackages = () => {
    // Get all of the packages from backend and save their names on an array.
    fetch('/packages/')
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        for(package of myJson){
          allNames.push(package.name);
        }
        
        // Get the package that the user clicked
        fetch('/packages/name')
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
                    
                    // Remove whitespaces from the name.
                    let key = splitList[i].replace(/\s/g, '');
                    // If the package name list includes the dependency name, create a link to it.
                    if(allNames.includes(key)){
                      // If there are more items left, put a '|' character to the end
                      if(i<splitList.length-1){
                        const x = `
                          <a href="/packagehtml" onclick="javascript:savePackageName(event, '${key}')">${key}</a> |
                        `
                        document.getElementById('depends').innerHTML = document.getElementById('depends').innerHTML + x;
                      } else {
                        const x = `
                          <a href="/packagehtml" onclick="javascript:savePackageName(event, '${key}')">${key}</a>
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
                  // If the package name list includes the dependency name, create a link to it.
                  if(allNames.includes(package.toString())){
                    const x = `
                        <p><a href="/packagehtml" onclick="javascript:savePackageName(event, '${package.toString()}')">${package.toString()}</a></p>
                    `
                    document.getElementById('depends').innerHTML = document.getElementById('depends').innerHTML + x;
                  } else {
                    // Name was not found in the package name list, so no link will be created.
                    const x = `
                        <p>${package.toString()}</p>
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
                  <p><a href="/packagehtml" onclick="javascript:savePackageName(event, '${package}')">${package}</a></p>
              `
              document.getElementById('revDepends').innerHTML = document.getElementById('revDepends').innerHTML + x;
          }
        }
    });
  })
}

  
loadPackages();