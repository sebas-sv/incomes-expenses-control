import React, { useState } from 'react';
import LinesContext from './contexts/LinesContext';
import Table from './components/Table/Table';
import AddRow from './components/Table/AddRow';
import OpenFile from './components/Table/OpenFile';
import SaveFile from './components/Table/SaveFile';
import Circle from './components/Charts/Circle';
import SimpleLine from './components/Charts/SimpleLine';
import YearContext from './contexts/YearContext';

function App() {


  const [lines, setLines] = useState([]);
  const [year, setYear] = useState();
  // Ordena por fechas
  lines.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const visible = lines.length > 0;



  return (
    <LinesContext.Provider value={{ lines, setLines }}>
      <YearContext.Provider value={{ year, setYear }}>
        <header>
          <p className='title'>Control de ingresos y gastos personales</p>
        </header>

        <div className='container'>

          <div className="row">
            <div className="six columns">
              <AddRow />
              {visible && <Circle year={year} />}
              <div className="row operations">
                <div className="six columns">
                  <OpenFile />
                </div>
                <div className="six columns">
                  <SaveFile />
                </div>
              </div>
            </div>
            <div className="six columns">
              {visible && <SimpleLine year={year} />}
            </div>
          </div>

          <div className="row section">
            <div>
              {visible && <Table />}
            </div>
          </div>

        </div>

      </YearContext.Provider>
    </LinesContext.Provider >
  );
}

export default App;
