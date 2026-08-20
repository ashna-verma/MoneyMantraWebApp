export const addThousandsSeparator = (num) => {
    if (num === null || isNaN(num)) return "";

    // Convert number to string to handle decimals
    const numStr = num.toString();
    const parts = numStr.split("."); // Split into integer and fractional parts

    let integerPart = parts[0];
    let fractionalPart = parts[1];

    // Regex for Indian numbering system
    // It handles the first three digits, then every two digits

    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);

    if (otherNumbers !== "") {
        // Apply comma after every two digits for the 'otherNumbers' part
        const formattedOtherNumbers = otherNumbers.replace(
            /\B(?=(\d{2})+(?!\d))/g,
            ","
        );

        integerPart = formattedOtherNumbers + "," + lastThree;
    } else {
        integerPart = lastThree; // No change if less than 4 digits
    }

    // Combine integer and fractional parts
    return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
};

export const prepareIncomeLineChartData = (transactions) => {
    if (!transactions || transactions.length === 0) {
        return [];
    }

    // Group transactions by date
    const groupedByDate = {};
    let runningTotal = 0;

    transactions.forEach((transaction) => {
        const date = new Date(transaction.date);
        const dateLabel = date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short'
        }); // e.g., "6th Jul"

        if (!groupedByDate[dateLabel]) {
            groupedByDate[dateLabel] = {
                date: dateLabel,
                fullDate: transaction.date,
                amount: 0,
                cumulativeAmount: 0,
                details: []
            };
        }

        groupedByDate[dateLabel].amount += transaction.amount;
        groupedByDate[dateLabel].details.push({
            source: transaction.categoryName || transaction.category || 'Unknown',
            amount: transaction.amount
        });
    });

    // Convert to array and sort by date
    const chartData = Object.values(groupedByDate)
        .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))
        .map((item) => {
            runningTotal += item.amount;
            return {
                ...item,
                cumulativeAmount: runningTotal
            };
        });

    return chartData;
};