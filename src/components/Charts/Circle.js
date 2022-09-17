import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import useLines from '../../hooks/useLines';
import useYear from '../../hooks/useYear';
import Utils from '../Utils';


function Circle() {
    // Context
    const { lines } = useLines([]);
    const { year } = useYear();

    let totalExpenses = 0;
    let totalIncome = 0;
    let total = 0;
    let expensesByYear = 0;
    let incomeByYear = 0;
    let totalByYear = 0;

    if (lines.length > 0) {
        // TODO LINES como contexto en UTILS
        totalExpenses = Utils.totalExpenses(lines);
        totalIncome = Utils.totalIncome(lines);
        total = totalIncome - totalExpenses;
        expensesByYear = Utils.expensesByYear(lines, year);
        incomeByYear = Utils.incomeByYear(lines, year);
        totalByYear = incomeByYear - expensesByYear;
    }

    const data = [
        { name: 'Gastos', value: totalExpenses },
        { name: 'Ingresos', value: totalIncome }
    ];

    const dataInYear = [
        { name: 'Gastos', value: expensesByYear },
        { name: 'Ingresos', value: incomeByYear }
    ];

    return (
        <div className='row'>
            <div className='six columns'>
                <strong>TOTAL</strong>
                <ul>
                    <li>Ingresos: {totalIncome} €</li>
                    <li>Gastos: {totalExpenses} €</li>
                    <li>Total: {total} €</li>
                </ul>
                <div style={{ width: '100%', height: 150 }}>
                    <ResponsiveContainer>
                        <PieChart width={100} height={100}>
                            <Pie
                                data={data}
                                innerRadius={30}
                                outerRadius={70}
                                paddingAngle={0}
                                dataKey="value"
                            >
                                <Cell key={'gastos'} fill={'red'} />
                                <Cell key={'ingresos'} fill={'green'} />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {(year !== 'all') && <div className='six columns'>
                <strong>{year}</strong>
                <ul>
                    <li>Ingresos: {incomeByYear} €</li>
                    <li>Gastos: {expensesByYear} €</li>
                    <li>Total: {totalByYear} €</li>
                </ul>
                <div style={{ width: '100%', height: 150 }}>
                    <ResponsiveContainer>
                        <PieChart width={100} height={100}>
                            <Pie
                                data={dataInYear}
                                innerRadius={30}
                                outerRadius={70}
                                paddingAngle={0}
                                dataKey="value"
                            >
                                <Cell key={'gastos'} fill={'red'} />
                                <Cell key={'ingresos'} fill={'green'} />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>}
        </div>

    );
}

export default Circle;
