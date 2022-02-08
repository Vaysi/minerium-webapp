import type {NextPage} from 'next'
import {Grid} from "@mui/material";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import Tabs from "../components/inline-components/tabs";
import Balance from "../components/earnings/balance";
import History from "../components/earnings/history";

const Home: NextPage = () => {
    const tabLinks = [
        {
            title: 'earnings',
            link: "earnings",
            active: true
        },
        {
            title: "payments history",
            link: "payments",
            active: false
        }
    ];
    return (
        <Grid container>
            <Header/>
            <Tabs data={tabLinks}/>
            <Balance/>
            <History/>
            <Footer/>
        </Grid>
    );
};

export default Home;
