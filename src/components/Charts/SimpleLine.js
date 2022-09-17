import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useLines from '../../hooks/useLines';
import useYear from '../../hooks/useYear';
import Utils from '../Utils';


function SimpleLine() {

    // Context
    const { lines } = useLines([]);
    const { year, setYear } = useYear();
    const [check, setCheck] = useState(false);

    let array = [];

    const setArray = () => {
        if (lines.length > 0 && year !== 'all') {
            array = Utils.monthlyDataByYear(lines, year, check);
        }
        if (lines.length > 0 && year === 'all') {
            array = Utils.totalMonthlyData(lines, check)
        }
    }

    if (lines.length > 0) {
        setArray();
    }

    const handleYear = (e) => {
        setYear(e.target.value);
        //setArray();
    }

    const handleCheckbox = (e) => {
        setCheck(e.target.checked);
        //setArray();
    }


    return (
        <>
            <div className='row'>
                <div className="three columns">
                    &nbsp;
                </div>
                <div className="three columns">
                    <select name="year" onChange={handleYear}>
                        <option key='all' value='all'>TODOS</option>
                        {Utils.getYears(lines).map((yearItem) => {
                            if (yearItem === year) {
                                return <option key={yearItem} value={yearItem} selected>{yearItem}</option>
                            } else {
                                return <option key={yearItem} value={yearItem}>{yearItem}</option>
                            }
                        })}
                    </select>
                </div>
                <div className="one column">
                    <input id="check" type="checkbox" onChange={handleCheckbox} />
                </div>
                <div className="four columns" style={{ marginTop: "7px" }}>
                    <label htmlFor="check">Mostrar acumulado</label>
                </div>
            </div>
            {check
                ?
                <div style={{ width: '100%', height: 550 }}>
                    <ResponsiveContainer>
                        <LineChart data={array}>
                            <CartesianGrid strokeDasharray="2 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="gastos" stroke="red" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="ingresos" stroke="green" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                :
                <div style={{ width: '100%', height: 550 }}>
                    <ResponsiveContainer>
                        <LineChart data={array} >
                            <CartesianGrid strokeDasharray="2 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="gastos" stroke="red" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="ingresos" stroke="green" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            }
        </>
    );
}

export default SimpleLine;
