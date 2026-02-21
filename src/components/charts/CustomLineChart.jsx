import React from 'react'
import {
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart
} from 'recharts'

const CustomLineChart = ({ data = [] }) => {


    const customTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                    <p className="text-sm font-semibold text-purple-800 mb-1">
                        {label}
                    </p>
                    <p className="text-sm text-gray-600">
                        Amount:{" "}
                        <span className="font-medium text-gray-500">
                            ${payload[0].value}
                        </span>
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    width="100%"
                    height="100%"
                    data={data}
                >
                    <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#875CF5" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#875CF5" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={customTooltip} />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#875CF5"
                        fill="url(#incomeGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>

        </div >
    )
}

export default CustomLineChart
