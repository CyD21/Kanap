//Récupération de la commande via l'url
let orderParams = new URLSearchParams(document.location.search);

/**
 * Affichage du résultat de la commande et
 * renvoie du client sur la page d'accueil aprés
 * 5 sec
 */
const displayOrderNumber = () => {
    orderId.textContent = orderParams.get("id");
    localStorage.clear();
    setTimeout(() => {document.location.href = "../html/index.html";}, 5000);
};
displayOrderNumber();