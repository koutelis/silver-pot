const ENDPOINTS_PROD = {
    drinks: "https://silver-pot-srv.herokuapp.com/api/drinks/",
    foods: "https://silver-pot-srv.herokuapp.com/api/foods/",
    menus: "https://silver-pot-srv.herokuapp.com/api/restaurantmenus/",
    orders: "https://silver-pot-srv.herokuapp.com/api/orders/"
};

const ENDPOINTS_DEV = {
    drinks: "http://localhost:3001/api/drinks/",
    foods: "http://localhost:3001/api/foods/",
    menus: "http://localhost:3001/api/restaurantmenus/",
    orders: "http://localhost:3001/api/orders/"
};

const ENDPOINTS = process.env.REACT_APP_IS_DEV_MODE === "true" ? ENDPOINTS_DEV : ENDPOINTS_PROD;

const FOODS = {
    foodData: {
        category: "other",
        name: "",
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
};

const DRINKS = {
    drinkData: {
        category: "other",
        name: "",
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
};

const MENUS = {
    template: {
        other: [],
        starter: [],
        main: [],
        salad: [],
        pizza: [],
        sandwich: [],
        soup: [],
        dessert: []
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
    }
}

export { ENDPOINTS, FOODS, DRINKS, MENUS, ORDERS };