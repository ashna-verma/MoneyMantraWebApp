import { useEffect, useState } from "react"
import Input from "../components/Input.jsx";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import { LoaderCircle } from "lucide-react";

const AddIncomeForm = ({onAddIncome, initialIncomeData, isEditing, categories}) =>{
    const [income, setIncome] = useState({
        name: "",
        amount: "",
        date: "",
        icon: "",
        categoryId: ""
    })
    const [loading, setLoading] = useState(false);

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name
    }))

    const handleChange = (key, value) => {
        setIncome({...income, [key]: value});
    }

    const handleAddIncome = async() => {
        setLoading(true);
        try{
            await onAddIncome(income);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect( () =>{
        if (categories.length > 0 && !income.categoryId) {
            setIncome(prevIncome => ({
                ...prevIncome,
                categoryId: categories[0].id
            }));
    }
    }, [categories, income.categoryId]);

    return(
        <div>
            <EmojiPickerPopup
                icon={income.icon}
                onSelect = {(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value= {income.name}
                onChange= {({target}) => handleChange("name", target.value)}
                label="Income Source"
                placeholder= "e.g., Freelance, Salary, Bonus"
                type= "text"
            />

            <Input
                value= {income.categoryId}
                onChange= {({target}) => handleChange("categoryId", target.value)}
                label="Category"
                isSelect= {true}
                options= {categoryOptions}
            />

            <Input
                value= {income.amount}
                onChange= {({target}) => handleChange("amount", target.value)}
                label="Amount"
                placeholder= "e.g., 5000"
                type= "number"
            />

            <Input
                value= {income.date}
                onChange= {({target}) => handleChange("date", target.value)}
                label="Date"
                placeholder= ""
                type= "date"
            />

            <div className="flex justify-end mt-6">
                <button 
                    className="add-btn add-btn-fill"
                    disabled={loading}
                    onClick= {handleAddIncome}>
                    {loading ? (
                        <>
                        <LoaderCircle className="w-4 h-4 animate-spin" /> 
                        Adding...
                        </>
                    ) : (
                        <>
                        Add Income
                        </>
                    )}   
                </button>
            </div>

        </div>
    )
}

export default AddIncomeForm;