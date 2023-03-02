const getIp = async () =>{
    const res = await fetch("/getip");
    const data = await res.json();
    if(!data.ok){
        alert("Error");
    }
    const ip = data.ip;
    document.querySelector('.fieldIp').value= ip;
    document.querySelectorAll('.desc')[2].textContent += ' ' + ip;
}
getIp();
const output = document.querySelector('.data');
document.querySelector('#check').addEventListener('submit', async (e) => {
    e.preventDefault();
    const port = document.querySelector('.fieldPn').value; 
    const ip = document.querySelector('.fieldIp').value;
    const body = {
        port: port,
        ip: ip
    }
    const res = await fetch("/checkport",{
        method :"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(body)
    });
    const data = await res.json();
    if(!data.ok){
        alert("Error");
    }
    if(data.isOpen){
        output.textContent = `port ${port} on host ${ip} is open`; 
    }else{
        output.textContent = `port ${port} on host ${ip} is not open`; 
    }

})