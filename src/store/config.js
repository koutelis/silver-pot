const CURRENCIES = {
    dollar: { abbr: "usd", name: "dollar", sign: "$" },
    euro: { abbr: "eu", name: "euro", sign: "€" },
    pound: { abbr: "gbp", name: "pounds", sign: "£" }
}

const CURRENCY = CURRENCIES.euro;

const url = (process.env.REACT_APP_IS_DEV_MODE === "true")
    ? "http://localhost:3001" 
    : "https://silver-pot-srv.herokuapp.com";

const ENDPOINTS = {
    drinks: "/api/drinks/",
    drinksCategorized: "/api/drinkscat/",
    foods: "/api/foods/",
    menus: "/api/restaurantmenus/",
    orders: "/api/orders/",
    users: "/api/users/"
}
Object.keys(ENDPOINTS).forEach(key => ENDPOINTS[key] = url + ENDPOINTS[key]);

const WEB_SOCKETS = {
    orders: url
}

const NAV_ROUTES = {
    root: {path: "/", label: "HOME", permissions: ["guest"]},
    manageUsers: {path: "/manageUsers", label: "Users", hamLabel: "Manage Users", permissions: ["admin", "manager"]},
    manageMenu: {path: "/manageMenu", label: "Restaurant Menu-Items", hamLabel: "Manage Menu", permissions: ["admin", "manager"]},
    createMenu: {path: "/createMenu", label: "Restaurant Menu", hamLabel: "Create Menu", permissions: ["admin", "manager"]},
    waitersSection: {path: "/waiters", label: "Waiters", permissions: ["admin", "manager", "waiter"]},
    kitchenSection: {path: "/kitchen", label: "Kitchen", permissions: ["admin", "manager", "chef"]},
    barSection: {path: "/bar", label: "Bar", permissions: ["admin", "manager", "barista"]},
    cashSection: {path: "/cashier", label: "Cashdesk", permissions: ["admin", "manager", "cashier"]},
    notFound: {path: "*", label: "404 - Not Found", permissions: ["guest"]},
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
}

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
}

const USERS = { 
    user: {
        _id: "",  // user's email
        name: "", 
        roles: {
            admin: {label: "Admin", checked: false},
            manager: {label: "Manager", checked: false},
            waiter: {label: "Waiter", checked: false},
            chef: {label: "Chef", checked: false},
            barista: {label: "Barista", checked: false},
            cashier: {label: "Cashier", checked: false}
        } 
    }
}

export { CURRENCY, ENDPOINTS, WEB_SOCKETS, NAV_ROUTES, FOODS, DRINKS, MENUS, ORDERS, USERS };
