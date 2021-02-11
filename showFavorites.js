const $pics = [{type: "Education",
            url: "https://images.unsplash.com/photo-1604549944235-3e5579b15cc2?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85"},
            {type: "Recreational",
            url: "https://images.unsplash.com/photo-1506259653509-a66773d90d05?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85"},
            {type: "Social",
            url: "https://images.unsplash.com/photo-1566140967404-b8b3932483f5?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85"}, 
            {type: "Diy",
            url: "https://images.unsplash.com/photo-1605627079912-97c3810a11a4?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85"},
            {type: "Charity",
            url: "https://images.unsplash.com/photo-1605767576272-cb9b834aa4be?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85"},
            {type: "Cooking",
            url: "https://images.unsplash.com/photo-1608019527897-238a401a7b7c?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85"}, 
            {type: "Relaxation",
            url: "https://images.unsplash.com/photo-1611512364108-fa02a6d7dd93?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85"}, 
            {type: "Music",
            url: "https://images.unsplash.com/photo-1610981755415-3f7c9202cccb?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85"}, 
            {type: "Busywork",
            url: "https://images.unsplash.com/photo-1535057866921-a768e391e410?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85"}]
const activityTypes = ["Education", "Recreational", "Social", "Diy", "Charity", "Cooking", "Relaxation", "Music", "Busywork", "All"]
const $favoritesContainer = document.querySelector("#display-favorites")
const $backLink = document.querySelector("#back-link")
const $selectType = document.querySelector("#select-type")
const $selectButton = document.querySelector("#select-button")
const $logOutButton = document.querySelector("#log-out")
const backendURL = 'https://covid-boredom-buster-backend.herokuapp.com/'
const queryParams = new URLSearchParams(window.location.search)
const userId = queryParams.get('id')
let userName = null

let favoriteActivities = null

setActivityOptions()

fetch(`${backendURL}users/${userId}`)
    .then(response => response.json())
    .then(user =>{
        userName = user.user.name
        $backLink.href = `https://covid-boredom-buster.web.app?name=${userName}`
        favoriteActivities = user.favorites
        user.favorites.forEach(favorite=>{
            console.log(favorite)
            displayFavorite(favorite)
        })
        searchFilter()
    })

function displayFavorite(favorite){
    const name = document.createElement('h1')
    const access = document.createElement('h3')
    const price = document.createElement('h3')
    const part = document.createElement('h3')
    const div = document.createElement('div')
    const cardInfo = document.createElement('div')
    div.classList.add("Activity-card")
    div.id = favorite.id
    cardInfo.classList.add("card-info")

    name.textContent = favorite.activity.name
    access.textContent = `Accessibility level: ${favorite.activity.accessibility}`
    price.textContent = `Price: ${favorite.activity.price}`
    part.textContent = `Number of participants: ${favorite.activity.participants}`
    $delButton =  addDeleteButton(favorite, div)
    cardInfo.append(name, access, price, part)
    div.append(cardInfo, $delButton)
    $favoritesContainer.append(div)
    setCardImage(favorite)  
}

function addDeleteButton(favorite, div){
    const $delButton = document.createElement('button')
    $delButton.textContent = "Delete"
    $delButton.addEventListener('click', (event) => {
        div.remove()
        fetch(`${backendURL}favorites/${favorite.id}`, {
            method: 'DELETE'
        })
    })
    return $delButton
}

function setCardImage(favorite){
    const image = $pics.find(picObject => picObject.type === favorite.activity.activity_type)
    document.getElementById(favorite.id).style.backgroundImage = `url(${image.url})`
}

function filterFavorites(type){
    return favoriteActivities.filter((favorite) => favorite.activity.activity_type === type)
}

$selectButton.addEventListener('click', (event) => {
    const type = $selectType.value
    $favoritesContainer.innerHTML = ""
    if (type === "All"){
        favoriteActivities.forEach(favorite => displayFavorite(favorite))
    } else {
    filterFavorites(type).forEach(favorite => displayFavorite(favorite))
    }
})

function setActivityOptions(){
    activityTypes.forEach(activity => {
        const $activityOption = document.createElement('option')
        $activityOption.textContent = activity
        $selectType.appendChild($activityOption)
    })
}

function searchFilter(){
    let $input = document.querySelector("#search")
    let $filter = $input.value.toUpperCase()
    let $cardDivs = document.querySelectorAll(".Activity-card")
    $cardDivs.forEach(div => {
    let $h1 = div.querySelector('h1')
    let $title = $h1.textContent
        if ($title.toUpperCase().indexOf($filter) > -1){
            $h1.parentNode.parentNode.style.display = ""
        } else {
            $h1.parentNode.parentNode.style.display = "none"
        }
    })
}

$logOutButton.addEventListener('click', (event) => {
    window.location.replace("https://covid-boredom-buster.web.app")
})