import React from 'react';
import useLines from '../../hooks/useLines';

const DeleteButton = () => {
    // Context
    const { setLines } = useLines([]);

    const handleDeleteButton = () => {
        document.getElementsByName("deleteCheckbox").forEach(checkbox => {
            if (checkbox.checked) {
                console.log('checkbox', checkbox)
                setLines(current =>
                    current.filter(line => {
                        if (line.id !== parseInt(checkbox.id)) {
                            console.log('parseInt(checkbox.id)', parseInt(checkbox.id))
                            console.log('line', line)
                        }
                        return line.id !== parseInt(checkbox.id);
                    })
                );
            }
        });
        document.getElementsByName("deleteCheckbox").forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    return (
        <>
            BORRAR
            <button class="btn" onClick={handleDeleteButton}>
                <i class="fa fa-trash"></i>
            </button>
        </>
    )

}

export default DeleteButton;