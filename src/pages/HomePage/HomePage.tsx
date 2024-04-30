import React, { useState } from 'react';
import GoogleAuth from '../../components/GoogleAuth';
import { Link } from 'react-router-dom';

const NAV_LINK_CLASS = "text-zinc-600 hover:text-black dark:text-zinc-300 dark:hover:text-white";
const INPUT_CLASS = "px-4 py-2 border border-zinc-300 rounded-md dark:bg-zinc-800 dark:border-zinc-700";
const BUTTON_CLASS = "px-4 py-2 rounded-md hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600";

const HomePage = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [googleAuthenticated, setGoogleAuthenticated] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleGoogleLogin = () => {
        console.log('Attempting Google login....');
        setGoogleAuthenticated(true);
      };

    const navigateToMesh = () => {
        window.open('/mesh', '_blank');
      };

    return (
        <div className="bg-white text-black dark:bg-zinc-900 dark:text-white">
            <nav className="bg-white dark:bg-zinc-900 shadow-md py-4">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className='flex'>
                            <div>
                                 <img
          src="/src/assets/images/SIGTRACK.png"  // Replace with the path to your image
          alt="Sigtrack Logo"
          className=" absolute left-16 top-0"      // Use mx-auto to center the image horizontally
          style={{ maxWidth: '50px' }}  // Set a maximum width for the image
        /> 
        
                            </div>
                        <div className="font-bold text-xl">Sigtrack
                        </div>
                        </div>
                        <div className="space-x-2">
                            <div className="relative inline-block text-left">
                                <button onClick={toggleDropdown} className={NAV_LINK_CLASS}>About Sigtrack</button>
                                {showDropdown && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" >
                                        <div className="py-1" role="none">
                                        {/* <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem"  id="menu-item-0">About the web app</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem"  id="menu-item-0">About the mobile app</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem"  id="menu-item-1">About the desktop app</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem"  id="menu-item-2">About the trailer</a> */}
                                            <Link to="/SigApp" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">About the web App</Link>
                                            <Link to="/SigApp" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">About the mobile App</Link>
                                            <Link to="/SigApp" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">About the desktop App</Link>
                                            <Link to="/SigApp" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">About the trailer</Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* <a href="#" className={NAV_LINK_CLASS}>Solutions</a>
                            <a href="#" className={NAV_LINK_CLASS}>Use cases</a>
                            <a href="#" className={NAV_LINK_CLASS}>Partners</a>
                            <a href="#" className={NAV_LINK_CLASS}>Contacts</a>
                            <a href="#" className={NAV_LINK_CLASS}>Radios</a>
                            <a href="#" className={NAV_LINK_CLASS}>Sigtrack with drones</a> */}
                            <Link to="/SigApp" className={NAV_LINK_CLASS}>Solutions</Link>
                            <Link to="/SigApp" className={NAV_LINK_CLASS}>Use Cases</Link>
                            <Link to="/SigApp" className={NAV_LINK_CLASS}>Partners</Link>
                            <Link to="/SigApp" className={NAV_LINK_CLASS}>Contacts</Link>
                            <Link to="/SigApp" className={NAV_LINK_CLASS}>Radios</Link>
                            <Link to="/SigApp" className={NAV_LINK_CLASS}>Sigtrack with drones</Link>
                        </div>
                    </div>
                </div>
            </nav>
            <header className="max-w-7xl mx-auto px-4 py-24 text-center">
                <div className='flex'>
                    <div>
                    <img
          src="/src/assets/images/SIGTRACK.png"  // Replace with the path to your image
          alt="Sigtrack Logo"
          className=" ml-20"      // Use mx-auto to center the image horizontally
          style={{ maxWidth: '300px' }}  // Set a maximum width for the image
        /> 
                    </div>
                <div className='text-left mt-10'>
                <h1 className="text-6xl font-bold">Welcome to SigtrackApp</h1>
                <p className="text-xl mt-4">Sigtrack: Your All-in-One Response Solution.Connect Radios, Command Trailers, and Drones seamlessly.Empowering Emergency Response, Anywhere.</p> 
                </div>
                </div>
               
                <div className="top-96 absolute ml-[500px]">
                    <Link to="/SigApp" className="bg-black text-white px-8 py-3 rounded-md mr-4 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-300">Get Started</Link>
                    <button className="bg-transparent border border-black text-black px-8 py-3 rounded-md hover:bg-zinc-200 dark:border-white dark:text-white dark:hover:bg-zinc-700">Learn more</button>
                </div>
               
            </header>
        </div>
    );
};

export default HomePage;
