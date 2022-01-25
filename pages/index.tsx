import type {NextPage} from 'next'
import {useRouter} from "next/router";
import {useContext, useEffect} from "react";
import {userContext} from "../utils/context";
const Home: NextPage = () => {
    const router = useRouter();
    const {user} = useContext(userContext);
    useEffect(() => {
        if(user?.loggedIn){
            router.push('/dashboard');
        }else {
            router.push('/auth/login');
        }
    },[]);
    return (
        <>
        </>
    );
};

export default Home;
