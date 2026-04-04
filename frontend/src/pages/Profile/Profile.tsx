import Account from "../../components/Account/Account";
import AuthGate from "../../components/AuthGate/AuthGate";

const Profile = () => {
    const isLoggedIn = !!localStorage.getItem("token");

    return isLoggedIn ? <Account /> : <AuthGate />;
};

export default Profile;
