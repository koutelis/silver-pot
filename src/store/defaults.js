// API endpoints

const endpoints = {
    foods: "https://silver-pot-srv.herokuapp.com/api/foods/",
    drinks: "https://silver-pot-srv.herokuapp.com/api/drinks/"
}

// #region ModalManageFood.js

const ModalManageFood_Defaults = {
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
        size: [
            {small: null},
            {large: null}
        ]
    },
    addonsData: {
        "addon1": {title: "", price: 2, amount: 1},
        "addon2": {title: "", price: 2, amount: 1},
        "addon3": {title: "", price: 2, amount: 1}
    },
    removablesData: {
        "removable1": {title: "", price: 0.50, amount: 1},
        "removable2": {title: "", price: 0.50, amount: 1},
        "removable3": {title: "", price: 0.50, amount: 1}
    }
}

const categories = {
    food: {
        other: "Other", 
        pizza: "Pizza", 
        pasta: "Pasta", 
        salad: "Salad", 
        desert: "Desert",
        sandwich: "Sandwich"
    }
}

// #endregion

export { endpoints, ModalManageFood_Defaults, categories }