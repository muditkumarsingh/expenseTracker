import React, { useEffect, useState } from 'react'
import { prepareExpenseLineChartData } from '../../utils/helper';
import { LuPlus } from 'react-icons/lu';
import CustomLineChart from '../charts/CustomLineChart';

const ExpenseOverview = ({transactions,onExpenseAdd}) => {
    
    const [chartData,setChartData] = useState([]);

    useEffect(()=>{
        const result = prepareExpenseLineChartData(transactions);
        setChartData(result);

        return () =>{}
    },[transactions])

    console.log(chartData)

    return (
        <div className='card w-full'>
            <div className="flex items-center justify-between">
                <div className="">
                    <h5 className="text-lg">Expense OverView</h5>
                    <p className='text-sm text-gray-400 mt-0.5'>
                        Track your spending trends over time and gain insight on where your money goes
                    </p>
                </div>

                <button className='add-btn' onClick={onExpenseAdd}>
                    <LuPlus className='text-lg'/>
                    Add Expense
                </button>
            </div>

            <div className="mt-10 w-full">
                <CustomLineChart data={chartData} />
            </div>
        </div>
    )
}

export default ExpenseOverview
