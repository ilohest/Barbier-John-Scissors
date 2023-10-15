// Navigation : menu hamburger

const nav = document.querySelector('.main-nav');
const navToggler = document.querySelector('.nav-toggler');
const togglerImg = navToggler.querySelector('img');
const navLinks = document.querySelectorAll('.main-nav a')

navToggler.addEventListener("click", toggleNav);

function toggleNav(){
    nav.classList.toggle("active") /* méthodes classList.toggle retirent la classe active si elle est présente, et la rajoutent si elle est absente */
    if(togglerImg.src.includes("hamburger")){
        togglerImg.src = "ressources/cross.svg";
        navToggler.ariaExpanded = true; /* acessibilité */

        navLinks.forEach(link => { /* refermer le menu quandon clique sur un lien */
            link.addEventListener("click", () => {
            nav.classList.remove("active");
            navToggler.ariaExpanded = false;
        })})
    }
    else {
        togglerImg.src = "ressources/hamburger.svg";
        navToggler.ariaExpanded = false;
    }
}

// About section : slider 

const slideshowImages = document.querySelectorAll(".slideshow-images-container img");
const fadeSlideDots = document.querySelectorAll(".dot");

// Au clic & slideshow automatique : 

fadeSlideDots.forEach(dot => dot.addEventListener("click", fadeSlideshow))

let currentFadeIndex = 1;
let fadeIntervalID; /* **slideshow automatique** */

function fadeSlideshow(e){
    slideshowImages[currentFadeIndex - 1].classList.remove("active");
    fadeSlideDots[currentFadeIndex - 1].classList.remove("active");
    fadeSlideDots[currentFadeIndex - 1].ariaDisabled = "false";

    if(e) { /* s'il s'est produit un événement, alors... */
        currentFadeIndex = e.target.getAttribute("data-fadeIndex"); /* currentFI prend la valeur du data-fadeIndex du bouton sur lequel on a cliqué */
        clearInterval(fadeIntervalID) /* **slideshow automatique** on reset le slideshow qui tourne déjà (en dessous de la fonction)*/
        fadeIntervalID = window.setInterval(fadeSlideshow, 3500) /* **slideshow automatique** et on le relance */
      }
      else { /* **slideshow automatique** */
        currentFadeIndex++; 
        if(currentFadeIndex > slideshowImages.length) { /* on reset le compteur */
            currentFadeIndex = 1;
        }
      }
      /* on affiche l'image qu'on veut */
      slideshowImages[currentFadeIndex - 1].classList.add("active");
      fadeSlideDots[currentFadeIndex - 1].classList.add("active");
      fadeSlideDots[currentFadeIndex - 1].ariaDisabled = "true";
  
}

fadeIntervalID = window.setInterval(fadeSlideshow, 3500) /* **slideshow automatique** La fonction window.setInterval() exécute une fonction callback fadeSlideshow toutes les 3500ms et retourne un id fadeIntervalID qui correspond à cet intervalle */

// Au slide gauche/droite :

    slideshowImages.forEach(image => {
        let touchStartX = 0; /* pour suivre les coordonnées horizontales du point de départ et du point d'arrivée du glissement tactile */
        let touchEndX = 0;
    
        image.addEventListener('touchstart', handleTouchStart, false); /* handleTouchStart: nous enregistrons la position horizontale de départ du toucher initial de l'utilisateur */
        image.addEventListener('touchmove', handleTouchMove, false); /* handleTouchMove: nous mettons à jour la position horizontale de l'événement de mouvement tactile pour suivre les mouvements du doigt de l'utilisateur*/
        image.addEventListener('touchend', handleTouchEnd, false); /* handleTouchEnd: nous comparons les positions touchStartX et touchEndX pour déterminer la direction du glissement*/
    
        function handleTouchStart(e) {
            touchStartX = e.touches[0].clientX;
        }
    
        function handleTouchMove(e) {
            touchEndX = e.touches[0].clientX;
        }
    
        function handleTouchEnd() {
            if (touchEndX < touchStartX) {
                // glissement vers la droite, appeler la fonction pour afficher l'image suivante
                currentFadeIndex++;
                if (currentFadeIndex > slideshowImages.length) {
                    currentFadeIndex = 1;
                }
            } else if (touchEndX > touchStartX) {
                // glissement vers la gauche, appeler la fonction pour afficher l'image précédente
                currentFadeIndex--;
                if (currentFadeIndex < 1) {
                    currentFadeIndex = slideshowImages.length;
                }
            }
            fadeSlideshow(); // appel de la fonction pour mettre à jour l'affichage
            touchStartX = 0;
            touchEndX = 0;
        }
    });


// Smooth scroll links

const smoothScrollLinks = [ /* on met dans un tableau tous les liens */
    ...navLinks,
    ...document.querySelectorAll('.hero a')
]
//console.log(smoothScrollLinks);

smoothScrollLinks.forEach(link => link.addEventListener('click', handleSmoothScroll)); /* pour chaque lien dans le tableau smoothSL, on exécute la fonction callback qui exécute un event listener qui au click appelle la fonction handleSS */

function handleSmoothScroll(e) {
    e.preventDefault(); /* on empeche le comportement par défaut du click sur un lien qui est d'amener à un certain endroit et d'écrire dans l'url */

    const linkHref = e.target.getAttribute("href").substring(1); /* récup l'ID qui correspond à l'href du lien sur lequel je clique - substring(1) permet de prendre à partir du caractère en position 1 comme ça on ne prend pas l'#*/
    //console.log(linkHref);
    //console.log(e.target.href);

    /* smooth scroll */

    window.scrollTo({ /* méthode qui attend un objet avec 2 propriétés (top & behaviour) */
        top: document.getElementById(linkHref).offsetTop * 0.95, /* là où on a envie d'aller par rapport au haut de la fenêtre  - offsetTop : distance depuis le haut de la fenêtre */
        behavior: 'smooth'
    })
    //console.log(document.getElementById(linkHref).offsetTop * 0.95); /* représente la distance entre le haut où on veut aller de la section et le haut du site */

    /* ajout d'ID dans le lien */

    window.history.pushState("", "", `${document.location.pathname}#${linkHref}`) /* comportement par défaut du lien a été empêché et le nom de la section où on clique ne s'affiche plus dans l'url :
    la méthode window.history.pushState joue sur l'API history du navigateur : 1er argument: pour envoyer du state sur la page, 2ième argument: changer le title de la page, 3ième argument: là où on veut aller */
    //console.log(document.location.pathname);
}
