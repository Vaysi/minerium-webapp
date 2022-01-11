import type {NextPage} from 'next'
import {Container} from "@mui/material";
import TopHeader from "./top-header";
import Navigation from "./navigation";

const Header: NextPage = () => {
    return (
        <>
            <TopHeader/>
            <Navigation />
        </>
    );
}

export default Header;
