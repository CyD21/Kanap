//==========================================================================
//* Fonction de récupération des données de l'api
//==========================================================================
async function getDatas(){
  try {
    const res = await fetch("http://localhost:3000/api/products");
    const items = await res.json();
    return items;
  } catch {
    apiError()
  };
}

//==========================================================================
//* Fonction d'affichage des produits
//==========================================================================
function showItem(item) {
  document.querySelector("#items").innerHTML += `
      <a href="./product.html?id=${item._id}">
          <article>
              <img src="${item.imageUrl}" alt="${item.altTxt}">
              <h3 class="productName">${item.name}</h3>
              <p class="productDescription">${item.description}</p>
          </article>
      </a>`;
}

//==========================================================================
//* Fonction du rendu dynamique des produits
//==========================================================================
(async function renderProducts() {
    const items = await getDatas();
    items.forEach(item => {
        showItem(item)
    });
})();

//==========================================================================
//* Création de la fonction d'un message d'erreur
//==========================================================================
function apiError() {  
  document.querySelector("h1").innerHTML = 
  "<div>Toutes nos excuses une erreur c'est produite</div>";
  document.querySelector("h2").innerHTML = "Nous vous remercions pour votre visite<br />et nous vous invitons à revenir un peu plus tard";    
}
