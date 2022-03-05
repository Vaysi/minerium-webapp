import {Box, Container, Grid, Typography,} from "@mui/material";
import {makeStyles} from "@mui/styles";
import CustomCard from "../inline-components/card";


const useStyles: any = makeStyles((theme: any) => ({
    active: {
        fontWeight: "bold",
        color: "#CEA716",
        marginRight: 7,
        marginLeft: 7
    },
    offline: {
        fontWeight: "normal",
        color: "#043180",
        marginLeft: 7
    },
    firstBox: {
        fontSize: "28px",
        fontFamily: "Poppins",
        fontWeight: "bold",
        color: "#043180"
    },
    sub: {
        color: "var(--header)",
        fontWeight: "bold",
        fontSize: 22,
        fontFamily: "Montserrat"
    },
    main: {
        fontFamily: "Montserrat"
    },
}));

interface Props {
    info: any;
}

const AccountOverview = (props: Props) => {
    const styles = useStyles();

    return (
        <Grid container>
            <Container maxWidth={"xl"} style={{paddingLeft: 0, paddingRight: 0}}>
                <Grid container>
                    <Grid item xs={12}>
                        <Container maxWidth={"xl"}>
                            <Box sx={{marginTop: "50px"}} display={"flex"} justifyContent={"space-between"}>
                                <Typography className={styles.firstBox}>
                                    Account Overview
                                </Typography>
                                <Typography className={styles.firstBox} align={"right"}>
                                    Workers:
                                    <span className={styles.active}>
                                        {props.info.workers} Active
                                    </span>
                                    /
                                    <span className={styles.offline}>
                                        {props.info.offline_workers} Offline
                                    </span>
                                </Typography>
                            </Box>
                        </Container>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <CustomCard titleProps={{title: "Hashrate"}} align={"center"}>
                            <Box display={"flex"} justifyContent={"space-around"}>
                                <Typography align={"center"}>
                                    <span className={styles.main}>Real-Time</span> <br/>
                                    <big className={styles.sub}>{props.info.hash5m.toFixed(2)}
                                        <small style={{marginLeft: 5}}>TH/s</small></big>
                                    <br/>
                                    <big className={styles.sub} style={{fontSize: "23px"}}>&nbsp;</big>
                                </Typography>
                                <Typography align={"center"}>
                                    <span className={styles.main}>Average</span> <br/>
                                    <big className={styles.sub}>{props.info.hash1d.toFixed(2)}
                                        <small style={{marginLeft: 5}}>TH/s</small></big>
                                    <br/>
                                    <big className={styles.sub} style={{fontSize: "23px"}}>&nbsp;</big>
                                </Typography>
                            </Box>
                        </CustomCard>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <CustomCard titleProps={{title: "Earnings"}} align={"center"}>
                            <Box display={"flex"} justifyContent={"space-around"}>
                                <Typography align={"center"}>
                                    <span className={styles.main}>Total</span> <br/>
                                    <big className={styles.sub}>{props.info.workers} BTC</big>
                                    <br/>
                                    <big className={styles.sub} style={{fontSize: "23px"}}>7.5 $</big>
                                </Typography>
                                <Typography align={"center"}>
                                    <span className={styles.main}>Yesterday</span> <br/>
                                    <big className={styles.sub}>{props.info.offline_workers} BTC</big>
                                    <br/>
                                    <big className={styles.sub} style={{fontSize: "23px"}}>3.5 $</big>
                                </Typography>
                            </Box>
                        </CustomCard>
                    </Grid>
                </Grid>
            </Container>
        </Grid>
    );
}

export default AccountOverview;
