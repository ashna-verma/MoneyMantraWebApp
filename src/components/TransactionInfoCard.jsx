import { UtensilsCrossed, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { addThousandsSeparator } from "../util/util";

const TransactionInfoCard = ({icon, title, date, amount, type, hideDeleteBtn, onDelete}) => {
    const getAmountStyles = () => type === "income" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800";
    return (
        <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60">
            <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
                {icon? (
                    <img src={icon} alt={title} className="w-6 h-6" />
                ) :(
                    <UtensilsCrossed size={20} className="text-purple-800" />
                )}
            </div>

            <div className="flex-1 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-800">{title}</p>
                    <p className="text-xs text-gray-500">{date}</p>
                </div>

                <div className="flex items-center gap-2">
                    {!hideDeleteBtn && (
                        <button 
                            className="text-gray-500 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={onDelete}>
                            <Trash2 size={18} />
                        </button>
                    )}

                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}>
                    <h6 className="text-sm font-medium">
                        {type === "income" ? "+" : "-"} ₹{addThousandsSeparator(amount)}
                    </h6>
                    {type === "income" ? (
                        <TrendingUp size={16} className="text-green-800" />
                    ) : (
                        <TrendingDown size={16} className="text-red-800" />
                    )}
                </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionInfoCard;