//==========================================================================
//* Fonction de récupération des paramètres renvoyés par l'url
//==========================================================================
function getProducts() {
  const url = new URL(window.location.href)
  let id =  url.searchParams.get("id")
  return id
}

//==========================================================================
//* Fonction de récupération de la Base de données
//==========================================================================
async function getDatas(){
  let productId = getProducts();
  try {
    const res = await fetch(`http://localhost:3000/api/products/${productId}`);
    const items = await res.json();
    return items;
  } catch (error) {
    apiError()
  };
}

//==========================================================================
//* Fonction d'affichage du produit
//==========================================================================
(async function showProduit() {
  let produitData = await getDatas();
  document.getElementsByClassName("item__img")[0].innerHTML = `<img src="${produitData.imageUrl}" alt="${produitData.altTxt}">`;
  document.getElementById("title").innerText = produitData.name;
  document.getElementById("price").innerText = produitData.price;
  document.getElementById("description").innerText = produitData.description;
  let select = document.getElementById("colors");
  produitData.colors.forEach((colors) => {
    let tagOption = document.createElement("option");
    tagOption.innerHTML = `${colors}`;
    tagOption.value = `${colors}`;
    select.appendChild(tagOption);
  });
})();

//==========================================================================
//* Fonction de la gestion des options produits
//==========================================================================
(function addProduit(){
  const sendButton = document.querySelector("#addToCart");
  sendButton.addEventListener("click", () => {
      const productId = getProducts();
      const productColor = document.querySelector("#colors").value;
      const productQuantity = document.querySelector("#quantity").value;
      let productDetails = {
          id: productId,
          color: productColor,
          quantity: productQuantity
      };
      let storageStatus = JSON.parse(localStorage.getItem("product"));
      const storagePush = () => {
          if (productColor === "") {
              alert("Veuillez sélectionner une couleur");
          } else if (productQuantity < 1 || productQuantity > 100) {
              alert("Veuillez choisir entre 1 et 100 articles");
          } else {
              storageStatus.push(productDetails);
              localStorage.setItem("product", JSON.stringify(storageStatus));
              alert("Votre sélection à été ajoutée au panier");
          }
      };
      if (storageStatus) {
          storageStatus.forEach((product, index) => {
              if (productDetails.id === product.id && productDetails.color === product.color) {
                  productDetails.quantity = parseInt(productDetails.quantity) + parseInt(product.quantity);
                  storageStatus.splice(index, 1);
              }
          });
          storagePush();
      } else {
          storageStatus = [];
          storagePush();
      };
  });
})();

//==========================================================================
//* Création de la fonction d'un message d'erreur
//==========================================================================
function apiError() {  
  document.querySelector(".item").innerHTML = "<div>Toutes nos excuses une erreur c'est produite</div>";
  setTimeout(() => {document.location.href = "../html/index.html";}, 5000);
}