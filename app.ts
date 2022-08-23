class Game {
  id: string;
  title: string;
  category: string;
  img: string;
  price: number;
  newPrice?: number;
}
class Deals {
  static deals: Game[] = JSON.parse(localStorage.getItem("DEALS")!) || [];
  private static maxDeals: number = 3;

  static addGames() {
    if (this.deals.length < this.maxDeals) {
      while (this.deals.length < this.maxDeals) this.randomGame();
      this.setNewPrice();
    }
  }
  private static randomGame(): any {
    const num: number = Math.floor(Math.random() * games.length);
    if (
      this.deals.length === 0 ||
      this.deals.some((game) => game.id === num.toString()) === false
    ) {
      const chosenOne = games.find((game) => game.id === num.toString());
      this.deals.push(chosenOne as Game);
    } else {
      return this.randomGame();
    }
  }
  private static setNewPrice() {
    let index: number = 0;
    this.deals.forEach((pickedGame) => {
      ++index;
      if (index === 2) {
        let newPrice = Math.floor(pickedGame.price * 0.3);
        this.changePrice(pickedGame.id, newPrice);
      } else {
        let newPrice = Math.floor(pickedGame.price * 0.7);
        this.changePrice(pickedGame.id, newPrice);
      }
    });
  }
  static setPrice() {
    this.deals.forEach((pickedGame) => {
      this.changePrice(pickedGame.id, pickedGame.newPrice!);
    });
  }
  private static changePrice(id: string, newPrice: number) {
    const chosenOne = games.find((game) => game.id === id.toString());
    chosenOne!.newPrice = newPrice;
  }
  static setString() {
    let index: number = 0;
    let strArray: string[] = [];
    this.deals.forEach((pickedGame) => {
      ++index;
      if (index === 2) {
        strArray.push(
          `<div class="dealsX deals__middle"><img class="img" src=${
            (pickedGame as Game).img
          } alt="${
            (pickedGame as Game).title
          }"><div class="counter best"><div class="counter-description">Do końca promocji pozostało:</div>
            <div class="counter-value"></div>
            <div class="counter-date">godz:min:sek</div></div>
            <button class="buy-btn" onclick="ShopingCart.addToCart(${
            (pickedGame as Game).id
          })">Do koszyka</button><div class="price"> <span class="oldPrice">${
            (pickedGame as Game).price
          }</span>/<span class="newPrice">${
            (pickedGame as Game).newPrice
          }</span>zł</div></div>`
        );
      } else {
        strArray.push(
          `<div class="dealsX"><img class="img" src=${
            (pickedGame as Game).img
          } alt="${
            (pickedGame as Game).title
          }"><div class="counter"><div class="counter-description">Do końca promocji pozostało:</div>
            <div class="counter-value"></div>
            <div class="counter-date">dni:godz:min:sek</div></div>
            <button class="buy-btn" onclick="ShopingCart.addToCart(${
            (pickedGame as Game).id
          })">Do koszyka</button><div class="price"> <span class="oldPrice">${
            (pickedGame as Game).price
          }</span>/<span class="newPrice">${
            (pickedGame as Game).newPrice
          }</span>zł</div></div>`
        );
      }
    });
    content.innerHTML = `<div class="deals">${strArray.join("")}</div>`;
  }
}
class Counter {
  constructor(currentCounter: HTMLDivElement, i: number) {
    this.index = i;
    const finishDate = new Date().getTime() + this.randomTime();
    this.obj = window.setInterval(() => {
      this.countDown(currentCounter, finishDate, this.index);
    }, 1000);
  }

  private obj: number;
  private readonly day: number = 24 * 60 * 60 * 1000;
  private readonly hour: number = 60 * 60 * 1000;
  private readonly minute: number = 60 * 1000;
  private readonly index: number;

  private randomTime() {
    let drawn: number;
    if (this.index === 1) {
      drawn = Math.floor(
        Math.random() * (5 * this.hour - 2 * this.hour + this.hour) +
          2 * this.hour
      ); // 2-5h
    } else {
      drawn = Math.floor(
        Math.random() * (5 * this.day - 15 * this.hour + this.hour) +
          15 * this.hour
      ); //15h-5dni
    }
    return drawn;
  }
  private countDown(
    myCounter: HTMLDivElement,
    finishDate: number,
    index: number
  ) {
    const nowDate: number = new Date().getTime();
    const promotionTime: number = finishDate - nowDate;
    let days: number | string = promotionTime / this.day;
    days = Math.floor(days);
    let hours: number | string = Math.floor(
      (promotionTime % this.day) / this.hour
    );
    let minutes: number | string = Math.floor(
      (promotionTime % this.hour) / this.minute
    );
    let seconds: number | string = Math.floor(
      (promotionTime % this.minute) / 1000
    );
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
    } else {
      myCounter.innerHTML = `${days}:${hours}:${minutes}:${seconds}`;
    }
    if (promotionTime < 0) {
      clearInterval(this.obj);
      myCounter.innerHTML = "To koniec !";
    }
  }
}
class GameFilter {
  private search: boolean = false;

