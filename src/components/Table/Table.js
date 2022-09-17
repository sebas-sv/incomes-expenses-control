import React from 'react';
// Context
import useLines from '../../hooks/useLines';
// Table
import { useTable, useFilters, useGlobalFilter, usePagination } from 'react-table'
import DeleteButton from './DeleteButton';


function DefaultColumnFilter({
    column: { filterValue, setFilter },
}) {

    return (
        <input
            type='text'
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
            placeholder={`Buscar...`}
        />
    )
}

function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
}) {
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    return (
        <select
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value=""> - </option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}

function NumberRangeColumnFilter({
    column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
    React.useMemo(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        preFilteredRows.forEach(row => {
            min = Math.min(row.values[id], min)
            max = Math.max(row.values[id], max)
        })
        return [min, max]
    }, [id, preFilteredRows])

    return (
        <div className='row'>
            <input className='tiny'
                value={filterValue[0] || ''}
                type="number"
                onChange={e => {
                    const val = e.target.value
                    setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
                }}
                placeholder={`Desde`}
            />
            <input className='tiny'
                value={filterValue[1] || ''}
                type="number"
                onChange={e => {
                    const val = e.target.value
                    setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
                }}
                placeholder={`Hasta`}
            />{/* 
            <button className='three columns'
                onClick={() => setFilter(undefined)}>
                Limpiar
            </button> */}
        </div>
    )
}

function DateYearRangeColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
}) {
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id].split('-')[0])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    return (
        <select
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value=""> - </option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}

function CreateTable({ columns, data }) {
    const filterTypes = React.useMemo(
        () => ({
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id]
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }), []
    )

    const defaultColumn = React.useMemo(
        () => ({
            Filter: DefaultColumnFilter,
        }), []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        state,
        previousPage,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        nextPage,
        page,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            filterTypes,
            initialState: { pageIndex: 0 }
        },
        useFilters,
        useGlobalFilter,
        usePagination,
    )

    const { pageIndex, pageSize } = state;

    return (
        <>
            {/* DEBUG */}
            {/* <div>Showing the first {pageSize} results of {rows.length} rows</div>
            <div>
                <pre>
                    <code>{JSON.stringify(state.filters, null, 2)}</code>
                </pre>
            </div> */}

            <div className='row'>
                <div className='four columns'>
                    <span>
                        Página {" "}
                        <strong>
                            {pageIndex + 1} de {pageOptions.length} {" "}
                        </strong>
                        | Ir a la página:{" "}
                        <input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={(e) => {
                                const pageNumber = e.target.value
                                    ? Number(e.target.value) - 1
                                    : 0;
                                gotoPage(pageNumber);
                            }}
                            style={{ width: "50px" }}
                        />
                    </span>
                </div>
                <div className='six columns'>
                    &nbsp;
                </div>
                <div className='two columns'>
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                        {[10, 25, 50, 100].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Mostrar {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <table {...getTableProps()} >
                <thead>
                    {data.length > 0 && headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th style={{ textAlign: 'center' }}
                                    {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                                </th>
                            ))}
                            <th style={{ textAlign: 'center' }}>
                                <DeleteButton />
                            </th>
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td style={{ textAlign: 'center' }} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                                <td style={{ textAlign: 'center' }}>
                                    <input type="checkbox"
                                        name="deleteCheckbox"
                                        id={row.original.id}
                                        value={row.original.id} />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="row">
                <button className="three columns"
                    onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {"<<"}
                </button>
                <button className="three columns"
                    onClick={() => previousPage()} disabled={!canPreviousPage}>
                    ANTERIOR
                </button>
                <button className="three columns"
                    onClick={() => nextPage()} disabled={!canNextPage}>
                    SIGUIENTE
                </button>
                <button className="three columns"
                    onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {">>"}
                </button>
            </div>

        </>
    )
}

function Table() {
    const { lines } = useLines([]);

    const columns = [
        {
            Header: 'TIPO',
            accessor: 'type',
            Filter: SelectColumnFilter,
            filter: 'includes',
        },
        {
            Header: 'CATEGORÍA',
            accessor: 'category',
            Filter: SelectColumnFilter,
            filter: 'includes',
        },
        {
            Header: 'SUBCATEGORÍA',
            accessor: 'subcategory',
            Filter: SelectColumnFilter,
            filter: 'includes',
        },
        {
            Header: 'FECHA',
            accessor: 'date',
            Filter: DateYearRangeColumnFilter,
            filter: 'includes',
        },
        {
            Header: 'DESCRIPCIÓN',
            accessor: 'description',
        },
        {
            Header: 'CANTIDAD',
            accessor: 'quantity',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
        },
    ];

    return (
        <CreateTable columns={columns} data={lines} />
    )
}

export default Table;
