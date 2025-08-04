const decrement = document.getElementById("decrement")
const increment = document.getElementById("increment")
const display = document.getElementById("display")

decrement.addEventListener("click", function(){
    display.innerText = Number(display.innerText)-1
})

increment.addEventListener("click", function(){
    display.innerText = Number(display.innerText)+1
})