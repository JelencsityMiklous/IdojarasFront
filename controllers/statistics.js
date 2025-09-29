let chart = null;
let chartLabels = [];
let chartDataMin = [];
let chartDataMax = [];



async function getStatistics(){

    try{
        let res = await fetch(`${ServerURL}/idojaras/users/${loggedUser.id}`);
        
        idojarasok = await res.json();
        idojarasok = idojarasok.sort((a,b) => new Date(a.date) - new Date(b.date));
        chartLabels = [];
        chartData = [];
        
        idojarasok.forEach(idojaras => {
          chartLabels.push(idojaras.date);
          chartDataMin.push(idojaras.idojarasAdatMin);
          chartDataMax.push(idojaras.idojarasAdatMax);
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

                label: 'Min',
                data: chartDataMin,
                backgroundColor: 'yellow',
                pointStyle: 'triangle',
                borderColor:'gray',
                pointRadius: 10,
                pointHoverRadius: 50,
              },
              {
                label: 'Max',
                data: chartDataMax,
                backgroundColor: 'red',
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
