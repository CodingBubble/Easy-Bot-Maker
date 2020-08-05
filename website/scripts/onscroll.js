
/*
function onscroll(){ // pc Version
  var navbar = document.querySelector('.navButton');
  console.log(navbar);
  var navbarPosition = navbar.getBoundingClientRect().top;
  console.log(navbar.getBoundingClientRect().top)
  switch (navbarPosition < 5) {
    case true:
    document.getElementById("topNavbar").style.position = "fixed";
    document.getElementById("topNavbar").style.top = 0;
    document.getElementById("topNavbar").style.marginTop = 0;
    console.log('changed')
      break;
    default:
      document.getElementById("topNavbar").style.position = "relative";
      document.getElementById("topNavbar").style.marginTop = 40 + "vh";

  }

  window.addEventListener('scroll', onscroll)
}


onscroll();
*/

const header = document.querySelector("header");
const section = document.getElementsByClassName("navButton");
console.log(section);
const headerPosition = header.getBoundingClientRect().top;

const sectionOptions = {
  rootMargin: "470px 0px 0px 0px"
};

const sectionObserver = new IntersectionObserver(function(
  entries, sectionObserver
){
  entries.forEach((entry) => {
    if(!entry.isIntersecting){
      header.classList.add("nav-scrolled")
    }else{
      header.classList.remove("nav-scrolled")
    }
  })
},
sectionOptions);

sectionObserver.observe(section);
 

// css noch das ZEUG 
// und anpassen https://www.youtube.com/watch?v=RxnV9Xcw914 