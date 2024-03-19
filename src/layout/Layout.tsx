import React from 'react'
import LeftLayout from './leftLayout/LeftLayout'
import MainLayout from './mainLayout/MainLayout'
import MainSectionContent from './mainLayout/MainLayoutContent'
import { RightLayoutProvider } from './rightLayout/RightLayoutContext'
import RightLayout from './rightLayout/RightLayout'
import RightLayoutContent from './rightLayout/RightLayoutContent'

const Layout = () => {
    return (
        <div>

            <LeftLayout/>

        {/* Main Layout */}
        <MainLayout className='md:w-1/2 md:h-full'>
            <MainSectionContent/>
        </MainLayout>

         {/* Right Layout */}
         <RightLayoutProvider>
            <RightLayout className='md:w-1/4 md:h-full'>
            <RightLayoutContent />
            </RightLayout>
        </RightLayoutProvider>

    
            
        </div>
    )
}

export default Layout
