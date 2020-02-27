let savePackageName=async(event, name)=>{
    event.preventDefault();
    let url = "http://localhost/packages/"+name;
    fetch(url, {method: "POST"}).then(() => {
      location.href = event.target.href;
    });

  }


  
  // TODO: XMLHTTPrequest gives an error in the console.
  const loadPackages = () => {
      const xhttp = new XMLHttpRequest();

      xhttp.open("GET", "http://localhost/packages", false);
      xhttp.send();


      // https://stackabuse.com/building-a-rest-api-with-node-and-express/


      const packages = JSON.parse(xhttp.responseText);
      
      if(packages.name==='NOT FOUND'){
        const x = '<h3>Could not find any Packages. Please check your uploaded file, or use the example data.</h3>'
        document.getElementById('packages').innerHTML = document.getElementById('packages').innerHTML + x;
      } else {

        for (let package of packages) {
            const x = `
            <a class="package-item" href="http://localhost/packagehtml" onclick="javascript:savePackageName(event, '${package.name}')">${package.name}</a>
            `
            document.getElementById('packages').innerHTML = document.getElementById('packages').innerHTML + x;
        }
      }
  }

  loadPackages();