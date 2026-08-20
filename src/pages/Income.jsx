import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import { useEffect, useState } from "react";
import IncomeList from "../components/IncomeList";
import Model from "../components/Model";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import AddIncomeForm from "../components/AddIncomeForm";
import DeleteAlert from "../components/DeleteAlert";
import IncomeOverview from "../components/IncomeOverview";

const Income = () => {
    useUser();
    const [incomeData, setIncomeData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddIncomeModel, setOpenAddIncomeModel] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    //Fetch income details from the API
    const fetchIncomeDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
            if (response.status === 200) {
                setIncomeData(response.data);
            }
        }
        catch (error) {
            console.error("Error fetching income details:", error);
            toast.error(error.response?.data?.message || "Failed to fetch income details.");
        }
        finally {
            setLoading(false);
        }
    }

    // Fetch category details from Income
    const fetchIncomeCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_CATEGORY_BY_TYPE("income")); 
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Error fetching income categories:", error);
            toast.error(error.response?.data?.message || "Failed to fetch income categories.");
        }
    }

    //Save the income details to the API
    const handleAddIncome = async (income) => {
        console.log("Adding income:", income);
        const { name, amount, date, icon, categoryId } = income;

        //Validation checks for the income form fields
        if (!name.trim()) {
            toast.error("Please enter a valid income source name.");
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Please enter a valid income amount greater than 0.");
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
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {name, amount: Number(amount), date, icon, categoryId});
            if (response.status === 201) {
                toast.success("Income added successfully.");
                setOpenAddIncomeModel(false);
                fetchIncomeDetails();
                fetchIncomeCategories(); // Refresh categories after adding income
            }
        } catch (error) {
            console.error("Error adding income:", error);
            toast.error(error.response?.data?.message || "Failed to add income.");
        }
    };

    //Delete the income details from the API
    const deleteIncome = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
            toast.success("Income deleted successfully.");
            setOpenDeleteAlert({show: false, data: null});
            fetchIncomeDetails();
        } catch (error) {
            console.error("Error deleting income:", error);
            toast.error(error.response?.data?.message || "Failed to delete income.");
        }
    };

    const handleDownloadIncomeDetails= async() => {
        try{
            const response = await axiosConfig.get(API_ENDPOINTS.INCOME_EXCEL_DOWNLOAD, { responseType: 'blob' });
            let filename = "Income_details.xlsx";
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Income details downloaded successfully.");
        }
        catch(error){
            console.error("Error downloading income details:", error);
            toast.error("Failed to download income details.");
        }
    }

    const handleEmailIncomeDetails= async () => {
        try{
            const response = await axiosConfig.get(API_ENDPOINTS.INCOME_EMAIL);
            if (response.status === 200) {
                toast.success("Income details emailed successfully.");
            }
        }
        catch(error){
            console.error("Error emailing income details:", error);
            toast.error("Failed to email income details.");
        }
    }

    useEffect(() => {
        fetchIncomeDetails();
        fetchIncomeCategories();
    }, []);

    return (
        <Dashboard activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        {/*overview with line chart */}                       
                        <IncomeOverview transactions={incomeData} onAddIncome={() => setOpenAddIncomeModel(true)}/>
                    </div>

                    <IncomeList 
                        transactions={incomeData}
                        onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
                        onDownload={handleDownloadIncomeDetails}
                        onEmail={handleEmailIncomeDetails}
                    />

                    {/* Add Income modal */}
                    <Model 
                        isOpen={openAddIncomeModel}
                        onClose={() => setOpenAddIncomeModel(false)}
                        title="Add Income">

                        <AddIncomeForm 
                            onAddIncome={(income) => handleAddIncome(income)}
                            categories={categories}
                        />
                    </Model>

                    {/* Delete Income modal */}
                    <Model 
                        isOpen={openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({show: false, data: null})}
                        title="Delete Income">

                        <DeleteAlert 
                            content="Are you sure you want to delete this income details?"
                            onDelete={() => {
                                // Implement delete logic here
                                deleteIncome(openDeleteAlert.data);
                            }}
                        />
                    </Model>
                </div>
            </div>
        </Dashboard>
    )
}

export default Income;