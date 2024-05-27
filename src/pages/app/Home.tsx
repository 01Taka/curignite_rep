import React from "react";
import SampleCounterComponent from "../../components/SampleCounterComponent";

const Home: React.FC = () => {
    return (
        <div>
            <div className="text-green-500 text-4xl font-bold">Welcome to App</div>
            <SampleCounterComponent />
        </div>
    )
}

export default Home;
