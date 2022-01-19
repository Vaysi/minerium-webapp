import type {NextPage} from 'next'
import {Box, Grid} from "@mui/material";
import Header from "../components/header/header";
import PageTitle from "../components/inline-components/page-title";
import {Home as HomeIcon} from "@mui/icons-material";
import Footer from "../components/footer/footer";
import {useContext} from "react";
import {userContext} from "../utils/context";

const Home: NextPage = () => {
    const {user} = useContext(userContext);
    return (
        <Grid container>
            <Header/>
            <PageTitle title={"Dashboard"} icon={<HomeIcon style={{width: 35, height: "auto"}}/>}/>
            <Box sx={{width: "100%", height: 300}}>
                {
                    user?.loggedIn ? user?.displayName : 'test'
                }
            </Box>
            <Footer/>
        </Grid>
    );
};

export default Home;
