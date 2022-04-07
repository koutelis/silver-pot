// API endpoints

const ENDPOINTS = {
    drinks: "https://silver-pot-srv.herokuapp.com/api/drinks/",
    foods: "https://silver-pot-srv.herokuapp.com/api/foods/",
    menus: "https://silver-pot-srv.herokuapp.com/api/menus/"
}

// dev:
// const ENDPOINTS = {
//     drinks: "http://localhost:3001/api/drinks/",
//     foods: "http://localhost:3001/api/foods/",
//     menus: "http://localhost:3001/api/menus/"
// }

const FOODS = {
    foodData: {
        category: "other",
        title: "",
        description: "",
        basePrice: 10,
        addons: [ { name: "", price: "1.5" } ],
        removables: [ { name: "", price: "0" } ]
    },
    addons: { name: "", price: "1.5" },
    removables: { name: "", price: "0" },
    categories: {
        other: "OTHERS",
        starter: "STARTERS",
        main: "MAINS",
        salad: "SALADS",
        pizza: "PIZZAS",
        sandwich: "SANDWICHES",
        soup: "SOUPS",
        dessert: "DESSERTS"
    }
}

const DRINKS = {
    drinkData: {
        category: "other",
        title: "",
        description: "",
        basePrice: "3",
        sizes: []
    },
    sizes: { name: "", price: "3" },
    categories: {
        other: "OTHERS",
        coffee: "COFFEE",
        tea: "TEA",
        juice: "JUICE",
        smoothie: "SMOOTHIE"
    }
}

export { ENDPOINTS, FOODS, DRINKS }
