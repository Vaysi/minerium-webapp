import type {NextPage} from 'next'
import {Grid} from "@mui/material";
import Header from "../components/header/header";
import PageTitle from "../components/inline-components/page-title";
import {Speed} from "@mui/icons-material";
import Footer from "../components/footer/footer";

const Dashboard: NextPage = () => {
    return (
        <Grid container>
            <Header/>
            <PageTitle title={"Earnings"} icon={<Speed style={{width: 35, height: "auto"}} /> }/>

            <Footer/>
        </Grid>
    );
};

export default Dashboard;
