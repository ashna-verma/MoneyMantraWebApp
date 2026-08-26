import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { addThousandsSeparator } from "../util/util";

const CustomLineChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400">
                No data available
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">{data.date}</p>
                    <p className="text-sm text-purple-800 font-medium">
                        Total: ₹{addThousandsSeparator(data.cumulativeAmount)}
                    </p>
                    <div className="mt-2 border-t border-gray-200 pt-2">
                        {data.details && data.details.map((detail, index) => (
                            <p key={index} className="text-xs text-gray-600">
                                {detail.source}: ₹{addThousandsSeparator(detail.amount)}
                            </p>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    const yAxisDomain = [
        0,
        Math.max(...data.map(d => Number(d.cumulativeAmount) || 0), 100000) * 1.1
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.05} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                />
                <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                    domain={yAxisDomain}
                    tickFormatter={(value) => `₹${addThousandsSeparator(Math.round(value))}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                    type="monotone"
                    dataKey="cumulativeAmount"
                    stroke="#6d28d9"
                    strokeWidth={2}
                    dot={{ fill: "#6d28d9", r: 4 }}
                    activeDot={{ r: 6 }}
                    fill="url(#colorGradient)"
                    isAnimationActive={true}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default CustomLineChart;
