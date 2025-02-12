import { useSelector } from "react-redux"

import AppRoute from "./AppRoute"
import AuthRoute from "./authroute";



const MainRouter = ()=>{
    const token = useSelector((state) => state.authroute.token) || localStorage.getItem("token");
    return  token ? <AppRoute/> :<AuthRoute/> 
    

}

export default MainRouter