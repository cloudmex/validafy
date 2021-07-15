import { useState } from "react";


export const superHook = (todo = {}) =>{
    const [value, setValue] = useState(todo);

    const add = (obj = {}) =>{
        setValue({...value, ...obj})
    }
    const reset = (obj = {}) => {
        !!obj ?
        setValue(todo)
        :
        setValue(obj)
    }

    return{
        add,
        reset,
        setValue,
        value
    }
}


