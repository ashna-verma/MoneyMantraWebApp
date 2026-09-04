import { Coins, Wallet, WalletCards } from "lucide-react";
import Dashboard from "../components/Dashboard";
import InfoCard from "../components/InfoCard";
import { useUser } from "../hooks/useUser";
import { addThousandsSeparator } from "../util/util";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import RecentTransactions from "../components/RecentTransactions";
import FinanceOverview from "../components/FinanceOverview";
import Transactions from "../components/Transactions";
import AIInsightsCard from "../components/AiInsightsCard";

const Home = () => {
    useUser();

    const navigate = useNavigate();
    const [dashboardData, setDashboardData]= useState(null);
    const [loading, setLoading]= useState(false);

    const fetchDashboardData = async () => {
        if (loading) return;

        setLoading(true);

        try{
            const response= await axiosConfig.get(API_ENDPOINTS.DASHBOARD_DATA);
            if (response.status=== 200){
                setDashboardData(response.data);
            }
        }
        catch(error){
            console.error("Something went wrong while fetching the Dashboard data");
            toast.error('Something went wrong!');
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData();
        return () => {};
    }, []);

    return (
        <div>
            <Dashboard activeMenu="Dashboard">
                <div className="my-5 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Display the card */}
                        <InfoCard 
                            icon={<WalletCards />}
                            label= "Total Balance"
                            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
                            color="bg-purple-800"
                        />
                        <InfoCard 
                            icon={<Wallet />}
                            label= "Total Income"
                            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
                            color="bg-green-800"
                        />
                        <InfoCard 
                            icon={<Coins />}
                            label= "Total Expense"
                            value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
                            color="bg-red-800"
                        />
                    </div>
                    {/* Recent Transactions + Finance Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                        <RecentTransactions
                            transactions={dashboardData?.recentTransactions}
                            onMore={() => navigate("/expense")}
                        />

                        <FinanceOverview
                            totalBalance={dashboardData?.totalBalance || 0}
                            totalIncome={dashboardData?.totalIncome || 0}
                            totalExpense={dashboardData?.totalExpense || 0}
                        />

                    </div>


                    {/* AI Financial Insights */}
                    <div className="mt-6">
                        <AIInsightsCard />
                    </div>


                    {/* Recent Expenses + Income */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                        <Transactions
                            transactions={dashboardData?.recent5Expenses || []}
                            onMore={() => navigate("/expense")}
                            type="expense"
                            title="Recent Expenses"
                        />

                        <Transactions
                            transactions={dashboardData?.recent5Incomes || []}
                            onMore={() => navigate("/income")}
                            type="income"
                            title="Recent Incomes"
                        />

                    </div>
                </div>
            </Dashboard>
        </div>
    )
}

export default Home;