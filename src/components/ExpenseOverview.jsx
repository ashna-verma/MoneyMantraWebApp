import React, { useEffect, useState } from "react";
import CustomLineChart from "./CustomLineChart";
import { prepareIncomeLineChartData } from "../util/util.js";
import { Plus } from "lucide-react";

const ExpenseOverview = ({transactions, onAddExpense}) => {

    const [chartData, setChartData] = useState([]);
    useEffect(() => {
        const result= prepareIncomeLineChartData(transactions);
        console.log("result", result);
        setChartData(result);

        return () => {};
    }, [transactions]);

    return (
        <div className="card p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h5 className="text-lg">Expense Overview</h5>
                    <p className="text-xs text-gray-400 mt-0 5">
                        Track your expense and visualize your financial growth over time.
                    </p>
                </div>

                <button className="add-btn" onClick={onAddExpense}>
                            <Plus size={15} className="text-lg" />Add Expense
                </button>
                
            </div>
            <div className="mt-10">
                <CustomLineChart data={chartData} />
                    
            </div>
        </div>
    )
}

export default ExpenseOverview;