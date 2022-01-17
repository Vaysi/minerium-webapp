import type { NextPage } from 'next'
import {Grid} from "@mui/material";
import Header from "../components/header/header";
import PageTitle from "../components/inline-components/page-title";
import {Computer} from "@mui/icons-material";
import Footer from "../components/footer/footer";
import WorkersList from "../components/workers/list";

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
        <Header />
        <PageTitle title={"Workers"} icon={<Computer style={{width:35,height: "auto"}} />} />
        <WorkersList />
        <Footer />
      </Grid>
  );
};

export default Home;
