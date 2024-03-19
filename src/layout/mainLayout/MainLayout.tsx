import  {ReactNode} from 'react'

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}
const MainLayout: React.FC<MainLayoutProps> = (layout:MainLayoutProps,className) => {
  
  return (
    <div className={`main-layout z-0 w-full h-screen flex justify-center items-center ${className}`}>
    {layout.children}    
  </div>
  )
}

export default MainLayout
