import React from 'react'
import FirstSection from './FirstSection'
import FirstSectionContent from './FirstSectionContent'
import SecondSection from './SecondSection'
import SecondSectionContent from './SecondSectionContent'


interface LeftLayoutProps {
  className?: string;
}


const LeftLayout: React.FC<LeftLayoutProps> = ({ className}) => {
  return (
    <div  className={`left-layout flex flex-row ${className}`}>
     
        <FirstSection>
            <FirstSectionContent/>
        </FirstSection>

       <SecondSection>
            <SecondSectionContent/>
       </SecondSection>
    </div>
  )
}

export default LeftLayout