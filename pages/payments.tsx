import type {NextPage} from 'next'
import {Grid} from "@mui/material";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import Tabs from "../components/inline-components/tabs";
import PaymentHistory from "../components/payments/history";

const Home: NextPage = () => {
    const tabLinks = [
        {
            title: 'earnings',
            link: "earnings",
            active: false
        },
        {
            title: "payments history",
            link: "payments",
            active: true
        }
    ];
    return (
        <Grid container>
            <Header/>
            <Tabs data={tabLinks}/>
            <PaymentHistory/>
            <Footer/>
        </Grid>
    );
};

export default Home;
