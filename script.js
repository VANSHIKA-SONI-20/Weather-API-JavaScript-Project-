const cityinput=document.querySelector(".city-input")
const searchbtn=document.querySelector(".button-search")
const apikey="142b9013e2139b9000b5eb8f00c3c540"
const notfound=document.querySelector(".not-found")
const searchcity=document.querySelector(".search-city")
const weatherinfo=document.querySelector(".weather-info")
const countrytxt=document.querySelector(".country-txt")
const temptxt=document.querySelector(".temp-txt")
const conditiontxt=document.querySelector(".condition-txt")
const humidityvaluetxt=document.querySelector(".humidity-value-txt")
const windvaluetxt=document.querySelector(".wind-value-txt")
const weathersummaryimg=document.querySelector(".weather-summary-img")
const currentdatetxt=document.querySelector(".current-date-txt")
const forecastitemscontainer=document.querySelector(".forecast-items-container")

searchbtn.addEventListener("click",()=>{
    if(cityinput.value.trim() != ""){
        updateweatherinfo(cityinput.value)
        cityinput.value=""
        cityinput.blur()
    }
})
cityinput.addEventListener("keydown",(event)=>{
    if(event.key == "Enter" && cityinput.value.trim() !=""){
        updateweatherinfo(cityinput.value)
        cityinput.value=""
        cityinput.blur()

    }
})

async function getfetchdata(endpoint,city){ 
    const apiurl=`https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=142b9013e2139b9000b5eb8f00c3c540&units=metric`
    const response= await fetch(apiurl)
    return response.json()
}

function getweathericon(id){
    if(id>=200 && id<=232) return 'thunderstorm.svg'
    if(id>=300 && id<=321) return 'drizzle.svg'
    if(id>=500 && id<=531) return 'rain.svg'
    if(id>=600 && id<=622) return 'snow.svg'
    if(id>=701 && id<=781) return 'atmosphere.svg'
    if(id==800) return 'clear.svg'
    if(id>=801 && id<=804) return 'clouds.svg'
}
function getcurrentdate(){
    const currentdate= new Date()
    const options={
        weekday:'short',
        day:'2-digit',
        month:'short'
    }
    return currentdate.toLocaleDateString('en-GB',options)
}
async function updateweatherinfo(city){
    const weatherData = await getfetchdata('weather',city)
    if(weatherData.cod != 200){
        showDisplaySection(notfound)
        return
    }
    const {
        name : country,
        main : {temp,humidity},
        weather:[{id,main}],
        wind:{speed}
    }=weatherData
    countrytxt.textContent=country
    temptxt.textContent=Math.round(temp)+" °C"
    conditiontxt.textContent=main
    humidityvaluetxt.textContent=humidity
    windvaluetxt.textContent=speed+" M/s"
    currentdatetxt.textContent=getcurrentdate()
    weathersummaryimg.src=`assets/weather/${getweathericon(id)}`

    await updateForecastinfo(city)

    showDisplaySection(weatherinfo)
}

async function updateForecastinfo(city){
    const forecastsData= await getfetchdata('forecast',city)
    const timetaken='12:00:00'
    const todaydate = new Date().toISOString().split('T')[0]
    forecastitemscontainer.innerHTML=''
    forecastsData.list.forEach(forecastweather=>{
        if(forecastweather.dt_txt.includes(timetaken) && !forecastweather.dt_txt.includes(todaydate)){
            updateforecastitems(forecastweather)
        }
    })
    
}
function updateforecastitems(weatherdata){
    const{
        dt_txt:date,
        weather:[{id}],
        main:{temp}
    } =weatherdata
    const datetaken = new Date(date)
    const dateoption={
        day:'2-digit',
        month:'short',

    }
    const dateresult=datetaken.toLocaleDateString('en-Us',dateoption)

    const forecastitem=`
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateresult}</h5>
            <img src="assets/weather/${getweathericon(id)}" alt="" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>`
    
    forecastitemscontainer.insertAdjacentHTML('beforeend',forecastitem)
        
}

function showDisplaySection(section){
    [weatherinfo,searchcity,notfound].forEach(section => section.style.display = "none")
    section.style.display = "flex"
}