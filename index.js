
const openInputBtn = document.getElementById("input-icon")
const addTodoBtn = document.getElementById("add-todo")
const input = document.getElementById("input-todo")

input.value = ""
let myGoals = []
let localStorageGetList = JSON.parse( localStorage.getItem("myGoals"))

let lastApiFetchDate = ""


// TODO LIST

// checking if there are goals in local storage
if (localStorageGetList) {
    myGoals = localStorageGetList
    renderGoals(myGoals)
}

// opening input area by clicking on the icon
openInputBtn.addEventListener("click", function(){
    document.getElementById("input-icon").classList.toggle("small-input-icon")
    document.getElementById("input-icon").classList.toggle("big-input-icon")
    document.getElementById("input-container").classList.toggle("not-displayed")
})

// the function for adding goal to todo list
function addInput() {
    if(input.value){
        const goal = document.createElement("p")
        goal.id = Date.now()
        goal.innerHTML = input.value
        input.value = ""
        myGoals.push(`<p id="${goal.id}" class="goals">&#x2022; ${goal.innerHTML}</p>`)
        localStorage.setItem("myGoals", JSON.stringify(myGoals))
        renderGoals(myGoals)
    }
}
// adding by clicking the button
addTodoBtn.addEventListener("click", addInput)
// adding by enter
input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addInput()
    }
})

// rendering todo list
function renderGoals(goals){
    document.getElementById("todos-container").innerHTML = goals.join("")
}

// checked and unchecked goal 
document.addEventListener("click", function(e){
    if(e.target.parentElement.id==="todos-container"){
    document.getElementById(e.target.id).classList.toggle("checked")
    }
})

// deleting a goal 
document.addEventListener("dblclick", function(e){
    if(e.target.parentElement.id==="todos-container"){
        for(let i=0; i<myGoals.length; i++){
            const goalID = myGoals[i].slice(7, 20)
            if (e.target.id === goalID){
                myGoals.splice (i, 1)
            }
        }
    localStorage.setItem("myGoals", JSON.stringify(myGoals))
    renderGoals(myGoals)
    }
})

// info button showing info
document.getElementById("info-btn").addEventListener("click", function(){
    document.getElementById("info-text").classList.toggle("not-displayed")
})




// GETTING A BACKGROUND IMAGE
if (localStorage.getItem("lastApiFetchDate") === new Date().getDate().toString()) {
    document.body.style.backgroundImage = `url(${localStorage.getItem("myBackgroundImg")})`
}
else {
    fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=motivation")
        .then(res => res.json())
        .then(data => {
            document.body.style.backgroundImage = `url(${data.urls.regular})`
            localStorage.setItem("myBackgroundImg", JSON.stringify(data.urls.regular))
            lastApiFetchDate = new Date().getDate()
            localStorage.setItem("lastApiFetchDate", JSON.stringify(lastApiFetchDate))
        })
        .catch(err => {
            document.body.style.backgroundImage = `
            url(https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzU4MDA5MTY&ixlib=rb-4.0.3&q=80&w=1080
    )`
        })
}



// GETTING A QUOTE
fetch("https://api.goprogram.ai/inspiration")
    .then(res => res.json())
    .then(data => {
        document.getElementById("quote").innerHTML = `
        <p>${data.author}: "${data.quote}"</p>
    `
    })
    .catch(err => console.error(err))



// GETTING A TIME
function getCurrentTime() {
    const date = new Date()
    document.getElementById("time").textContent = date.toLocaleTimeString("en-gb", {timeStyle: "short"})
}

setInterval(getCurrentTime, 1000)



// GETTING A PLACE AND A WEATHER 
navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
        .then(res => {
            if (!res.ok) {
                throw Error("Weather data not available")
            }
            return res.json()
        })
        .then(data => {
            console.log(data)
            const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            document.getElementById("weather").innerHTML = `
                <div class="temp-cont">
                    <img src=${iconUrl} class="weather-icon"/>
                    <p class="weather-temp">${Math.round(data.main.temp)}ºC</p>
                </div>
                <div class="wind-cont">
                    <img src="images/wind-icon.png" class="wind-icon"/>
                    <p class="weather-wind">${Math.round(data.wind.speed)}m/s</p>
                </div>
                <p class="weather-city">${data.name}</p>
                `
            })
            .catch(err => console.error(err))
});



