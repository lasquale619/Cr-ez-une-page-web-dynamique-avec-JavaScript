/*************************************************************
 * 1. Écoute du chargement complet du DOM
 *************************************************************/

document.addEventListener("DOMContentLoaded", ()=>{
    // on selctionne le formulair
    let form=document.querySelector(".login-form");
    // on ecoute le click de connexion
    form.addEventListener("submit", (e)=>{
        // on evite le rechargement de la page
        e.preventDefault();
        // on recupere l'email et le MDP
        let email = document.querySelector("#email").value;
        let password = document.querySelector("#password").value;
        
          /*********************************************************
         * 2. Envoi des identifiants à l'API via une requête POST
         *********************************************************/
        
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",  // POST pour envoie des données 
            headers: {
                "Content-Type": "application/json" // on demande le header en json
            },
            body: JSON.stringify({ email, password }) // on demande les donneés  on json
        })
        .then(response => {
            if (response.ok){
                return response.json() // on converti la reponse en json
            }else {
                document.querySelector(".erreurMSG").style.display = "block"; // si la reponse est KO on affiche ce message
            }           
            
        })               
        .then(data => { 
            localStorage.setItem("authToken", data.token); // on le stock ici 
            window.location.href = "index.html"; // et on ce redirige vers index.html
        })
        .catch(error => console.log(error) );
    })
})


/*************************************************************
 * 3. Déconnexion automatique si déjà connecté
 *************************************************************/

 if (localStorage.getItem("authToken")) {
        localStorage.removeItem("authToken");
 }
