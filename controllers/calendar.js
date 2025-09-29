let NaptarDate = []
let NaptarDataMin = [];
let NaptarDataMax = [];

async function getCalendarData(){
try{
	let res = await fetch(`${ServerURL}/idojaras/users/${loggedUser.id}`);
	
	idojarasok = await res.json();
	idojarasok = idojarasok.sort((a,b) => new Date(a.date) - new Date(b.date));
	
	idojarasok.forEach(idojaras => {
	NaptarDate.push(idojaras.date);
	NaptarDataMin.push(idojaras.idojarasAdatMin);
	NaptarDataMax.push(idojaras.idojarasAdatMax);
	});
  }catch(err){
	  console.log(err);
	  showMessage('danger', 'Hiba', 'Hiba az adatok lekérdezése során!'); 
  }

  console.log(NaptarDataMax[0])

}

getCalendarData()

async function getCalendar() {


var chart = new CanvasJS.Chart("chartContainer", {            
	title:{
		text: "Időjárás adatok"              
	},
	axisY: {
		suffix: " °C",
		maximum: 50,
		gridThickness: 0
	},
	toolTip:{
		shared: true,
		content: "{name} </br> <strong>Fok: </strong> </br> Min: {y[0]} °C, Max: {y[1]} °C"
	},
	data: [{
		type: "rangeSplineArea",
		fillOpacity: 0.3,
		color: "#91AAB0",
		indexLabelFormatter: formatter,
		dataPoints: [
			{ label: NaptarDate[0], y: [Number(NaptarDataMin[0]),Number(NaptarDataMax[0])], name: "rainy" },
			{ label: NaptarDate[1], y: [Number(NaptarDataMin[1]),Number(NaptarDataMax[1])], name: "sunny" },
			{ label: NaptarDate[2], y: [Number(NaptarDataMin[2]),Number(NaptarDataMax[2])], name: "rainy" },
			{ label: NaptarDate[3], y: [Number(NaptarDataMin[3]),Number(NaptarDataMax[3])], name: "rainy" },
			{ label: NaptarDate[4], y: [Number(NaptarDataMin[4]),Number(NaptarDataMax[4])], name: "rainy" },
			{ label: NaptarDate[5], y: [Number(NaptarDataMin[5]),Number(NaptarDataMax[5])], name: "rainy" },
			{ label: NaptarDate[6], y: [Number(NaptarDataMin[6]),Number(NaptarDataMax[6])], name: "rainy" }
		]
	}]
});
chart.render();

var images = [];    

addImages(chart);

function addImages(chart) {
	for(var i = 0; i < chart.data[0].dataPoints.length; i++){
		var dpsName = chart.data[0].dataPoints[i].name;
		if(dpsName == "cloudy"){
			images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/cloudy.png"));
		} else if(dpsName == "rainy"){
		images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/rainy.png"));
		} else if(dpsName == "sunny"){
			images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/sunny.png"));
		}

	images[i].attr("class", dpsName).appendTo($("#chartContainer>.canvasjs-chart-container"));
	positionImage(images[i], i);
	}
}

function positionImage(image, index) {
	var imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[index].x);
	var imageTop =  chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);

	image.width("40px")
	.css({ "left": imageCenter - 20 + "px",
	"position": "absolute","top":imageTop + "px",
	"position": "absolute"});
}

$( window ).resize(function() {
	var cloudyCounter = 0, rainyCounter = 0, sunnyCounter = 0;    
	var imageCenter = 0;
	for(var i=0;i<chart.data[0].dataPoints.length;i++) {
		imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
		if(chart.data[0].dataPoints[i].name == "cloudy") {					
			$(".cloudy").eq(cloudyCounter++).css({ "left": imageCenter});
		} else if(chart.data[0].dataPoints[i].name == "rainy") {
			$(".rainy").eq(rainyCounter++).css({ "left": imageCenter});  
		} else if(chart.data[0].dataPoints[i].name == "sunny") {
			$(".sunny").eq(sunnyCounter++).css({ "left": imageCenter});  
		}                
	}
});

function formatter(e) { 
	if(e.index === 0 && e.dataPoint.x === 0) {
		return " Min " + e.dataPoint.y[e.index] + "°"
	} else if(e.index == 1 && e.dataPoint.x === 0) {
		return " Max " + e.dataPoint.y[e.index] + "°";
	} else{
		return e.dataPoint.y[e.index] + "°";
	}
} 

}
