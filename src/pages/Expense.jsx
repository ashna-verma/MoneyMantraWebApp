import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import { useEffect, useState } from "react";
import ExpenseList from "../components/ExpenseList";
import Model from "../components/Model";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import AddExpenseForm from "../components/AddExpenseForm";
import DeleteAlert from "../components/DeleteAlert";
import ExpenseOverview from "../components/ExpenseOverview";

const Expense = () => {
    useUser();
    const [expenseData, setExpenseData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddExpenseModel, setOpenAddExpenseModel] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    //Fetch expense details from the API
    const fetchExpenseDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
            if (response.status === 200) {
                setExpenseData(response.data);
            }
        }
        catch (error) {
            console.error("Error fetching expense details:", error);
            toast.error(error.response?.data?.message || "Failed to fetch expense details.");
        }
        finally {
            setLoading(false);
        }
    }

    // Fetch category details from Expense
    const fetchExpenseCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_CATEGORY_BY_TYPE("expense")); 
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Error fetching expense categories:", error);
            toast.error(error.response?.data?.message || "Failed to fetch expense categories.");
        }
    }

    //Save the expense details to the API
    const handleAddExpense = async (expense) => {
        console.log("Adding expense:", expense);
        const { name, amount, date, icon, categoryId } = expense;

        //Validation checks for the expense form fields
        if (!name.trim()) {
            toast.error("Please enter a valid expense source name.");
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Please enter a valid expense amount greater than 0.");
            return;
        }

        if (!date) {
            toast.error("Please select a date.");
            return;
        }

        // Validate that the date is not in the future
        const today= new Date().toISOString().split("T")[0];
        if (date > today) {
            toast.error("Date cannot be in the future.");
            return;
        }

        if (!categoryId) {
            toast.error("Please select a category.");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {name, amount: Number(amount), date, icon, categoryId});
            if (response.status === 201) {
                toast.success("Expense added successfully.");
                setOpenAddExpenseModel(false);
                fetchExpenseDetails();
                fetchExpenseCategories(); // Refresh categories after adding expense
            }
        } catch (error) {
            console.error("Error adding expense:", error);
            toast.error(error.response?.data?.message || "Failed to add expense.");
        }
    };

    //Delete the expense details from the API
    const deleteExpense = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
            toast.success("Expense deleted successfully.");
            setOpenDeleteAlert({show: false, data: null});
            fetchExpenseDetails();
        } catch (error) {
            console.error("Error deleting expense:", error);
            toast.error(error.response?.data?.message || "Failed to delete expense.");
        }
    };

    const handleDownloadExpenseDetails= async() => {
        try{
            const response = await axiosConfig.get(API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD, { responseType: 'blob' });
            let filename = "Expense_details.xlsx";
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Expense details downloaded successfully.");
        }
        catch(error){
            console.error("Error downloading expense details:", error);
            toast.error("Failed to download expense details.");
        }
    }

    const handleEmailExpenseDetails= async () => {
        try{
            const response = await axiosConfig.get(API_ENDPOINTS.EXPENSE_EMAIL);
            if (response.status === 200) {
                toast.success("Expense details emailed successfully.");
            }
        }
        catch(error){
            console.error("Error emailing expense details:", error);
            toast.error("Failed to email expense details.");
        }
    }

    useEffect(() => {
        fetchExpenseDetails();
        fetchExpenseCategories();
    }, []);

    return (
        <Dashboard activeMenu="Expense">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        {/*overview with line chart */}                       
                        <ExpenseOverview transactions={expenseData} onAddExpense={() => setOpenAddExpenseModel(true)}/>
                    </div>

                    <ExpenseList 
                        transactions={expenseData}
                        onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
                        onDownload={handleDownloadExpenseDetails}
                        onEmail={handleEmailExpenseDetails}
                    />

                    {/* Add Expense modal */}
                    <Model 
                        isOpen={openAddExpenseModel}
                        onClose={() => setOpenAddExpenseModel(false)}
                        title="Add Expense">

                        <AddExpenseForm 
                            onAddExpense={(expense) => handleAddExpense(expense)}
                            categories={categories}
                        />
                    </Model>

                    {/* Delete Expense modal */}
                    <Model 
                        isOpen={openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({show: false, data: null})}
                        title="Delete Expense">

                        <DeleteAlert 
                            content="Are you sure you want to delete this expense details?"
                            onDelete={() => {
                                // Implement delete logic here
                                deleteExpense(openDeleteAlert.data);
                            }}
                        />
                    </Model>
                </div>
            </div>
        </Dashboard>
    )

}

export default Expense;