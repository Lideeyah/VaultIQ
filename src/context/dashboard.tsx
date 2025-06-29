import React, { useContext } from "react"

interface DashboardContextProps{
    
}

const DashboardContext = React.createContext<DashboardContextProps | undefined>(undefined);

const DashboardContextProvider = ({children}: {children: React.ReactNode}) => {
    // const [DashboardState, setDashboardState] = React.useState<"loading" | "Dashboardenticated" | "unDashboardenticated">("loading");
    
    return <>{children}</>
}

export default DashboardContextProvider;


export const useDashboard = () => {
    const context = useContext(DashboardContext);

    if(!context){
        throw new Error("useDashboard must be used within its provider...")
    }

    return context;
}