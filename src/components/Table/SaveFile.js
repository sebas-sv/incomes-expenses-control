import React from 'react';
import useLines from '../../hooks/useLines';
import exportFromJSON from 'export-from-json';




const SaveFile = () => {

    const { lines } = useLines([]);
    const data = lines;
    const fileName = 'download';
    const exportType = exportFromJSON.types.json;

    const handleClick = () => {
        exportFromJSON({ data, fileName, exportType })
    }

    return (
        <>
            {(lines.length > 0)
                ? <button onClick={handleClick} className='u-full-width'> Exportar JSON</button>
                : ''
            }
        </>
    );
}

export default SaveFile;