  static showCategories() {
    const categories: string[] = games.reduce((arr, item) => {
      if (!arr.includes(item.category)) {
        arr.push(item.category);
      }
      return arr;
    }, <string[]>[]);
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
    const categoryBtns = document.querySelectorAll(
      ".categoryBtn"
    )! as NodeListOf<HTMLButtonElement>;
    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const category = (e.currentTarget as HTMLButtonElement).dataset.id;
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
  static displayGames(search?: boolean) {
    if (search) {
      if (categorizedGames.length < 1) {
        content.innerHTML = `Podana fraza nie pasuje do żadnej pozycji. <br><br><br><br> Wroc na strone glowna`;
        return;
      }
      if (input.value === "") {
        content.innerHTML = `Home Page`;
      } else {
        this.showGames();
      }
      search = false;
    } else {
      this.showGames();
    }
    menuTabs.forEach((item) => {
      item.classList.remove("selected");
    });
  }
  static showGames() {
    const str = categorizedGames
      .map((game) => {
        let str: string = "";
        if (game.newPrice) {
          str = `<span class="cart_oldPrice"> ${game.price} zł</span>/
                 <span class="cart_newPrice"> ${game.newPrice} zł</span>`;
        } else {
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
  private static counter: number = 0;
  private static sliderImg: NodeListOf<HTMLImageElement>;
  static timer: number;
  private static interval: number = 3000;

  static startSlider() {
    content.innerHTML =  `<div class="slider-wrapper">
                            <div class="slider">
                                <button class="prev-arrow"><</button>
                                ${this.putBestsellers()}
                                <button class="next-arrow">></button>
                            </div>
                            <div class="circles"></div>
                          </div>`;
    this.sliderImg = document.querySelectorAll(
      ".slider__img"
    )! as NodeListOf<HTMLImageElement>;
    this.sliderImg.forEach((img, index) => {
      img.style.left = `${index * 100}%`;
    });
  }
  static addCircles() {
    const maxCircles: number = 5;
    let circleArray: string[] = [];
    for (let i = 0; i < maxCircles; i++) {
      circleArray.push(
        `<input type="radio" name="pic" class="circleBtn" value=${i}>`
      );
    }
    const circles = document.querySelector(".circles")! as HTMLDivElement;
    circles.innerHTML = circleArray.join("");
    this.getCircle(0);
  }
  private static putBestsellers(): string {
    let str: string[] = [];
    let i: number = 0;
    bestsellersArray.forEach((game) => {
      str.push(
        `<img class="slider__img" src=${(game as Game).img} data-id=${i}/>`
      );
      i++;
    });
    return str.join("");
  }
  private static startInterval() {
    this.timer = window.setInterval(() => {
      this.slide(true);
    }, this.interval);
  }
  private static intervalHandler() {
    this.slide();
    clearInterval(this.timer);
    this.startInterval();
  }
  static waitForClick() {
    this.startInterval();
    const prevBtn = document.querySelector(".prev-arrow")! as HTMLButtonElement;
    const nextBtn = document.querySelector(".next-arrow")! as HTMLButtonElement;
    prevBtn.addEventListener("click", () => {
      this.counter--;
      this.intervalHandler();
    });
    nextBtn.addEventListener("click", () => {
      this.counter++;
      this.intervalHandler();
    });
    const circleBtn = document.querySelectorAll(
      ".circleBtn"
    )! as NodeListOf<HTMLInputElement>;
    circleBtn.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const circleKey: any = (e.currentTarget as HTMLInputElement).value;
        this.counter = circleKey;
        this.intervalHandler();
      });
    });
  }
  private static slide(add?: boolean) {
    if (add) this.counter++;
    if (this.counter > this.sliderImg.length - 1) {
      this.counter = 0;
    } else if (this.counter < 0) {
      this.counter = this.sliderImg.length - 1;
    }
    this.sliderImg.forEach((img) => {
      img.style.transform = `translateX(-${this.counter * 100}%)`;
    });
    this.getCircle(this.counter);
  }
  private static getCircle(count: number) {
    const circle = document.querySelector(
      `input[value="${count}"]`
    )! as HTMLInputElement;
    circle.checked = true;
  }
}
class Newsletter {
  static newsletterBtns: NodeListOf<HTMLButtonElement>;
  static infos: NodeListOf<HTMLDivElement>;

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
    this.newsletterBtns = document.querySelectorAll(
      ".newsletterBtn"
    )! as NodeListOf<HTMLButtonElement>;
    this.infos = document.querySelectorAll(
      ".info"
    )! as NodeListOf<HTMLDivElement>;
  }
  static clear() {
    this.infos.forEach((it) => {
      it.style.display = "none";
    });
    this.newsletterBtns.forEach((it) => {
      (it as HTMLButtonElement).classList.remove("active");
    });
  }
  static newsletterHandler() {
    this.getHtml();
    this.clear();
    this.newsletterBtns.forEach((item) => {
      item.addEventListener("click", (e) => {
        this.clear();
        const evt = (e.currentTarget as HTMLButtonElement).dataset.name;
        (document.querySelector(`.${evt}`)! as HTMLDivElement).style.display =
          "flex";
        (e.currentTarget as HTMLButtonElement).classList.add("active");
      });
    });
  }
}
class SignIn {
  static modalOverlay: HTMLDivElement;
  static closeBtns: NodeListOf<HTMLButtonElement>;
  static loginForm: HTMLFormElement;
  static createAccountForm: HTMLFormElement;

