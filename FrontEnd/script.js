// récupérer les projets

fetch("http://localhost:5678/api/works")
    .then(reponse => reponse.json())
    .then(data => {
        let figures = ""
        for (let figure of data) {

            // ajout à la galerie les travaux de l’architecte

            figures += `
            <figure>
				<img src="${figure.imageUrl}" alt="${figure.title}">
				<figcaption>${figure.title}</figcaption>
			</figure>
            `
        }
        
        document.querySelector(".gallery").innerHTML = figures
    })
    .catch(erreur => console.log(erreur))

// récupérer les Categories 

fetch("http://localhost:5678/api/categories")
    .then(reponse => reponse.json())
    .then(data => {

        // ajout des boutons categories depuis l'API

        let categories = ""
        for (let cat of data) {
            categories += `<button id="${cat.id}">${cat.name}</button>`
        }
        
        document.querySelector(".filtres").insertAdjacentHTML("beforeend", categories);
    })

// Construction de l'html
function displayworks(works) {
    let figures = ""
    for (let figure of works) {
        figures += `
        <figure>
			<img src="${figure.imageUrl}" alt="${figure.title}">
			<figcaption>${figure.title}</figcaption>
		</figure>
        `
    }
    document.querySelector(".gallery").innerHTML = figures
}

// je stock les travaux pour les réutilisé 
let works = [];
fetch("http://localhost:5678/api/works")
    .then(reponse => reponse.json())
    .then(data => {
        works = data; // stockage des donneés 
        displayworks(works); // on appelle la fonction pour affiché tout les travaux 
    })
    .catch(erreur => console.log(erreur));

// Activation des boutons 

document.querySelector(".filtres").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        let categoryId = parseInt(e.target.id);
        document.querySelectorAll(".filtres button").forEach(btn => {
            btn.classList.remove("active")
        })
        e.target.classList.add("active");

        // Filtrage des boutons

        if (categoryId === 0) {
            displayworks(works);
        }
        else {
            let Fworks = works.filter(work => work.categoryId === categoryId);
            displayworks(Fworks);
        }

    }
})

/*************************************************************  */
/*************************************************************  */

// Modification apres login

// On attend que le DOM soit complètement chargé avant d'exécuter le code
document.addEventListener("DOMContentLoaded", () => {

    // On récupère le token depuis le localStorage du navigateur
    let token = localStorage.getItem("authToken");

    // On sélectionne la barre d'édition, la modale et les filtres 
    let editbar = document.querySelector(".editbar");
    let edittitreIcon = document.querySelector(".edittitre a");
    let SupFiltres = document.querySelector(".filtres");
    let LogLink = document.querySelector('nav ul li a[href="login.html"]');    

    // Si le token existe => connexion admine
    if (token) {
        // on affiche la barre, la modale et on masque les filtres 
        editbar.style.display = "flex";        
        edittitreIcon.style.display = "inline-block";        
        SupFiltres.style.display = "none";
        LogLink.textContent ="Logout";
    } else {
        // sinon la barre et la modale on ne les affiche pas et on affiche les filtres 
        editbar.style.display = "none";
        edittitreIcon.style.display = "none";
        SupFiltres.style.display = "flex"
    }
});

let btnFermer = document.querySelector(".fa-xmark")
let modal = document.querySelector(".modale1");
let edittitreIcon = document.querySelector(".edittitre a");

edittitreIcon.addEventListener("click", () =>{
    // au clique on affiche la modal 
    modal.style.display = "flex";
    
    // on recupere les photos qui sont dans la page d'accueil
    let ModalPhotos = "";
    for(let work of works){
        ModalPhotos +=`
        <div class="photo_block" data-id="${work.id}">
			<img src="${work.imageUrl}" alt="${work.title}">
			<i class="fa-solid fa-trash-can"></i>
		</div>`
    }

    // et on creer l'HTML et on l'affiche selon le style de la classe photos
    document.querySelector(".Photos").innerHTML= ModalPhotos;
})

// au clique sur la croix 
btnFermer.addEventListener("click", () =>{
    // on masque la modal 
    modal.style.display = "none";
})

// on declare les elements dont on a besoin
let AjModal = document.querySelector(".modal_Ajphotos")
let Flesh = document.querySelector(".fa-arrow-left");
let Titre1 = document.querySelector(".Titre1");
let Aphotos = document.querySelector(".Photos");
let BtnV = document.querySelector(".submit-btn");
let BtnAjPhoto = document.querySelector(".btn_photo");
// au clique ajouter photo on masque et on affiche certains elements
BtnAjPhoto.addEventListener("click", () => {
    Aphotos.style.display = "none"
    AjModal.style.display = "block"
    Flesh.style.visibility = "visible"
    Titre1.style.display = "none"
    BtnV.style.display = "block"
    BtnAjPhoto.style.display = "none"
})

