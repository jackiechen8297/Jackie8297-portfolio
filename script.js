//hamburger menu bar//
function toggleMenu() {

    let menu = document.getElementById('menu');
    menu.classList.toggle('show');
  }

 axios.get('https://dummyjson.com/recipes')
 .then(function (response){
    console.log(response)
 })
.catch(function (error){
    console.log(error)
  })
.finally(function(){
    console.log("Get request done")
})


     


