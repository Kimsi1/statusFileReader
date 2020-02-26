let savePackageName=async(event, name)=>{
    event.preventDefault();
    let url = "http://localhost:3000/packages/"+name;
    fetch(url, {method: "POST"}).then(() => {
      location.href = event.target.href;
    });

  }


  
  // TODO: XMLHTTPrequest gives an error in the console.
  const loadPackages = () => {
      const xhttp = new XMLHttpRequest();

      xhttp.open("GET", "http://localhost:3000/packages", false);
      xhttp.send();


      // https://stackabuse.com/building-a-rest-api-with-node-and-express/


      const packages = JSON.parse(xhttp.responseText);
      
      if(packages.name==='NOT FOUND'){
        const x = 'Could not find any Packages. Please check uploaded file, or use example data.'
        document.getElementById('packages').innerHTML = document.getElementById('packages').innerHTML + x;
      } else {

        for (let package of packages) {
            const x = `
                <p><a href="http://localhost:3000/packagehtml" onclick="javascript:savePackageName(event, '${package.name}')">${package.name}</a></p>
            `
            document.getElementById('packages').innerHTML = document.getElementById('packages').innerHTML + x;
        }
      }
  }

  loadPackages();