// API endpoints

const endpoints = {
    drinks: "https://silver-pot-srv.herokuapp.com/api/drinks/",
    foods: "https://silver-pot-srv.herokuapp.com/api/foods/",
    menus: "https://silver-pot-srv.herokuapp.com/api/menus/"
}

// dev:
// const endpoints = {
//     drinks: "http://localhost:3001/api/drinks/",
//     foods: "http://localhost:3001/api/foods/",
//     menus: "http://localhost:3001/api/menus/"
// }

const ManageFood_Defaults = {
    formModel: {
        main: {},
        addons: [],
        removables: []
    },
    foodData: {
        category: "other",
        title: "",
        description: "",
        basePrice: 10,
        addons: [],
        removables: [],
        sizes: [
            {small: null},
            {large: null}
        ]
    },
    addonsData: {
        "addon1": {title: "", price: 1.5, amount: 1},
        "addon2": {title: "", price: 1.5, amount: 1},
        "addon3": {title: "", price: 1.5, amount: 1}
    },
    removablesData: {
        "removable1": {title: "", price: 0, amount: 1},
        "removable2": {title: "", price: 0, amount: 1},
        "removable3": {title: "", price: 0, amount: 1}
    },
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

const ManageDrink_Defaults = {
    formModel: {
        main: {},
        sizes: {
            small: 0,
            regular: 3,
            large: 0
        }
    },
    drinkData: {
        category: "other",
        title: "",
        description: "",
        basePrice: 3
    },
    sizeData: {
        small: 0,
        regular: 3,
        large: 0
    },
    categories: {
        other: "OTHERS",
        coffee: "COFFEE",
        tea: "TEA",
        juice: "JUICE",
        smoothie: "SMOOTHIE"
    }
}

export { endpoints, ManageFood_Defaults, ManageDrink_Defaults }
