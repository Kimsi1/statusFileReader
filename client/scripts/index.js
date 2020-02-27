const x = '<div class="loader" id="loader"></div>'


async function uploadFile(inp){
    document.getElementById('content').innerHTML = document.getElementById('content').innerHTML + x;
    let filu = inp.files[0];
    let formData = new FormData();

    formData.append("file", filu);
    let r = await fetch('/upload/file', {method: "POST", body: formData});
    console.log('HTTP response code:',r.status); 
    
    window.location.href='/list/';
  }

  async function useExample(){
    document.getElementById('content').innerHTML = document.getElementById('content').innerHTML + x;
    let r = await fetch('/example/', {method: "GET"});
    console.log('HTTP response code:',r.status);
    document.getElementById('content').innerHTML = document.getElementById('content').innerHTML + x;
    window.location.href='/list/';
  }
    
