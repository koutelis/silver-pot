const CURRENCIES = {
    dollar: { abbr: "usd", name: "dollar", sign: "$" },
    euro: { abbr: "eu", name: "euro", sign: "€" },
    pound: { abbr: "gbp", name: "pounds", sign: "£" }
}

const CURRENCY = CURRENCIES.euro;

const url = (process.env.REACT_APP_IS_DEV_MODE === "true")
    ? "http://localhost:3001/api" 
    : "https://silver-pot-srv.herokuapp.com/api";

const ENDPOINTS = {
    base: "/",
    drinks: "/drinks/",
    drinksCategorized: "/drinkscat/",
    foods: "/foods/",
    menus: "/restaurantmenus/",
    orders: "/orders/",
    users: "/users/"
}
Object.keys(ENDPOINTS).forEach(key => ENDPOINTS[key] = url + ENDPOINTS[key]);

const WEB_SOCKETS = {
    orders: url
}

const FOODS = {
    itemData: {
        category: "other",
        name: "",
        description: "",
        basePrice: 10,
        addons: [],
        removables: [],
        comments: "",
        posDirections: ""
    },
    options: { addons: {}, removables: {} },
    addons: { name: "", price: "1.5" },
    removables: { name: "", price: "0" },
    categories: {
        other: {label: "OTHERS"},
        starter: {label: "STARTERS"},
        main: {label: "MAINS"},
        salad: {label: "SALADS"},
        pizza: {label: "PIZZAS"},
        sandwich: {label: "SANDWICHES"},
        soup: {label: "SOUPS"},
        dessert: {label: "DESSERTS"}
    }
};

const DRINKS = {
    itemData: {
        category: "other",
        name: "",
        description: "",
        basePrice: "3",
        sizes: [],
        comments: "",
        posDirections: ""
    },
    options: { sizes: {} },
    sizes: { name: "", price: "3" },
    categories: {
        other: {label: "OTHERS"},
        coffee: {label: "COFFEE"},
        tea: {label: "TEA"},
        juice: {label: "JUICE"},
        smoothie: {label: "SMOOTHIE"}
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
        foods: {label: "FOOD"},
        drinks: {label: "BEVERAGE"}
    }
};

const ORDERS = {
    order: {
        drinks: [],
        foods: [],
        table: null,
        totalCost: 0,
        time: null
    },
    items: { foods: {}, drinks: {} },
    tables: {
        1: {label: "TABLE 01", color: "#c8e0c9"},
        2: {label: "TABLE 02", color: "#d5e6f0"},
        3: {label: "TABLE 03", color: "#eff9da"},
        4: {label: "TABLE 04", color: "#f9ebdf"},
        5: {label: "TABLE 05", color: "#f9d8d6"},
        6: {label: "TABLE 06", color: "#d6cdea"},
        7: {label: "TABLE 07", color: "#cce8e4"},
        8: {label: "TABLE 08", color: "#ecefe3"}
    },
    foodOptions: {addons: [], removables: [], comments: ""},
    drinkOptions: {sizes: [], comments: ""},
    orderTypes: {
        completed: {label: "COMPLETED"},
        pending: {label: "PENDING"}
    },
    sortOrder: {
        foods: ["starter", "soup", "salad", "other", "dessert"]
    }
};

const ROLES = {
    GUEST: "guest", ADMIN: "admin", MANAGER: "manager", WAITER: "waiter", CHEF: "chef", BARISTA: "barista", CASHIER: "cashier"
};

const USERS = { 
    user: {
        _id: "",  // user's email
        name: "", 
        roles: {
            admin: {label: ROLES.ADMIN, checked: false},
            manager: {label: ROLES.MANAGER, checked: false},
            waiter: {label: ROLES.WAITER, checked: false},
            chef: {label: ROLES.CHEF, checked: false},
            barista: {label: ROLES.BARISTA, checked: false},
            cashier: {label: ROLES.CASHIER, checked: false}
        } 
    }
}

export { CURRENCY, ENDPOINTS, WEB_SOCKETS, FOODS, DRINKS, MENUS, ORDERS, USERS, ROLES };
