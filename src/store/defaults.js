// API endpoints

const endpoints = {
    drinks: "https://silver-pot-srv.herokuapp.com/api/drinks/",  // http://localhost:3001/api/drinks
    foods: "https://silver-pot-srv.herokuapp.com/api/foods/",  // http://localhost:3001/api/foods
    menus: "https://silver-pot-srv.herokuapp.com/api/menus/"  // http://localhost:3001/api/menus
}

const ModalManageMenuItem_Defaults = {
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
    }
}

const ModalManageDrink_Defaults = {
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
    }
}

const categories = {
    foods: {
        other: "other",
        starter: "starter",
        main: "main",
        salad: "salad",
        pizza: "pizza",
        sandwich: "sandwich",
        soup: "soup",
        desert: "desert"
    },
    drinks: {
        other: "other",
        coffee: "coffee",
        tea: "tea",
        juice: "juice",
        smoothie: "smoothie"
    }
}

export { endpoints, ModalManageMenuItem_Defaults, ModalManageDrink_Defaults, categories }
