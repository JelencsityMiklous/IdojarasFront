let chart = null;
let chartLabels = [];
let chartData = [];



async function getStatistics(){

    try{
        let res = await fetch(`${ServerURL}/idojaras/users/${loggedUser.id}`);
        
        idojarasok = await res.json();
        idojarasok = idojarasok.sort((a,b) => new Date(a.date) - new Date(b.date));
        chartLabels = [];
        chartData = [];
        
        idojarasok.forEach(idojaras => {
          chartLabels.push(idojaras.date);
          chartData.push(idojaras.idojarasAdat);
        });
      }catch(err){
          console.log(err);
          showMessage('danger', 'Hiba', 'Hiba az adatok lekérdezése során!'); 
      }
    
    
}


function initChart(){
    

    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data:{
            labels: chartLabels,
            datasets: [
              {

                label: loggedUser.name,
                data: chartData,
                backgroundColor: 'yellow',
                pointStyle: 'triangle',
                borderColor:'gray',
                pointRadius: 10,
                pointHoverRadius: 50,
              }
            ]
          },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
            }
          },
          
          
        
        },
      });


}