  static signInHandler() {
    this.getHtml();
    this.openModal();
    this.closeModal();
    this.toggle();
    this.guard();
  }
  static getHtml() {
    this.modalOverlay = document.querySelector(
      ".modal__overlay"
    )! as HTMLDivElement;
    this.closeBtns = document.querySelectorAll(
      ".close-btn"
    )! as NodeListOf<HTMLButtonElement>;
    this.loginForm = document.querySelector("#login")! as HTMLFormElement;
    this.createAccountForm = document.querySelector(
      "#create-account"
    )! as HTMLFormElement;
  }
  static openModal() {
    modalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.modalOverlay.classList.add("open-modal");
      this.loginForm.classList.remove("form-hidden");
      this.createAccountForm.classList.add("form-hidden");
      const formInputs = document.querySelectorAll(
        ".form__input"
      )! as NodeListOf<HTMLInputElement>;
      formInputs.forEach((inputElement) => {
        inputElement.value = "";
        this.clearInputError(inputElement);
        this.setFormMessage(this.loginForm, "error", "");
      });
      (
        this.modalOverlay.querySelector("#login__input")! as HTMLInputElement
      ).focus();
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
    (
      document.querySelector("#link-create-account")! as HTMLElement
    ).addEventListener("click", (e) => {
      e.preventDefault();
      this.loginForm.classList.add("form-hidden");
      this.createAccountForm.classList.remove("form-hidden");
      (
        this.modalOverlay.querySelector("#signup-username")! as HTMLInputElement
      ).focus();
    });
    (document.querySelector("#link-login")! as HTMLElement).addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        this.loginForm.classList.remove("form-hidden");
        this.createAccountForm.classList.add("form-hidden");
        (
          this.modalOverlay.querySelector("#login__input")! as HTMLInputElement
        ).focus();
      }
    );
  }
  static guard() {
    this.loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.setFormMessage(
        this.loginForm,
        "error",
        "Nazwa użytkownika lub hasło jest nieprawidłowe"
      );
    });
    document.querySelectorAll(".form__input").forEach((inputElement) => {
      inputElement.addEventListener("blur", (e) => {
        const evt = e.target as HTMLInputElement;
        if (
          evt.id === "signup-username" &&
          evt.value.length > 0 &&
          evt.value.length < 8
        )
          this.setInputError(
            inputElement as HTMLInputElement,
            "Nazwa użytkownika musi zawierać conajmniej 8 znaków"
          );
      });
      inputElement.addEventListener("input", () => {
        this.clearInputError(inputElement as HTMLInputElement);
      });
    });
  }
  static setFormMessage(
    formElement: HTMLFormElement,
    type: string,
    message: string
  ) {
    const messageElement = formElement.querySelector(
      ".form__message"
    )! as HTMLDivElement;

    messageElement.textContent = message;
    messageElement.classList.remove(
      "form__message-success",
      "form__message-error"
    );
    messageElement.classList.add(`form__message-${type}`);
  }
  static setInputError(inputElement: HTMLInputElement, message: string) {
    inputElement.classList.add("form__input-error");
    (inputElement.parentElement as HTMLInputElement).querySelector(
      ".form__input-error-message"
    )!.textContent = message;
  }
  static clearInputError(inputElement: HTMLInputElement) {
    inputElement.classList.remove("form__input-error");
    (inputElement.parentElement as HTMLInputElement).querySelector(
      ".form__input-error-message"
    )!.textContent = "";
  }
}
class ShopingCart {
  static cart: Game[] = JSON.parse(localStorage.getItem("CART")!) || [];

