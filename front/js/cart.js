//=========================================================
//* Récupération du localStorage
//=========================================================
function getProduits() {
  return JSON.parse(localStorage.getItem("product"));
}
//=========================================================
//* Fonction de vérification du contenu panier
//=========================================================
function verifPanier() {
  const bdStatut = getProduits();
  if (bdStatut === null || bdStatut.length === 0) {
    document.querySelector("#cart__items").innerHTML = `
        <article class="cart__item">
        <h2>Aucun produit</h2>
        <p>Veuillez retournez sur la page d'accueil<br />Afin de sélectionnez un produit</p>
        </article>`;
    document.querySelector("h1").innerHTML = "Votre panier est vide";
    document.querySelector(".cart__order__form").hidden = true;
    document.querySelector("#totalQuantity").innerHTML = 0;
    document.querySelector("#totalPrice").innerHTML = 0;
    return false;
  } else {
    return true;
  }
}

//=========================================================
//* Affichage des articles contenus dans le panier
//=========================================================
async function displayCard() {
  const bdStatut = getProduits();
  let totalPrice = 0;
  let totalQty = 0;
  let cartContent = "";
  for (product of bdStatut) {
    await fetch(`http://localhost:3000/api/products/${product.id}`)
      .then((res) => res.json())
      .then((item) => {
        totalPrice += parseInt(item.price) * parseInt(product.quantity);
        totalQty += parseInt(product.quantity);
        cartContent += `
                <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                <div class="cart__item__img">
                  <img src="${item.imageUrl}" alt="${item.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${item.name}</h2>
                            <p>${product.color}</p>
                            <p>${item.price * product.quantity} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
      })
      .catch((e) => apiError());
  }
  document.querySelector("#cart__items").innerHTML = cartContent;
  document.querySelector("#totalQuantity").innerHTML = totalQty;
  document.querySelector("#totalPrice").innerHTML = totalPrice;
}

//=========================================================
//* Actualisation du panier sans reload
//=========================================================
async function loadPage() {
  if (verifPanier()) {
    await displayCard();
    productQuantity();
    productRemoval();
  }
}
loadPage();

//==========================================================
//* Fonction de modification des quantités par l'utilisateur
//==========================================================

function productQuantity() {
  const bdStatus = getProduits();
  const quantitySelectors = document.querySelectorAll(".itemQuantity");
  quantitySelectors.forEach((quantityInput) => {
    quantityInput.addEventListener("change", (event) => {
      if (event.target.value < 1 || event.target.value > 100) {
        alert("Veuillez choisir entre 1 et 100 articles");
      } else {
        const newQty = event.target.value;
        const productId = event.target.closest("article").dataset.id;
        const productColor = event.target.closest("article").dataset.color;
        const productCartPosition = bdStatus.findIndex(
          (item) => item.id === productId && item.color === productColor
        );
        bdStatus[productCartPosition].quantity = newQty;
        localStorage.setItem("product", JSON.stringify(bdStatus));
        loadPage();
      }
    });
  });
}

//=========================================================
//* Fonction de suppression des produits par l'utilisateur
//=========================================================
function productRemoval() {
  const bdStatus = getProduits();
  const removeButtons = document.querySelectorAll(".deleteItem");
  removeButtons.forEach((removeButton) => {
    removeButton.addEventListener("click", (event) => {
      const productId = event.target.closest("article").dataset.id;
      const productColor = event.target.closest("article").dataset.color;
      const newCart = bdStatus.filter(
        (item) => !(item.id == productId && item.color === productColor)
      );
      let confirmation = confirm(
        "Etes vous sur de vouloir supprimer cet article ?"
      );
      if (confirmation === true) {
        localStorage.setItem("product", JSON.stringify(newCart));
        alert("Ce produit a bien été supprimer du panier");
        // verifier taille du tableau newcart !=0
        if (newCart === null || newCart.lenght === 0) {
          localStorage.clear();
        }
        loadPage();
      }
    });
  });
}

//=========================================================
//* FORMULAIRE
//=========================================================
/**
 * Ici pour chaques champs du formulaire on verifie les
 * expressions réguliéres définies si il y a une erreur
 * on renvoie un message d'erreur sous le champ concerné
 */
//=========================================================
//* Fonction de vérification des champs du formulaire
//=========================================================
function formValidation() {

// création des expressions régulières
const regexName =/^[a-zA-Z-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+$/;
const regexCity =/^[a-zA-Z-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s]+$/;
const regexAddress =/^[a-zA-Z0-9-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s]+$/;
const regexEmail = /([\w\.]+@[\w\.]+\.{1}[\w]+)/;

  const firstNameCheck = () => {
    const firstName = document.querySelector("#firstName");
    const errorMsg = document.querySelector("#firstNameErrorMsg");
    if (regexName.test(firstName.value)) {
      errorMsg.innerText = "";
      return true;
    } else {
      errorMsg.innerText = "Veuillez renseigner un prénom.";
    }
  };
  const lastNameCheck = () => {
    const lastName = document.querySelector("#lastName");
    const errorMsg = document.querySelector("#lastNameErrorMsg");
    if (regexName.test(lastName.value)) {
      errorMsg.innerText = "";
      return true;
    } else {
      errorMsg.innerText = "Veuillez renseigner un nom.";
    }
  };
  const addressCheck = () => {
    const address = document.querySelector("#address");
    const errorMsg = document.querySelector("#addressErrorMsg");
    if (regexAddress.test(address.value)) {
      errorMsg.innerText = "";
      return true;
    } else {
      errorMsg.innerText = "Veuillez renseigner une adresse.";
    }
  };
  const cityCheck = () => {
    const city = document.querySelector("#city");
    const errorMsg = document.querySelector("#cityErrorMsg");
    if (regexCity.test(city.value)) {
      errorMsg.innerText = "";
      return true;
    } else {
      errorMsg.innerText = "Veuillez renseigner une ville.";
    }
  };
  const emailCheck = () => {
    const email = document.querySelector("#email");
    const errorMsg = document.querySelector("#emailErrorMsg");
    if (regexEmail.test(email.value)) {
      errorMsg.innerText = "";
      return true;
    } else {
      errorMsg.innerText = "Cette adresse email n'est pas valide.";
    }
  };
  // Contrôle de la valeur de tout les champs
  if (
    firstNameCheck() &&
    lastNameCheck() &&
    addressCheck() &&
    cityCheck() &&
    emailCheck()
  ) {
    return true;
  } else {
    return false;
  }
}
//==================================================================
//* Fonction d'envoie de la commande et redirection
//==================================================================
(async function orderSending() {
  const bdStatus = getProduits();
  const orderButton = document.querySelector("#order");
  orderButton.addEventListener("click", async (event) => {
    event.preventDefault();
    if (formValidation()) {
      let contact = {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        address: document.querySelector("#address").value,
        city: document.querySelector("#city").value,
        email: document.querySelector("#email").value,
      };
      let products = [];
      bdStatus.forEach((product) => {
        products.push(product.id);
      });
      let userData = {
        contact,
        products,
      };
      await fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.clear();
          location.href = `../html/confirmation.html?id=${data.orderId}`;
        })
        .catch((e) => apiError());
    } else {
      alert("Veuillez verifier vos informations.");
    }
  });
})();

//==========================================================================
//* Création de la fonction d'un message d'erreur
//==========================================================================
function apiError() {
  document.querySelector("h1").innerHTML =
    "<div>Toutes nos excuses une erreur c'est produite</div>";
  document.querySelector(".cart__order__form").hidden = true;
  document.querySelector(".cart__price").hidden = true;
}
