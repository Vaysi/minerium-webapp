import {Box, Container, Grid, Typography, useMediaQuery,} from "@mui/material";
import {makeStyles, useTheme} from "@mui/styles";
import CustomCard from "../inline-components/card";
import {useRouter} from "next/router";


const useStyles: any = makeStyles((theme: any) => ({
    firstBox: {
        fontSize: "28px",
        fontFamily: "Poppins",
        fontWeight: "bold",
        color: "#043180",
        "[data-theme=dark] &": {
            color: "#fff",
        },
        "@media (max-width: 760px)": {
            fontSize: "15px"
        },
        "@media (min-width: 1980px)": {
            fontSize: "34px"
        },
    },
    sub: {
        color: "var(--header)",
        fontWeight: "bold",
        fontSize: 22,
        fontFamily: "var(--font-body)",
        "@media (max-width: 350px)": {
            fontSize: 18
        },
        "[data-theme=dark] &": {
            color: "#fff",
        },
        "@media (min-width: 1980px)": {
            fontSize: "28px"
        },
    },
    main: {
        fontFamily: "var(--font-body)",
        "@media (max-width: 350px)": {
            fontSize: "0.8rem"
        },
        "@media (min-width: 1980px)": {
            fontSize: "25px"
        },
        "[data-theme=dark] &": {
            color: "#fff",
            opacity: 0.7,
        },
    },
}));

interface Props {
    info: any;
}

const AccountOverview = (props: Props) => {
    const styles = useStyles();
    const router = useRouter();
    const theme = useTheme();
    //@ts-ignore
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Grid container>
            <Container maxWidth={"xl"} style={{paddingLeft: 0, paddingRight: 0}}>
                <Grid container>
                    <Grid item xs={12}>
                        <Container maxWidth={"xl"}>
                            <Box sx={{marginTop: matches ? "20px" : "50px"}} display={"flex"} justifyContent={"space-between"}>
                                <Typography className={styles.firstBox}>
                                    Account Overview
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
                                </Typography>
                                <Typography align={"center"}>
                                    <span className={styles.main}>Average</span> <br/>
                                    <big className={styles.sub}>{props.info.hash1d.toFixed(2)}
                                        <small style={{marginLeft: 5}}>TH/s</small></big>
                                </Typography>
                            </Box>
                        </CustomCard>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <CustomCard titleProps={{title: "Workers",style:{cursor:"pointer"} }} align={"center"} cardProps={{
                            onClick: () => router.push('/workers')
                        }}>
                            <Box display={"flex"} justifyContent={"space-around"}>
                                <Typography sx={{cursor:"pointer"}} align={"center"}>
                                    <span className={styles.main}>All</span> <br/>
                                    <big className={styles.sub}>{props.info.workers}</big>
                                </Typography>
                                <Typography sx={{cursor:"pointer"}} align={"center"} onClick={() => router.push('/workers?filter=online')}>
                                    <span className={styles.main}>Active</span> <br/>
                                    <big className={styles.sub}>{props.info.workers - props.info.offline_workers}</big>
                                </Typography>
                                <Typography sx={{cursor:"pointer"}} align={"center"}  onClick={() => router.push('/workers?filter=offline')}>
                                    <span className={styles.main}>Offline</span> <br/>
                                    <big className={styles.sub}>{props.info.offline_workers}</big>
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
