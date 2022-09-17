import React, { useState } from 'react';
import * as TypeNames from '../../constants/TypeNames';
import useLines from '../../hooks/useLines';
import useYear from '../../hooks/useYear';
import Utils from '../Utils';

const AddRow = () => {


    const OUT_TYPES = TypeNames.EXPENSES_TYPE_NAMES;
    const FIRST_SUB_OUT = Object.keys(OUT_TYPES)[0];
    const IN_TYPES = TypeNames.INCOME_TYPE_NAMES;
    const FIRST_SUB_IN = Object.keys(IN_TYPES)[0];
    const TODAY = new Date().toISOString().split('T')[0];


    // Context
    const { lines, setLines } = useLines([]);
    const { setYear } = useYear();
    // State
    const [line, setLine] = useState({ type: "gastos", category: FIRST_SUB_OUT, subcategory: OUT_TYPES[FIRST_SUB_OUT][0], date: TODAY });

    const [type, setType] = useState("gastos")
    const [categories, setCategories] = useState(OUT_TYPES)
    const [subCategories, setSubCategories] = useState(OUT_TYPES[FIRST_SUB_OUT])
    const [error, setError] = useState(false);

    // Función que lee el presupuesto
    const setTypeHandler = e => {
        setType(e.target.value);

        if ("gastos" === e.target.value) {
            setCategories(OUT_TYPES);
            setSubCategories(OUT_TYPES[FIRST_SUB_OUT]);
        }
        if ("ingresos" === e.target.value) {
            setCategories(IN_TYPES);
            setSubCategories(IN_TYPES[FIRST_SUB_IN]);
        }

        setLine({ ...line, type: e.target.value });
    }

    const setCategoryHandler = e => {
        setSubCategories(categories[e.target.value]);
        setLine({ ...line, category: e.target.value });
    }

    const setSubCategoryHandler = e => {
        setLine({ ...line, subcategory: e.target.value });
    }

    const setDateHandler = e => {
        setLine({ ...line, date: e.target.value });
    }

    const setDescriptionHandler = e => {
        setLine({ ...line, description: e.target.value });
    }

    const setQuantityHandler = e => {
        setLine({ ...line, quantity: parseFloat(e.target.value) });
    }

    // Submit
    const addLine = e => {
        e.preventDefault();

        // Validation
        if (line.quantity < 1 || isNaN(line.quantity)) {
            setError(true);
            return;
        }

        // Set ID, set no errors and add line
        let newId = lines.length;
        let exist = lines.find(item => item.id === newId);

        while (exist) {
            newId++;
            console.log('newId', newId)
            let check = newId;
            exist = lines.find(item => item.id === check);
        }

        line.id = newId;

        setError(false);
        setLines([...lines, line]);

        // Clean description and quantity
        for (let item of e.target.getElementsByClassName('reset')) {
            item.value = '';
        }
    }

    // Set year for the first time
    if (lines.length === 1) {
        setYear(Utils.getLastYear(lines));
    }

    const getCategories = () => {
        return Object.keys(categories).map((category) => {
            return <option key={category} value={category}>{category}</option>;
        });
    }

    const getSubCategories = () => {
        if (subCategories === '') {
            return;
        }
        return subCategories.map((subCategories) => {
            return <option key={subCategories} value={subCategories}>{subCategories}</option>;
        });
    }

    const addName = type === "gastos" ? 'Añadir gasto' : 'Añadir ingreso';
    const addClass = type === "gastos" ? 'red u-full-width' : 'button-primary u-full-width';

    return (
        <>
            {error ? "Incorrecto" : null}
            <form onSubmit={addLine}>
                <div className="row">
                    <select onChange={setTypeHandler} className="four columns">
                        <option value="gastos">GASTO</option>
                        <option value="ingresos">INGRESO</option>
                    </select>
                    <select onChange={setCategoryHandler} className="four columns">
                        {getCategories()}
                    </select>
                    <select onChange={setSubCategoryHandler} className="four columns">
                        {getSubCategories()}
                    </select>
                </div>
                <div className="row">
                    <input onChange={setDateHandler} className="four columns"
                        type="date"
                        defaultValue={TODAY}
                    />
                    <input onChange={setDescriptionHandler} className="four columns reset"
                        type="text"
                        placeholder="Descripción"
                    />
                    <input onChange={setQuantityHandler} className="four columns reset"
                        type="text"
                        step="any"
                        placeholder="0.00"
                    />
                </div>
                <div className="row">
                    <input
                        type="submit"
                        className={addClass}
                        value={addName}
                    />
                </div>
            </form>
        </>
    );
}

export default AddRow;