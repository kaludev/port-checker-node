console.log("loaded");
const getIp = async () =>{
    const res = await fetch("http://localhost:1035/getip");
    const data = await res.json();
    if(!data.ok){
        alert("Error");
    }
    const ip = data.ip;
    document.querySelector('.fieldIp').textContent = ip;
}
getIp();