import React from 'react';
import useYear from '../../hooks/useYear';
import SimpleLine from './SimpleLine';

const Charts = () => {

    const { year } = useYear();

    return (
        <>
            <div className="row">
                <div >
                    <h3>Año {year}</h3>
                </div>
            </div>
            <div className="row">
                <SimpleLine year={year} />
            </div>
        </>
    );
}

export default Charts;