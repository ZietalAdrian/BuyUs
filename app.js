"use strict";
class Game {
}
class Deals {
    static addGames() {
        if (this.deals.length < this.maxDeals) {
            while (this.deals.length < this.maxDeals)
                this.randomGame();
            this.setNewPrice();
        }
    }
    static randomGame() {
        const num = Math.floor(Math.random() * games.length);
        if (this.deals.length === 0 ||
            this.deals.some((game) => game.id === num.toString()) === false) {
            const chosenOne = games.find((game) => game.id === num.toString());
            this.deals.push(chosenOne);
        }
        else {
            return this.randomGame();
        }
    }
    static setNewPrice() {
        let index = 0;
        this.deals.forEach((pickedGame) => {
            ++index;
            if (index === 2) {
                let newPrice = Math.floor(pickedGame.price * 0.3);
                this.changePrice(pickedGame.id, newPrice);
            }
            else {
                let newPrice = Math.floor(pickedGame.price * 0.7);
                this.changePrice(pickedGame.id, newPrice);
            }
        });
    }
    static setPrice() {
        this.deals.forEach((pickedGame) => {
            this.changePrice(pickedGame.id, pickedGame.newPrice);
        });
    }
    static changePrice(id, newPrice) {
        const chosenOne = games.find((game) => game.id === id.toString());
        chosenOne.newPrice = newPrice;
    }
    static setString() {
        let index = 0;
        let strArray = [];
        this.deals.forEach((pickedGame) => {
            ++index;
            if (index === 2) {
                strArray.push(`<div class="dealsX deals__middle"><img class="img" src=${pickedGame.img} alt="${pickedGame.title}"><div class="counter best"><div class="counter-description">Do końca promocji pozostało:</div>
            <div class="counter-value"></div>
            <div class="counter-date">godz:min:sek</div></div>
            <button class="buy-btn" onclick="ShopingCart.addToCart(${pickedGame.id})">Do koszyka</button><div class="price"> <span class="oldPrice">${pickedGame.price}</span>/<span class="newPrice">${pickedGame.newPrice}</span>zł</div></div>`);
            }
            else {
                strArray.push(`<div class="dealsX"><img class="img" src=${pickedGame.img} alt="${pickedGame.title}"><div class="counter"><div class="counter-description">Do końca promocji pozostało:</div>
            <div class="counter-value"></div>
            <div class="counter-date">dni:godz:min:sek</div></div>
            <button class="buy-btn" onclick="ShopingCart.addToCart(${pickedGame.id})">Do koszyka</button><div class="price"> <span class="oldPrice">${pickedGame.price}</span>/<span class="newPrice">${pickedGame.newPrice}</span>zł</div></div>`);
            }
        });
        content.innerHTML = `<div class="deals">${strArray.join("")}</div>`;
    }
}
Deals.deals = JSON.parse(localStorage.getItem("DEALS")) || [];
Deals.maxDeals = 3;
class Counter {
    constructor(currentCounter, i) {
        this.day = 24 * 60 * 60 * 1000;
        this.hour = 60 * 60 * 1000;
        this.minute = 60 * 1000;
        this.index = i;
        const finishDate = new Date().getTime() + this.randomTime();
        this.obj = window.setInterval(() => {
            this.countDown(currentCounter, finishDate, this.index);
        }, 1000);
    }
    randomTime() {
        let drawn;
        if (this.index === 1) {
            drawn = Math.floor(Math.random() * (5 * this.hour - 2 * this.hour + this.hour) +
                2 * this.hour); // 2-5h
        }
        else {
            drawn = Math.floor(Math.random() * (5 * this.day - 15 * this.hour + this.hour) +
                15 * this.hour); //15h-5dni
        }
        return drawn;
    }
    countDown(myCounter, finishDate, index) {
        const nowDate = new Date().getTime();
        const promotionTime = finishDate - nowDate;
        let days = promotionTime / this.day;
        days = Math.floor(days);
        let hours = Math.floor((promotionTime % this.day) / this.hour);
        let minutes = Math.floor((promotionTime % this.hour) / this.minute);
        let seconds = Math.floor((promotionTime % this.minute) / 1000);
        if (seconds < 10) {
            seconds = `0${seconds}`;
        }
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        if (hours < 10) {
            hours = `0${hours}`;
        }
        if (days < 10) {
            days = `0${days}`;
        }
        if (this.index === 1) {
            days = 0;
            myCounter.innerHTML = `${hours}:${minutes}:${seconds}`;
        }
        else {
            myCounter.innerHTML = `${days}:${hours}:${minutes}:${seconds}`;
        }
        if (promotionTime < 0) {
            clearInterval(this.obj);
            myCounter.innerHTML = "To koniec !";
        }
    }
}
class GameFilter {
    constructor() {
        this.search = false;
    }
    static showCategories() {
        const categories = games.reduce((arr, item) => {
            if (!arr.includes(item.category)) {
                arr.push(item.category);
            }
            return arr;
        }, []);
        const gameCategories = categories
            .map((category) => {
            return `<button type="button" class="categoryBtn" data-id=${category}>
                  ${category}
                </button>`;
        })
            .join("");
        categoriesNav.innerHTML = gameCategories;
    }
    static categoryFilter() {
        const categoryBtns = document.querySelectorAll(".categoryBtn");
        categoryBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const category = e.currentTarget.dataset.id;
                categorizedGames = games.filter((game) => {
                    return category === game.category;
                });
                this.displayGames();
                input.value = "";
            });
        });
    }
    static searchGames() {
        searchBar.addEventListener("keyup", () => {
            categorizedGames = games.filter((game) => {
                return game.title.toLowerCase().includes(input.value);
            });
            this.displayGames(true);
        });
    }
    static displayGames(search) {
        if (search) {
            if (categorizedGames.length < 1) {
                content.innerHTML = `Podana fraza nie pasuje do żadnej pozycji. <br><br><br><br> Wroc na strone glowna`;
                return;
            }
            if (input.value === "") {
                content.innerHTML = `Home Page`;
            }
            else {
                this.showGames();
            }
            search = false;
        }
        else {
            this.showGames();
        }
        menuTabs.forEach((item) => {
            item.classList.remove("selected");
        });
    }
    static showGames() {
        const str = categorizedGames
            .map((game) => {
            let str = "";
            if (game.newPrice) {
                str = `<span class="cart_oldPrice"> ${game.price} zł</span>/
                 <span class="cart_newPrice"> ${game.newPrice} zł</span>`;
            }
            else {
                str = `<span>${game.price} zł</span>`;
            }
            return `<div class="wrapper-img">
                  <img class="img" src=${game.img} alt="${game.title}">
                  <button class="categorized_buy-btn" onclick="ShopingCart.addToCart(${game.id})">Do koszyka</button>
                  <div class="categorized_price">${str}</div>
                </div>`;
        })
            .join("");
        content.innerHTML = `<div class="grid">${str}</div>`;
    }
}
class Slider {
    static startSlider() {
        content.innerHTML = `<div class="slider-wrapper">
                            <div class="slider">
                                <button class="prev-arrow"><</button>
                                ${this.putBestsellers()}
                                <button class="next-arrow">></button>
                            </div>
                            <div class="circles"></div>
                          </div>`;
        this.sliderImg = document.querySelectorAll(".slider__img");
        this.sliderImg.forEach((img, index) => {
            img.style.left = `${index * 100}%`;
        });
    }
    static addCircles() {
        const maxCircles = 5;
        let circleArray = [];
        for (let i = 0; i < maxCircles; i++) {
            circleArray.push(`<input type="radio" name="pic" class="circleBtn" value=${i}>`);
        }
        const circles = document.querySelector(".circles");
        circles.innerHTML = circleArray.join("");
        this.getCircle(0);
    }
    static putBestsellers() {
        let str = [];
        let i = 0;
        bestsellersArray.forEach((game) => {
            str.push(`<img class="slider__img" src=${game.img} data-id=${i}/>`);
            i++;
        });
        return str.join("");
    }
    static startInterval() {
        this.timer = window.setInterval(() => {
            this.slide(true);
        }, this.interval);
    }
    static intervalHandler() {
        this.slide();
        clearInterval(this.timer);
        this.startInterval();
    }
    static waitForClick() {
        this.startInterval();
        const prevBtn = document.querySelector(".prev-arrow");
        const nextBtn = document.querySelector(".next-arrow");
        prevBtn.addEventListener("click", () => {
            this.counter--;
            this.intervalHandler();
        });
        nextBtn.addEventListener("click", () => {
            this.counter++;
            this.intervalHandler();
        });
        const circleBtn = document.querySelectorAll(".circleBtn");
        circleBtn.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const circleKey = e.currentTarget.value;
                this.counter = circleKey;
                this.intervalHandler();
            });
        });
    }
    static slide(add) {
        if (add)
            this.counter++;
        if (this.counter > this.sliderImg.length - 1) {
            this.counter = 0;
        }
        else if (this.counter < 0) {
            this.counter = this.sliderImg.length - 1;
        }
        this.sliderImg.forEach((img) => {
            img.style.transform = `translateX(-${this.counter * 100}%)`;
        });
        this.getCircle(this.counter);
    }
    static getCircle(count) {
        const circle = document.querySelector(`input[value="${count}"]`);
        circle.checked = true;
    }
}
Slider.counter = 0;
Slider.interval = 3000;
class Newsletter {
    static showHtml() {
        return `<div class="newsletter">
    <h2 class="newsletter__header">
      newsletter - zapisz się i otrzymuj eksluzywne <span class="discounts">zniżki</span>
    </h2>
    <div class="benefits">
      <div class="btn-container">
        <button class="newsletterBtn" data-name="up-to-date">
          badź na bierzaco
        </button>
        <button class="newsletterBtn" data-name="profit">
          liczne korzyści
        </button>
        <button class="newsletterBtn" data-name="offers">
          wyjątkowe oferty
        </button>
      </div>
      <div class="info up-to-date"> 
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Quod voluptatem nihil rem quaerat eos esse quos dolorem sunt
          soluta, dolores itaque dicta exercitationem perspiciatis
          aperiam eligendi architecto expedita odit culpa?
        </p>
      </div>
      <div class="info profit">
        <p>
          Dolores itaque dicta exercitationem perspiciatis aperiam
          eligendi architecto expedita odit culpa?
        </p>
      </div>
      <div class="info offers">
        <p>
          Quod voluptatem nihil rem quaerat eos esse quos dolorem sunt
          soluta, dolores itaque dicta exercitationem perspiciatis
          aperiam eligendi architecto expedita odit culpa?
        </p>
      </div>
    </div>
    <div class="newsletter__bottom">
      <div class="icons">
          <div class="icon">
              <img class="lil-img" src="img/zakupy.png"></img>
              <p class="description">Lorem ipsum dolor sit amet consectetur</p>
          </div>
          <div class="icon">
              <img class="lil-img" src="img/prezent.png"></img>
              <p class="description">Lorem ipsum dolor sit amet consectetur</p>
          </div>
          <div class="icon">
              <img class="lil-img" src="img/dostawa.png"></img>
              <p class="description">Lorem ipsum dolor sit amet consectetur</p>
          </div>
      </div>
      <button type="button" class="newsletter__sign-in">
        dodaj mnie do newslettera
      </button>
    </div>
  </div>`;
    }
    static getHtml() {
        this.newsletterBtns = document.querySelectorAll(".newsletterBtn");
        this.infos = document.querySelectorAll(".info");
    }
    static clear() {
        this.infos.forEach((it) => {
            it.style.display = "none";
        });
        this.newsletterBtns.forEach((it) => {
            it.classList.remove("active");
        });
    }
    static newsletterHandler() {
        this.getHtml();
        this.clear();
        this.newsletterBtns.forEach((item) => {
            item.addEventListener("click", (e) => {
                this.clear();
                const evt = e.currentTarget.dataset.name;
                document.querySelector(`.${evt}`).style.display =
                    "flex";
                e.currentTarget.classList.add("active");
            });
        });
    }
}
class SignIn {
    static signInHandler() {
        this.getHtml();
        this.openModal();
        this.closeModal();
        this.toggle();
        this.guard();
    }
    static getHtml() {
        this.modalOverlay = document.querySelector(".modal__overlay");
        this.closeBtns = document.querySelectorAll(".close-btn");
        this.loginForm = document.querySelector("#login");
        this.createAccountForm = document.querySelector("#create-account");
    }
    static openModal() {
        modalBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.modalOverlay.classList.add("open-modal");
            this.loginForm.classList.remove("form-hidden");
            this.createAccountForm.classList.add("form-hidden");
            const formInputs = document.querySelectorAll(".form__input");
            formInputs.forEach((inputElement) => {
                inputElement.value = "";
                this.clearInputError(inputElement);
                this.setFormMessage(this.loginForm, "error", "");
            });
            this.modalOverlay.querySelector("#login__input").focus();
        });
    }
    static closeModal() {
        this.closeBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                this.modalOverlay.classList.remove("open-modal");
            });
        });
    }
    static toggle() {
        document.querySelector("#link-create-account").addEventListener("click", (e) => {
            e.preventDefault();
            this.loginForm.classList.add("form-hidden");
            this.createAccountForm.classList.remove("form-hidden");
            this.modalOverlay.querySelector("#signup-username").focus();
        });
        document.querySelector("#link-login").addEventListener("click", (e) => {
            e.preventDefault();
            this.loginForm.classList.remove("form-hidden");
            this.createAccountForm.classList.add("form-hidden");
            this.modalOverlay.querySelector("#login__input").focus();
        });
    }
    static guard() {
        this.loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            this.setFormMessage(this.loginForm, "error", "Nazwa użytkownika lub hasło jest nieprawidłowe");
        });
        document.querySelectorAll(".form__input").forEach((inputElement) => {
            inputElement.addEventListener("blur", (e) => {
                const evt = e.target;
                if (evt.id === "signup-username" &&
                    evt.value.length > 0 &&
                    evt.value.length < 8)
                    this.setInputError(inputElement, "Nazwa użytkownika musi zawierać conajmniej 8 znaków");
            });
            inputElement.addEventListener("input", () => {
                this.clearInputError(inputElement);
            });
        });
    }
    static setFormMessage(formElement, type, message) {
        const messageElement = formElement.querySelector(".form__message");
        messageElement.textContent = message;
        messageElement.classList.remove("form__message-success", "form__message-error");
        messageElement.classList.add(`form__message-${type}`);
    }
    static setInputError(inputElement, message) {
        inputElement.classList.add("form__input-error");
        inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
    }
    static clearInputError(inputElement) {
        inputElement.classList.remove("form__input-error");
        inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
    }
}
class ShopingCart {
    constructor() {
        this.items = document.querySelectorAll(".overlay");
    }
    static addToCart(id) {
        if (this.cart.some((item) => item.id === id.toString())) {
            alert("Produkt już jest w koszyku");
        }
        else {
            const cartItem = games.find((game) => game.id === id.toString());
            this.cart.push(cartItem);
            this.renderCartItems();
            this.addToStorage();
        }
    }
    static removeFromCart(id) {
        const toRemove = this.cart.findIndex((game) => game.id === id.toString());
        this.cart.splice(toRemove, 1);
        this.renderCartItems();
        this.addToStorage();
    }
    static renderCartItems() {
        itemContainer.innerHTML = "";
        this.cart.forEach((item) => {
            let str = "";
            if (item.newPrice) {
                str = `<span class="cart_oldPrice"> ${item.price} zł</span>
               <span class="cart_newPrice"> ${item.newPrice} zł</span>`;
            }
            else {
                str = `<span> ${item.price} zł</span>`;
            }
            itemContainer.innerHTML += `<div class="item">
                                    <div class="small-img-wrapper">
                                      <img class="small-img" src=${item.img}>
                                    </div>
                                    <div class="right-side">
                                      <span class="title">${item.title}</span>
                                    </div>
                                    <div class="cart_price">${str}</div>
                                    <div class="overlay" onclick="ShopingCart.removeFromCart(${item.id})"></div>
                                  </div>`;
        });
        if (this.cart.length > 0) {
            let difference = 0;
            this.cart.map((game) => {
                if (game.newPrice) {
                    difference += game.price - game.newPrice;
                }
            });
            let sum = 0;
            this.cart.map((game) => {
                if (game.newPrice) {
                    sum += game.newPrice;
                }
                else {
                    sum += game.price;
                }
            });
            summary.innerHTML = `<div class="totality">
                              <div class="name">
                                <span class="small">Promocje:</span>
                                <span class="small">Zniżki:</span>
                                <span>Łącznie (<span class="elements">${this.cart.length}</span>):</span>
                                <span class="save">Oszczędzasz:</span>
                              </div>
                              <div class="amount">
                                <span class="small">${difference} zł</span>
                                <span class="small">0%</span>
                                <span>${sum} zł</span>
                                <span class="save">${difference} zł</span>
                              </div>
                            </div>
                            <div class="finish">
                              <span>Do kasy</span>
                            </div>`;
        }
        else {
            itemContainer.innerHTML = `<div class="empty-cart">Koszyk jest pusty</div>`;
            summary.innerHTML = "";
        }
    }
    static addToStorage() {
        localStorage.setItem("CART", JSON.stringify(this.cart));
    }
}
ShopingCart.cart = JSON.parse(localStorage.getItem("CART")) || [];
const games = [
    {
        id: "0",
        title: "Elden Ring",
        category: "RPG",
        img: "./img/elden-ring.jpeg",
        price: 300.0,
    },
    {
        id: "1",
        title: "Tibia",
        category: "MMORPG",
        img: "./img/tibia.jpeg",
        price: 40.0,
    },
    {
        id: "2",
        title: "Company of Heroes 2",
        category: "RTS",
        img: "./img/company-of-heroes-2.jpeg",
        price: 150.0,
    },
    {
        id: "3",
        title: "Lost Ark",
        category: "ARPG",
        img: "./img/lost-ark.jpg",
        price: 50.0,
    },
    {
        id: "4",
        title: "StarCraft 2",
        category: "RTS",
        img: "./img/starcraft-2.jpg",
        price: 120.0,
    },
    {
        id: "5",
        title: "Dark Souls 3",
        category: "RPG",
        img: "./img/dark-souls-3.jpeg",
        price: 80.0,
    },
    {
        id: "6",
        title: "Metin 2",
        category: "MMORPG",
        img: "./img/metin-2.jpeg",
        price: 30.0,
    },
    {
        id: "7",
        title: "Sims 4",
        category: "Symulator",
        img: "./img/sims-4.jpg",
        price: 100.0,
    },
    {
        id: "8",
        title: "Red Dead Redemption 2",
        category: "RPG",
        img: "./img/red-dead-redemption-2.jpeg",
        price: 90.0,
    },
    {
        id: "9",
        title: "Farming Simulator 22",
        category: "Symulator",
        img: "./img/farming-simulator-22.jpeg",
        price: 110.0,
    },
];
const bestsellersArray = [
    {
        id: "0",
        title: "Red Dead Redemption 2",
        category: "RPG",
        img: "./img/red-dead-redemption-2-big.jpg",
        price: 90.0,
    },
    {
        id: "1",
        title: "Dark Souls 3",
        category: "RPG",
        img: "./img/Dark-souls-3-big.jpg",
        price: 80.0,
    },
    {
        id: "2",
        title: "Company of Heroes 2",
        category: "RTS",
        img: "./img/Company-of-heroes-2-big.jpg",
        price: 150.0,
    },
    {
        id: "3",
        title: "Lost Ark",
        category: "ARPG",
        img: "./img/lost-ark-big.jpeg",
        price: 50.0,
    },
    {
        id: "4",
        title: "StarCraft 2",
        category: "RTS",
        img: "./img/starcraft-2-big.jpg",
        price: 120.0,
    },
];
let categorizedGames = [...games];
const categoriesNav = document.querySelector(".categories");
const content = document.querySelector(".content");
const input = document.querySelector(".input");
const searchBar = document.querySelector(".search-bar");
const menuTabs = document.querySelectorAll(".menu-tab");
const deals = document.querySelector(".tab-deals");
const bestsellers = document.querySelector(".tab-bestsellers");
const newsletter = document.querySelector(".tab-newsletter");
const modalBtn = document.querySelector(".modal-btn");
const shopingCartBtn = document.querySelector(".cart-btn");
const shopingCart = document.querySelector(".shoping-cart_container");
const itemContainer = document.querySelector(".item_container");
const summary = document.querySelector(".summary");
window.addEventListener("DOMContentLoaded", () => {
    Deals.setPrice();
    input.value = "";
    SignIn.signInHandler();
    GameFilter.showCategories();
    GameFilter.categoryFilter();
    GameFilter.searchGames();
    Deals.addGames();
    localStorage.setItem("DEALS", JSON.stringify(Deals.deals));
    Deals.setString();
    ShopingCart.renderCartItems();
    const liczniki = document.querySelectorAll(".counter-value");
    let i = 0;
    liczniki.forEach((licznik) => {
        new Counter(licznik, i);
        i++;
    });
    function resetCircle() {
        const circleBtn = document.querySelectorAll(".circleBtn");
        circleBtn.forEach((item) => {
            item.checked = false;
        });
    }
    deals.classList.add("selected");
    menuTabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
            if (e.currentTarget.classList.contains("tab-deals")) {
                resetCircle();
                clearInterval(Slider.timer);
                Deals.setString();
                menuTabs.forEach((item) => {
                    item.classList.remove("selected");
                });
                deals.classList.add("selected");
            }
            else if (e.currentTarget.classList.contains("tab-bestsellers")) {
                menuTabs.forEach((item) => {
                    item.classList.remove("selected");
                });
                bestsellers.classList.add("selected");
                Slider.startSlider();
                Slider.addCircles();
                Slider.waitForClick();
            }
            else if (e.currentTarget.classList.contains("tab-newsletter")) {
                resetCircle();
                clearInterval(Slider.timer);
                menuTabs.forEach((item) => {
                    item.classList.remove("selected");
                });
                newsletter.classList.add("selected");
                content.innerHTML = Newsletter.showHtml();
                Newsletter.newsletterHandler();
            }
        });
    });
    shopingCartBtn.addEventListener("click", () => {
        shopingCart.classList.toggle("close-cart");
    });
});
