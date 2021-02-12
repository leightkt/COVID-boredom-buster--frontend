const backendURL = 'https://covid-boredom-buster-backend.herokuapp.com/'
const activityTypes = ["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"]
const $activitySelect = document.querySelector("#activity-type")
const $activityDisplay = document.querySelector("#display-activity")
const $signInForm = document.querySelector("#sign-in-form")
const $postForm = document.querySelector("#post-form")
const $activitySelectForm = document.querySelector("#activity-select-form")
const $activityButton = document.querySelector("#get-button")
const $logOutButton = document.querySelector("#log-out")
const $loading = document.querySelector(".loading")
const queryParams = new URLSearchParams(window.location.search)
const userName = queryParams.get('name')
let userID = null

fetch(`${backendURL}/loading`)
    .then(response => response.json())
    .then(result => {
        $loading.remove()
    })

function setActivityOptions(){
    activityTypes.forEach(activity => {
        const $activityOption = document.createElement('option')
        $activityOption.textContent = activity
        $activitySelect.appendChild($activityOption)
    })
}

if (userName){
    fetch(`${backendURL}userLogin?name=${userName}`)
        .then(response => response.json())
        .then(user => {
            welcomeUser(user)
            userID = user.id
    })
}

function displayActivity(activityObject){
    $activityName = document.querySelector('#activity-name')
    $activityType = document.querySelector('#act-type')
    $activityParticipants = document.querySelector('#participants')
    $activityPrice = document.querySelector('#price')
    $activityAccessibility = document.querySelector('#accessibility')

    $activityName.textContent = `Activity: ${activityObject.activity}`
    $activityType.textContent = `Type: ${capFirstLetter(activityObject.type)}`
    $activityParticipants.textContent = `Number of Participants: ${activityObject.participants}`
    $activityPrice.textContent = `Price: ${setPrice(activityObject)}`
    $activityAccessibility.textContent = `Accessbility Rating: ${setAccessibility(activityObject)}`

    $postForm.classList.remove('hidden')

    $postForm.addEventListener('submit', (event) => {
        event.preventDefault()

        const activity = activityObject.activity
        console.log(activity)
        const accessibility = activityObject.accessibility
        const participants = activityObject.participants
        const price = activityObject.price
        const key = activityObject.key
        const type = activityObject.type

        fetch(`${backendURL}activities`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userID: userID,
                activity: activity,
                accessibility: accessibility,
                participants: participants,
                price: price,
                key: key,
                type: type
            })
        })
        .then(window.location.replace(`https://covid-boredom-buster.web.app/showFavorites.html?id=${userID}`))
    })
}

function welcomeUser(user){
    $signInForm.classList.add('hidden')
    $userName = document.querySelector('#user-name')
    $userName.textContent = `Welcome ${user.name}!`
    $logOutButton.classList.remove("hidden")
    $activitySelectForm.classList.remove("hidden")
}

$activityButton.addEventListener('click', (event) => {
    activityType = $activitySelect.value
    fetch(`${backendURL}getActivity?type=${activityType}`)
        .then(response => response.json())
        .then(activityObject => {
            displayActivity(activityObject)
        })
})

setActivityOptions()

$logOutButton.addEventListener('click', (event) => {
    window.location.replace("https://covid-boredom-buster.web.app")
})

function setPrice(activity){
    if (activity.price == 0){
        return "Free"
    } else if (activity.price > 0.0 && activity.price < 0.3){
        return "Cheap"
    } else if (activity.price > 0.3 && activity.price < 0.6) {
        return "Moderate"
    } else {
        return "Expensive"
    }
}

function setAccessibility(activity){
    if (activity.accessibility == 0){
        return "Accessible to Most"
    } else if (0.0 < activity.accessibility < 0.6){
        return "Somewhat Accessible"
    } else {
        return "Limited Accessibility"
    }
}
function capFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1)
}