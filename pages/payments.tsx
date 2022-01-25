import type { NextPage } from 'next'
import {Box, Grid} from "@mui/material";
import Header from "../components/header/header";
import PageTitle from "../components/inline-components/page-title";
import {Paid} from "@mui/icons-material";
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
            <Header />
            <PageTitle title={"Payments"} icon={<Paid style={{width:35,height: "auto"}} />} />
            <Tabs data={tabLinks} />
            <PaymentHistory />
            <Footer />
        </Grid>
    );
};

export default Home;
