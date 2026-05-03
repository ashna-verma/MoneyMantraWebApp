import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";

const Category = () => {
    useUser();
    return (
        <Dashboard activeMenu="Category">
                This is category page
        </Dashboard>
    )
}

export default Category;