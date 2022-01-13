import type { NextPage } from 'next'
import {Box, Grid} from "@mui/material";
import Header from "../components/header/header";
import PageTitle from "../components/inline-components/page-title";
import {AccountBalanceWallet, Home as HomeIcon} from "@mui/icons-material";
import Footer from "../components/footer/footer";
import Tabs from "../components/inline-components/tabs";
import Balance from "../components/earnings/balance";

const Home: NextPage = () => {
    const tabLinks = [
        {
            title: 'earnings',
            link: "earnings",
            active: true
        },
        {
            title: "payments",
            link: "payments",
            active: false
        }
    ];
  return (
      <Grid container>
        <Header />
        <PageTitle title={"Earnings"} icon={<AccountBalanceWallet style={{width:35,height: "auto"}} />} />
        <Tabs data={tabLinks} />
        <Balance />
        <Footer />
      </Grid>
  );
};

export default Home;
