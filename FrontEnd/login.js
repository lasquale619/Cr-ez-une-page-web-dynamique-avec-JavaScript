/*************************************************************
 * 1. Écoute du chargement complet du DOM
 *************************************************************/

document.addEventListener("DOMContentLoaded", () => {
    // Sélection du formulaire de connexion
    let form = document.querySelector(".login-form");
    // Écoute de l’événement "submit" du formulaire
    form.addEventListener("submit", (e) => {
        // on evite le rechargement de la page
        e.preventDefault(); // Empêche le rechargement de la page

        // Récupération des données saisies par l'utilisateur
        let email = document.querySelector("#email").value;
        let password = document.querySelector("#password").value;

        /*********************************************************
       * 2. Envoi des identifiants à l'API via une requête POST
       *********************************************************/

        fetch("http://localhost:5678/api/users/login", {
            method: "POST",  // POST pour envoie des données 
            headers: {
                "Content-Type": "application/json" // Spécifie le type de contenu
            },
            body: JSON.stringify({ email, password }) // Données envoyées au serveur
        })

            // Analyse de la réponse
            .then(response => {
                if (response.ok) {
                    return response.json() // Conversion de la réponse en JSON
                } else {
                    // Affichage d'un message d'erreur en cas d’échec
                    document.querySelector(".erreurMSG").style.display = "block"; // si la reponse est KO on affiche ce message
                }

            })

            // Traitement des données de réponse (si connexion réussie)        
            .then(data => {
                localStorage.setItem("authToken", data.token); // Stockage du token dans le localStorage 
                window.location.href = "index.html"; // Redirection vers la page d’accueil
            })
            // Gestion des erreurs réseau ou autres
            .catch(error => console.log(error));
    })
})


/*************************************************************
 * 3. Déconnexion automatique si déjà connecté
 *************************************************************/

if (localStorage.getItem("authToken")) {
    localStorage.removeItem("authToken");
}
