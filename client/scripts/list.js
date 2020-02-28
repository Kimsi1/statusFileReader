let savePackageName=async(event, name)=>{
    event.preventDefault();
    let url = "/packages/"+name;
    fetch(url, {method: "POST"}).then(() => {
      location.href = event.target.href;
    });

  }

const loadPackages = () => {
  // Get all of the packages from backend, check if a package can be found and make the package names links in the page.
  fetch('/packages/', {method: "GET"}).then((response) => {
    return response.json();
  }).then((packages) => {
      if(packages.name==='NOT FOUND'){
        const x = '<h3>Could not find any Packages. Please check your uploaded file, or use the example data.</h3>'
        document.getElementById('packages').innerHTML = document.getElementById('packages').innerHTML + x;
      } else {

      for (let package of packages) {
        const x = `
        <a class="package-item" href="/packagehtml" onclick="javascript:savePackageName(event, '${package.name}')">${package.name}</a>
        `
        document.getElementById('packages').innerHTML = document.getElementById('packages').innerHTML + x;
      }
    }
  })
}
loadPackages();