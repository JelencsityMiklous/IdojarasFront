let calEvents = [];

async function getCalendarData2(){
    try{
        let res = await fetch(`${ServerURL}/idojaras/users/${loggedUser.id}`);
        idojaras = await res.json();
        calEvents = [];
        idojaras.forEach(ido => {
            calEvents.push({
                title  : 'Fok: ' + ido.idojarasAdatMin+'°C-'+ido.idojarasAdatMax+'°C',
                start  : ido.date
              });
        });
      }catch(err){
          console.log(err);
          showMessage('danger', 'Hiba', 'Hiba az adatok lekérdezése során!'); 
      }
}

function initCalendar2(){
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
     
        initialView: 'dayGridMonth',
        locale: 'hu',
        headerToolbar: {
            left: 'prev,today,next',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        },
        events: calEvents
    });
    calendar.render();
}