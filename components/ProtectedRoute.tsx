import { useRouter } from "next/router"
import {isLoggedIn} from "axios-jwt";

const ProtectedRoute = (ProtectedComponent:any,forUsers:boolean) => {

    const HOC =  (props:any) => {

        if (typeof window !== "undefined") {
            const Router = useRouter()


            if(forUsers){
                if (isLoggedIn()) {
                    Router.push("/");
                    return null
                } else {
                    return <ProtectedComponent {...props} />;
                }
            }else {
                if (!isLoggedIn()) {
                    Router.push("/auth/login");
                    return null
                } else {
                    return <ProtectedComponent {...props} />;
                }
            }
        }

        return null
    }
    HOC.displayName = 'ProtectedRoute';
    return HOC;
}

export default ProtectedRoute