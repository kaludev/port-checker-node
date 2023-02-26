const getIp = async () =>{
    const res = await fetch("http://84.46.246.159:1035/getip");
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
    const res = await fetch("http://84.46.246.159:1035/checkport",{
        body:{
            port: port,
            ip: ip
        }
    });
    const data = await res.json();
    if(!data.ok){
        alert("Error");
    }
    if(data.isOpen){
        output.textContent = `port ${port} on host ${ip} is open`; 
    }

})