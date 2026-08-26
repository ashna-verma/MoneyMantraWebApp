import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const CustomPieChart = ({ data, label, totalAmount, colors, showTextAnchor }) => {
    return (
        <div>
            <ResponsiveContainer width="100%" height={380}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="amount"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={100}
                        outerRadius={130}
                        paddingAngle={0}
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>

                    {showTextAnchor && (
                        <>
                            <text
                                x="50%"
                                y="47%"
                                textAnchor="middle"
                                fill="#6b7280"
                                fontSize="14px"
                            >
                                {label}
                            </text>
                            <text
                                x="50%"
                                y="54%"
                                textAnchor="middle"
                                fill="#1f2937"
                                fontSize="28px"
                                fontWeight="600"
                            >
                                {totalAmount}
                            </text>
                        </>
                    )}
                </PieChart>
            </ResponsiveContainer>

            {/* Custom legend, matching order/colors of `data` */}
            <div className="flex justify-center gap-6 mt-2">
                {data.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                        <span
                            className="w-3 h-3 rounded-full inline-block"
                            style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <span className="text-sm text-gray-700">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomPieChart;