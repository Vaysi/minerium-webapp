import type { NextPage } from 'next'
import {Container, Grid} from "@mui/material";
import Header from "../components/header/header";
import PageTitle from "../components/inline-components/page-title";
import {Home as HomeIcon} from "@mui/icons-material";

const Home: NextPage = () => {
  return (
      <Grid container>
          <Header />
          <PageTitle title={"Dashboard"} icon={<HomeIcon style={{width:35,height: "auto"}} />} />
      </Grid>
  );
};

export default Home;
