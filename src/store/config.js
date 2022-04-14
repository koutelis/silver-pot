const CURRENCIES = {
    dollar: { abbr: "usd", name: "dollar", sign: "$" },
    euro: { abbr: "eu", name: "euro", sign: "€" },
    pound: { abbr: "gbp", name: "pounds", sign: "£" }
}

const CURRENCY = CURRENCIES.euro;



const ENDPOINTS = {
    drinks: "/api/drinks/",
    drinksCategorized: "/api/drinkscat/",
    foods: "/api/foods/",
    menus: "/api/restaurantmenus/",
    orders: "/api/orders/"
}

const url = (process.env.REACT_APP_IS_DEV_MODE === "true")
    ? "http://localhost:3001" 
    : "https://silver-pot-srv.herokuapp.com";

Object.keys(ENDPOINTS).forEach(key => ENDPOINTS[key] = url + ENDPOINTS[key]);



const FOODS = {
    itemData: {
        category: "other",
        name: "",
        description: "",
        basePrice: 10,
        addons: [ { name: "", price: "1.5" } ],
        removables: [ { name: "", price: "0" } ]
    },
    options: { addons: {}, removables: {} },
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
};



const DRINKS = {
    itemData: {
        category: "other",
        name: "",
        description: "",
        basePrice: "3",
        sizes: []
    },
    options: { sizes: {} },
    sizes: { name: "", price: "3" },
    categories: {
        other: "OTHERS",
        coffee: "COFFEE",
        tea: "TEA",
        juice: "JUICE",
        smoothie: "SMOOTHIE"
    }
};



const MENUS = {
    template: {
        date: null, 
        fontSize: 15,
        drinks: {
            coffee: [],
            juice: [],
            other: [],
            smoothie: [],
            tea: []
        },
        foods: {
            other: [],
            starter: [],
            main: [],
            salad: [],
            pizza: [],
            sandwich: [],
            soup: [],
            dessert: []
        }
    },
    itemTypes: {
        foods: "FOODS",
        drinks: "DRINKS"
    }
}



const ORDERS = {
    order: {
        timestamp: null,
        table: null,
        foods: [],
        drinks: []
    },
    items: { foods: [], drinks: [] },
    tables: {
        1: "TABLE 01",
        2: "TABLE 02",
        3: "TABLE 03",
        4: "TABLE 04",
        5: "TABLE 05",
        6: "TABLE 06",
        7: "TABLE 07",
        8: "TABLE 08"
    },
    foodOptions: {addons: [], removables: [], comments: ""},
    drinkOptions: {sizes: [], comments: ""}
}



export { CURRENCY, ENDPOINTS, FOODS, DRINKS, MENUS, ORDERS };