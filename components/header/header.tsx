import type {NextPage} from 'next'
import {Container} from "@mui/material";
import TopHeader from "./top-header";
import Navigation from "./navigation";
import LogoWrapper from "./logoWrapper";

const Header = () => {
    return (
        <>
            <TopHeader/>
            <LogoWrapper />
            <Navigation />
        </>
    );
}

export default Header;
