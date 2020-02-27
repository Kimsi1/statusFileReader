async function uploadFile(inp){
    let filu = inp.files[0];
    let formData = new FormData();

    formData.append("file", filu);
    let r = await fetch('/upload/file', {method: "POST", body: formData});
    console.log('HTTP response code:',r.status); 
    window.location.href='/list/';
  }

  async function useExample(){
    let r = await fetch('/example/', {method: "GET"});
    console.log('HTTP response code:',r.status); 
    window.location.href='/list/';
  }
    
