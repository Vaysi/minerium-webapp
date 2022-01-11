import type { NextPage } from 'next'
import {Container, Grid} from "@mui/material";
import Header from "../components/header/header";

const Home: NextPage = () => {
  return (
      <Grid container>
          <Header />
      </Grid>
  );
};

export default Home;
