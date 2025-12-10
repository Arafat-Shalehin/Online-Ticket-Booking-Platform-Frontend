import React from 'react';
import Hero from './Pages/Home/Hero';
import Advertisement from './Pages/Home/Advertisement';
import LatestTickets from './Pages/Home/LatestTickets';
import PopularPlaces from './Pages/Home/PopularPlaces';
const App = () => {
    return (
        <div>
            <Hero></Hero>
            <Advertisement></Advertisement>
            <LatestTickets></LatestTickets>
            <PopularPlaces></PopularPlaces>
        </div>
    );
};

export default App;