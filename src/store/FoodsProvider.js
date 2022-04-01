import React, { useReducer } from 'react';

/**
 * Dummy object, for auto-completion purposes.
 */
const FoodsContext = React.createContext({
    foods: [],
    totalAmount: 0, 
    addFood: (food) => {},
    removeFood: (id) => {}
})

const defaultFoodsState = {
    foods: [], 
    totalAmount: 0 
};

const foodsReducer = (state, action) => {
    if (action.commandName === "ADD") {
        let updatedFoods;
        const idx = state.foods.findIndex(rcp => rcp.id === action.food.id);
        let existingFood = state.foods[idx];
        if (existingFood) {
            existingFood = {...existingFood, amount: existingFood.amount + 1};
            updatedFoods = [...state.foods];
            updatedFoods[idx] = existingFood;
        } else {
            updatedFoods = state.foods.concat(action.food);
        }
        const updatedTotalAmount = state.totalAmount + action.food.price * action.food.amount
        return {
            foods: updatedFoods,
            totalAmount: updatedTotalAmount
        };
    } else if (action.commandName === "REMOVE") {
        const idx = state.foods.findIndex(rcp => rcp.id === action.id);
        const food = state.foods[idx];
        const updatedTotalAmount = state.totalAmount - food.price
        food.amount -= 1
        if (food.amount === 0) {
            state.foods.splice(idx, 1);
        }
        return {
            foods: state.foods,
            totalAmount: updatedTotalAmount
        };
    }
    
    return state;
}

/**
 * Wrapper context provider.
 * Wrap around the whole app to have state context.
 * @param {Object} props - only .children expected
 * @returns {JSX}
 */
const FoodsProvider = (props) => {
    const [foodsState, dispatchFoodsAction] = useReducer(foodsReducer, defaultFoodsState);


    const addFood = (food) => {
        dispatchFoodsAction({commandName: 'ADD', food});
    }

    const removeFood = (id) => {
        dispatchFoodsAction({commandName: 'REMOVE', id});
    }

    const foodsContext = {
        foods: foodsState.foods,
        totalAmount: foodsState.totalAmount, 
        addFood,
        removeFood
    };

    return (
        <FoodsContext.Provider value={foodsContext}>
            {props.children}
        </FoodsContext.Provider>
    )
}

export default FoodsProvider;