// récupèrer la liste des catégories à partir de l'API
fetch("http://localhost:5678/api/categories")
// // Lorsque la réponse est reçue, elle est transformée en JSON
.then(reponse => reponse.json())
.then(data => {
   // On ajoute une <option> avec la valeur de l'id et le texte du nom
    let Ca = "";
    for(let cat of data) {
        Ca += `<option value="${cat.id}">${cat.name}</option>`;
    }
    // // et on insère toutes les balises <option> générées à la fin de son contenu
    document.querySelector(".Cats").insertAdjacentHTML("beforeend",Ca);
})

let Sb = document.querySelector(".submit-btn");
let input = document.querySelector("#photo");
let ajBox = document.querySelector(".Aj-box");
let lab = document.querySelector(".Aj-box label");
let ic = document.querySelector(".fa-image");
let para = document.querySelector(".Aj-box p");

input.addEventListener("change", ({ target }) => {
  let file = target.files?.[0];
  let img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.style.position = "absolute";
  img.style.width = "129px";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  img.style.display = "block";
  img.style.margin = "0 auto";
  img.style.top = "0"
  img.style.left = "39%"
  lab.style.display ="none"
  ic.style.display = "none"
  para.style.display = "none"
  ajBox.style.padding = "0px"  

  // a l'ajout de la photo le bouton valider deviens vert 
  Sb.style.backgroundColor = "#1D6154"

  ajBox.appendChild(img);


});

// on gère la flèche pour revenir en arrière
let Rt = document.querySelector(".fa-arrow-left").addEventListener("click", () =>{
    Aphotos.style.display = "grid"
    AjModal.style.display = "none"
    Flesh.style.visibility = "hidden"
    Titre1.style.display = "block"
    BtnV.style.display = "none"
    BtnAjPhoto.style.display = "block"
} )
    

// fonction pour reset la modal apres l'ajout d'une photo 
function resetModalForm() {
  document.querySelector("#photo").value = "";
  document.querySelector('input[type="text"]').value = "";
  document.querySelector(".Cats").selectedIndex = 0;

  let imgPreview = document.querySelector(".Aj-box img");
  if (imgPreview) imgPreview.remove();

  document.querySelector(".Aj-box label").style.display = "inline-block";
  document.querySelector(".fa-image").style.display = "inline-block";
  document.querySelector(".Aj-box p").style.display = "block";
  document.querySelector(".Aj-box").style.padding = "20px";

  document.querySelector(".submit-btn").style.backgroundColor = "#A7A7A7";
}

// fonction pour mettre a jour la modal photo
function displayModalWorks(works) {
  let modalPhotos = "";
  for (let work of works) {
    modalPhotos += `
      <div class="photo_block" data-id="${work.id}">
        <img src="${work.imageUrl}" alt="${work.title}">
        <i class="fa-solid fa-trash-can"></i>
      </div>
    `;
  }
  document.querySelector(".Photos").innerHTML = modalPhotos;
}



document.querySelector(".submit-btn").addEventListener("click", (e) => {
    e.preventDefault();
  let fiche = document.querySelector("#photo").files[0];
  let catego = document.querySelector(".Cats").value;
  let title = document.querySelector('input[type="text"]').value;

  // champs obligatoire image, tittre et categories  
   if (!fiche) {
    alert("Veuillez sélectionner une image.");
    return false;
  }
  if (!title.trim()) {
    alert("Veuillez entrer un titre.");
    return false;
  }
  if (!catego) {
    alert("Veuillez sélectionner une catégorie.");
    return false;
  }



  let formData = new FormData();
  formData.append("image", fiche);
  formData.append("title", title);
  formData.append("category", catego);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {Authorization: `Bearer ${localStorage.getItem("authToken")}`},
    body: formData
  })
  .then(res => res.json())
  .then(newWork => {
    works.push(newWork);
    displayworks(works);
    displayModalWorks(works)
    resetModalForm();
// on revient a la page des photos 
Aphotos.style.display = "grid";
AjModal.style.display = "none";
Flesh.style.visibility = "hidden";
Titre1.style.display = "block";
BtnV.style.display = "none";
BtnAjPhoto.style.display = "block";


  
  })
  .catch(erreur => console.log(erreur))

});



document.querySelector(".Photos").addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash-can")) {
    let photoBlock = e.target.parentElement;
    let workId = parseInt(photoBlock.getAttribute("data-id"));

    fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then(response => {
      if (response.ok) {
        // Met à jour la liste des travaux
        works = works.filter(work => work.id !== workId);

        // Met à jour la galerie principale
        displayworks(works);

        // Supprime uniquement l'élément cliqué dans la modale 
        photoBlock.remove();
      } else {
        console.error("Erreur lors de la suppression");
      }
    })
    
  }
});











