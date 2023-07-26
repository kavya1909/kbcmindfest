import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import Profile from '../pages/Profile';

import Home from '../pages/Home';
import Quiz from '../Test-system/TestSystem';
import LandingPage from '../pages/LandingPage';
import InsightsPage from "../pages/InsightPage/Insights"
import Tests from "../pages/Tests/Tests";


const AppRoutes = () => {
    return (
        <Routes >
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/create-test" element={<Home/>}/>
            <Route path="/profile" element={<Profile/>}/>
            
            <Route path="/test/:test_id" element={<Quiz/>}/>
            <Route path="/tests-available" element={<Tests/>}/>
            <Route path = "/insights" element={<InsightsPage/>}/>
        </Routes>
    );
}

export default AppRoutes;
