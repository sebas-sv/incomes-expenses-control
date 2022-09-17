
const MONTHS = {
    0: 'ene',
    1: 'feb',
    2: 'mar',
    3: 'abr',
    4: 'may',
    5: 'jun',
    6: 'jul',
    7: 'ago',
    8: 'sep',
    9: 'oct',
    10: 'nov',
    11: 'dic',
}

const getYears = (lines) => {
    if (!lines.length) {
        return;
    }

    const years = lines
        .map(line => { return line.date.split('-')[0]; });
    const yearsWithoutRepeats = years
        .filter((item, index) => { return years.indexOf(item) === index; });

    return yearsWithoutRepeats;
}

const getLastYear = (lines) => {
    if (!lines.length) {
        return;
    }

    const years = getYears(lines);

    return years[0];
}

const totalExpenses = (lines) => {
    return lines
        .filter(line => { return line.type === "gastos"; })
        .map(line => { return line.quantity })
        .reduce((acc, quantity) => { return acc + quantity; }, 0);
}

const totalIncome = (lines) => {
    return lines
        .filter(line => { return line.type === "ingresos"; })
        .map(line => { return line.quantity })
        .reduce((acc, quantity) => { return acc + quantity; }, 0);
}

const expensesByYear = (lines, year) => {
    return lines
        .filter(line => { return line.type === "gastos" && line.date.split('-')[0] === year; })
        .map(line => { return line.quantity })
        .reduce((acc, quantity) => { return acc + quantity; }, 0);
}

const incomeByYear = (lines, year) => {
    return lines
        .filter(line => { return line.type === "ingresos" && line.date.split('-')[0] === year; })
        .map(line => { return line.quantity })
        .reduce((acc, quantity) => { return acc + quantity; }, 0);
}

const monthlyDataByYear = (lines, year, accumulate) => {
    let array = [];

    let expenseLines = lines
        .filter(line => { return line.date.split('-')[0] === year; })
        .map(line => { return { 'type': line.type, 'quantity': line.quantity, 'month': new Date(line.date).getMonth() } })
        .reduce((acc, current) => {
            let month = current.month.toString();
            if (current.type === "gastos") {
                acc[month + '-gastos'] = acc[month + '-gastos'] + current.quantity || current.quantity;
            }
            if (current.type === "ingresos") {
                acc[month + '-ingresos'] = acc[month + '-ingresos'] + current.quantity || current.quantity;
            }
            return acc;
        }, {})

    Object.keys(expenseLines).forEach(key => {
        let monthId = key.split('-')[0];
        let monthName = MONTHS[monthId];
        let type = [key.split('-')[1]];
        let sum = expenseLines[key];
        let object = { 'ingresos': 0, 'gastos': 0 };

        const position = array.findIndex(item => item.id === monthId);
        // Si existe añade prop, si no añade objeto completo
        if (position > -1) {
            array[position][type] = sum;
        } else {
            object['id'] = monthId;
            object['name'] = monthName;
            object[type] = sum;
            array.push(object)
        }
    })

    // Fill empty months
    for (let i = 0; i < 12; i++) {
        let id = i.toString();
        let exist = array.find(item => item.id === id);

        if (!exist) {
            let newObject = {};
            let monthName = MONTHS[i];

            newObject['ingresos'] = 0;
            newObject['gastos'] = 0;
            newObject['id'] = id;
            newObject['name'] = monthName;
            array.push(newObject)
        }
    }

    // Sort
    array.sort((a, b) => a.id - b.id)

    if (accumulate) {
        let incomeAcc = 0;
        let expenseAcc = 0;
        array.map(item => {
            item.ingresos = item.ingresos + incomeAcc;
            incomeAcc = item.ingresos;
            item.gastos = item.gastos + expenseAcc;
            expenseAcc = item.gastos;
            return item;
        })
    }

    return array;
}

const totalMonthlyData = (lines, accumulate) => {
    let array = [];

    let expenseLines = lines
        .map(line => { return { 'type': line.type, 'quantity': line.quantity, 'month': new Date(line.date).getMonth(), 'year': new Date(line.date).getFullYear() } })
        .reduce((acc, current) => {
            let year = current.year.toString();
            let month = current.month.toString();
            if (current.type === "gastos") {
                acc[year + '-' + month + '-gastos'] = acc[year + '-' + month + '-gastos'] + current.quantity || current.quantity;
            }
            if (current.type === "ingresos") {
                acc[year + '-' + month + '-ingresos'] = acc[year + '-' + month + '-ingresos'] + current.quantity || current.quantity;
            }
            return acc;
        }, {})

    Object.keys(expenseLines).forEach(key => {
        let year = key.split('-')[0];
        let monthId = key.split('-')[1];
        let monthName = MONTHS[monthId];
        let type = [key.split('-')[2]];
        let sum = expenseLines[key];
        let object = { 'ingresos': 0, 'gastos': 0 };

        let monthString = (monthId < 10) ? '0' + monthId.toString() : monthId.toString();
        const position = array.findIndex(item => item.id === year + '-' + monthString);
        // Si existe añade prop, si no añade objeto completo
        if (position > -1) {
            array[position][type] = sum;
        } else {
            object['id'] = year + '-' + monthString;
            object['name'] = "'" + year.slice(2, 4) + '-' + monthName;
            object[type] = sum;
            array.push(object)
        }
    })

    // Sort
    array.sort().reverse();

    // Fill empty months
    let firstDate = array[0].id;
    let lastDate = array[array.length - 1].id;

    let fillValue = firstDate;
    let year = firstDate.split('-')[0];
    let monthId = firstDate.split('-')[1];

    while (lastDate !== fillValue) {
        if (monthId !== 11) {
            monthId++
        } else {
            year++;
            monthId = 0;
        }

        let monthString = (monthId < 10) ? '0' + monthId.toString() : monthId.toString();
        fillValue = year + '-' + monthString;

        let test = fillValue;
        let exist = array.find(item => item.id === test);

        if (!exist) {
            let newObject = {};
            let monthName = MONTHS[monthId];

            newObject['ingresos'] = 0;
            newObject['gastos'] = 0;
            newObject['id'] = fillValue;
            newObject['name'] = "'" + year.toString().slice(2, 4) + '-' + monthName;
            array.push(newObject)
        }
    }

    // Sort
    array.sort((a, b) => (a.id < b.id) ? -1 : ((b.id > a.id) ? 1 : 0))

    if (accumulate) {
        let incomeAcc = 0;
        let expenseAcc = 0;
        array.map(item => {
            item.ingresos = item.ingresos + incomeAcc;
            incomeAcc = item.ingresos;
            item.gastos = item.gastos + expenseAcc;
            expenseAcc = item.gastos;
            return item;
        })
    }

    return array;
}

const Utils = {
    MONTHS,
    getYears,
    getLastYear,
    totalExpenses,
    totalIncome,
    expensesByYear,
    incomeByYear,
    monthlyDataByYear,
    totalMonthlyData,
}


export default Utils;