import React from "react";
import { getCurrentUser } from "../../firebase/auth/signIn";

const Home: React.FC = () => {
    console.log(getCurrentUser());
    
    return (
        <div>
            <div className="text-green-500 text-4xl font-bold">Welcome to App</div>
        </div>
    )
}

export default Home;
