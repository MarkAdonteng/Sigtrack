import React from 'react'
import FirstSection from './FirstSection'
import FirstSectionContent from './FirstSectionContent'
import SecondSection from './SecondSection'
import SecondSectionContent from './SecondSectionContent'
import { useLogoutContext } from '../../Context/LogoutContext';


interface LeftLayoutProps {
  className?: string;
}


const LeftLayout: React.FC<LeftLayoutProps> = ({ className}) => {
  const { handleLogout } = useLogoutContext();
  return (
    <div  className={`left-layout flex flex-row ${className}`}>
     
        <FirstSection>
            <FirstSectionContent onLogout={ handleLogout}/>
        </FirstSection>

       <SecondSection>
            <SecondSectionContent/>
       </SecondSection>
    </div>
  )
}

export default LeftLayout