  items = document.querySelectorAll(".overlay")! as NodeListOf<HTMLDivElement>;
  static addToCart(id: string) {
    if (this.cart.some((item) => item.id === id.toString())) {
      alert("Produkt już jest w koszyku");
    } else {
      const cartItem = games.find((game) => game.id === id.toString());
      this.cart.push(cartItem as Game);
      this.renderCartItems();
      this.addToStorage();
    }
  }
  static removeFromCart(id: string) {
    const toRemove = this.cart.findIndex((game) => game.id === id.toString());
    this.cart.splice(toRemove, 1);
    this.renderCartItems();
    this.addToStorage();
  }
  static renderCartItems() {
    itemContainer.innerHTML = "";
    this.cart.forEach((item) => {
      let str: string = "";
      if (item.newPrice) {
        str = `<span class="cart_oldPrice"> ${item.price} zł</span>
               <span class="cart_newPrice"> ${item.newPrice} zł</span>`;
      } else {
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
      let difference: number = 0;
      this.cart.map((game) => {
        if (game.newPrice) {
          difference += game.price - game.newPrice;
        }
      });
      let sum: number = 0;
      this.cart.map((game) => {
        if (game.newPrice) {
          sum += game.newPrice;
        } else {
          sum += game.price;
        }
      });
      summary.innerHTML =  `<div class="totality">
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
    } else {
      itemContainer.innerHTML = `<div class="empty-cart">Koszyk jest pusty</div>`;
      summary.innerHTML = "";
    }
  }
  static addToStorage() {
    localStorage.setItem("CART", JSON.stringify(this.cart));
  }
}
const games: Game[] = [
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
const bestsellersArray: Game[] = [
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
let categorizedGames: Game[] = [...games];

const categoriesNav = document.querySelector(".categories")! as HTMLElement;
const content = document.querySelector(".content")! as HTMLDivElement;
const input = document.querySelector(".input")! as HTMLInputElement;
const searchBar = document.querySelector(".search-bar")! as HTMLFormElement;
const menuTabs = document.querySelectorAll(
  ".menu-tab"
)! as NodeListOf<HTMLDivElement>;
const deals = document.querySelector(".tab-deals")! as HTMLDivElement;
const bestsellers = document.querySelector(
  ".tab-bestsellers"
)! as HTMLDivElement;
const newsletter = document.querySelector(".tab-newsletter")! as HTMLDivElement;
const modalBtn = document.querySelector(".modal-btn")! as HTMLButtonElement;
const shopingCartBtn = document.querySelector(
  ".cart-btn"
)! as HTMLButtonElement;
const shopingCart = document.querySelector(
  ".shoping-cart_container"
)! as HTMLDivElement;
const itemContainer = document.querySelector(
  ".item_container"
)! as HTMLDivElement;
const summary = document.querySelector(".summary")! as HTMLDivElement;

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
  const liczniki = document.querySelectorAll(
    ".counter-value"
  )! as NodeListOf<HTMLDivElement>;
  let i = 0;
  liczniki.forEach((licznik) => {
    new Counter(licznik, i);
    i++;
  });
  function resetCircle() {
    const circleBtn = document.querySelectorAll(
      ".circleBtn"
    )! as NodeListOf<HTMLInputElement>;
    circleBtn.forEach((item) => {
      item.checked = false;
    });
  }
  deals.classList.add("selected");
  menuTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      if ((e.currentTarget as HTMLDivElement).classList.contains("tab-deals")) {
        resetCircle();
        clearInterval(Slider.timer);
        Deals.setString();
        menuTabs.forEach((item) => {
          item.classList.remove("selected");
        });
        deals.classList.add("selected");
      } else if (
        (e.currentTarget as HTMLDivElement).classList.contains(
          "tab-bestsellers"
        )
      ) {
        menuTabs.forEach((item) => {
          item.classList.remove("selected");
        });
        bestsellers.classList.add("selected");
        Slider.startSlider();
        Slider.addCircles();
        Slider.waitForClick();
      } else if (
        (e.currentTarget as HTMLDivElement).classList.contains("tab-newsletter")
      ) {
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
