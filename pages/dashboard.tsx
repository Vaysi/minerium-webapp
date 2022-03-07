import type {NextPage} from 'next'
import {
    Backdrop,
    Button,
    CircularProgress,
    Container,
    Divider,
    Grid,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import Header from "../components/header/header";
import {ContentCopy} from "@mui/icons-material";
import Footer from "../components/footer/footer";
import {useCallback, useContext, useEffect, useState} from "react";
import {userContext} from "../utils/context";
import useWebSocket from "react-use-websocket";
import env from "../utils/env";
import CustomCard from "../components/inline-components/card";
import {hasJsonStructure} from "../utils/functions";
import {getAccessToken} from "axios-jwt";
import {makeStyles} from "@mui/styles";
import HashChart from "../components/dashboard/chart";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import AccountOverview from "../components/dashboard/overview";
import CoinsTable from "../components/dashboard/coinsTable";

const useStyles: any = makeStyles((theme: any) => ({
    primary: {
        color: "var(--header)",
        fontWeight: "bold",
        fontSize: 20,
        "@media (max-width: 800px)": {
            fontSize: "1rem",
        },
    },
    secondary: {
        color: "var(--header)",
        fontWeight: "bold",
        fontSize: 22
    },
    customBtn: {
        backgroundColor: "#D4E2F4",
        border: "2px solid rgba(4, 48, 126, 0.27)",
        borderRadius: 15,
        color: "#043180",
        fontWeight: 600,
        boxShadow: "none",
        fontFamily: "Montserrat",
        "&:hover": {
            backgroundColor: "#D4E2F4",
        }
    },
    bodyFont: {
        "@media (max-width: 800px)": {
            fontSize: "0.9rem",
        },
    }
}));

const Dashboard: NextPage = () => {
    const router = useRouter();
    const styles = useStyles();
    const [messageHistory, setMessageHistory] = useState([]);
    const [socketFiler, setSocketFilter] = useState<"day" | "hour">('day');
    const [dashboardData, setDashboardData] = useState({
        graphDay: [],
        graphHour: [],
        info: {
            hash1d: 0,
            hash1m: 0,
            hash5m: 0,
            offline_workers: 0,
            workers: 0
        },
        userEarning: []
    });
    const {user} = useContext(userContext);

    const getSocketUrl = useCallback(() => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(env.SOCKET_URL);
            }, 2000);
        });
    }, []);

    const {
        sendMessage,
        sendJsonMessage,
        lastMessage,
        readyState,
        getWebSocket
        // @ts-ignore
    } = useWebSocket(getSocketUrl);

    useEffect(() => {
        if (lastMessage !== null) {
            // @ts-ignore
            setMessageHistory(prev => prev.concat(lastMessage));
            if (hasJsonStructure(lastMessage.data)) {
                let data = JSON.parse(lastMessage.data);
                if ('type' in data && data.type.includes('dashboard') && 'data' in data) {
                    setDashboardData(data.data);
                }
            }
        }
    }, [lastMessage, setMessageHistory]);

    useEffect(() => {
        sendJsonMessage({type: "authenticate", data: user?.token || getAccessToken()});
    }, [user, getAccessToken]);


    useEffect(() => {
        sendJsonMessage({type: "subscribe", data: 'dashboard_' + socketFiler});
        sendJsonMessage({type: "unsubscribe", data: 'dashboard_' + (socketFiler == 'day' ? 'hour' : 'day')});
    }, [socketFiler]);

    const copyButton = (text: string) => (
        <CopyToClipboard text={text} onCopy={() => toast.success('Successfully Copied !')}>
            <Button variant={"contained"}  className={styles.customBtn}>Copy</Button>
        </CopyToClipboard>
    );

    return (
        <Grid container>
            <Header/>
            <AccountOverview info={dashboardData.info}/>
            <CoinsTable info={dashboardData.userEarning} />
            {
                ((dashboardData.graphHour && dashboardData.graphHour.length > 0) || (dashboardData.graphDay && dashboardData.graphDay.length > 0))
                &&
                <HashChart setFilter={setSocketFilter} type={socketFiler}
                           data={socketFiler == 'day' ? dashboardData.graphDay : dashboardData.graphHour}/>
            }
            <Container maxWidth={"xl"} style={{paddingLeft:0,paddingRight:0}}>
                <Grid container>
                    <Grid item lg={6} xs={12}>
                        <CustomCard titleProps={{title: "Pool Info"}} cardProps={{style: {height: "360px"}}}>
                            <Typography className={styles.bodyFont}
                                        style={{display: "flex", justifyContent: "space-between"}}>
                            <span>
                                Miner Config
                            </span>
                                <Typography className={styles.primary}>
                                    {user && user.username || 'username'}.001, {user && user.username || 'username'}.002
                                </Typography>
                            </Typography>
                            <Divider sx={{my: 1}}/>
                            <Typography className={styles.bodyFont}
                                        style={{display: "flex", justifyContent: "space-between"}}>
                                <span>Fee PPS+</span>
                                <Typography className={styles.primary}>
                                    2%
                                </Typography>
                            </Typography>
                            <Divider sx={{my: 1}}/>
                            <Typography className={styles.bodyFont}
                                        style={{display: "flex", justifyContent: "space-between"}}>
                                <span>Minimum Payout</span>
                                <Typography className={styles.primary}>
                                    0.005 BTC
                                </Typography>
                            </Typography>
                            <Divider sx={{my: 1}}/>
                            <Typography className={styles.bodyFont}
                                        style={{display: "flex", justifyContent: "space-between"}}>
                                <span>Payment Time</span>
                                <Typography className={styles.primary}>
                                    During 00:00-01:00 (UTC)
                                </Typography>
                            </Typography>
                        </CustomCard>
                    </Grid>
                    <Grid item lg={6} xs={12} className={"noOutline"}>
                        <CustomCard titleProps={{title: "Minerium Addresess"}} cardProps={{style: {height: "360px"}}}>
                            <TextField
                                fullWidth
                                className={styles.bodyFont}
                                id="address"
                                sx={{my: 1}}
                                value="stratum+tcp://stratum.minerium.com:3333"
                                InputProps={{endAdornment: copyButton("stratum+tcp://stratum.minerium.com:3333")}}
                            />
                            <TextField
                                fullWidth
                                id="address2"
                                className={styles.bodyFont}
                                sx={{my: 1}}
                                value="stratum+tcp://stratum.minerium.com:4444"
                                InputProps={{endAdornment: copyButton("stratum+tcp://stratum.minerium.com:4444")}}
                            />
                            <TextField
                                fullWidth
                                id="address3"
                                className={styles.bodyFont}
                                sx={{mt: 1, mb: 2}}
                                value="stratum+tcp://stratum.minerium.com:44443"
                                InputProps={{endAdornment: copyButton("stratum+tcp://stratum.minerium.com:44443")}}
                            />
                        </CustomCard>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item lg={6} xs={12} sx={{px: 1}}>
                        <CustomCard titleProps={{title: "Contact Us"}}>
                            <Typography
                                style={{display: "flex", justifyContent: "space-between", fontSize: 20, color: "#043180",marginBottom:25}}
                                className={styles.bodyFont}>
                                <span>Report Problems:</span>
                                <Typography onClick={() => router.push('mailto:support@minerium.com')}
                                            component={"span"} className={styles.primary}
                                            style={{
                                                cursor: "pointer",
                                                fontWeight: "bold"
                                            }}>support@minerium.com</Typography>
                            </Typography>
                            <Typography
                                style={{display: "flex", justifyContent: "space-between", fontSize: 20, color: "#043180"}}
                                className={styles.bodyFont}>
                                <span>Customer Service:</span>
                                <Typography
                                    onClick={() => router.push('https://wa.me/message/M7A2O5XJEHDMH1')} component={"span"}
                                    className={styles.primary}
                                    style={{cursor: "pointer", fontWeight: "bold"}}>WhatsApp</Typography>
                            </Typography>
                        </CustomCard>
                    </Grid>
                    <Grid item lg={6} xs={12} sx={{px: 1}}>
                        <CustomCard titleProps={{title: "Help"}}>
                            <Grid container>
                                <Grid item md={9} xs={8}>
                                    <Typography className={styles.bodyFont}>
                                        Here find some of the most frequent quesitons about minerium, coins and pools.
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={4}>
                                    <Button sx={{mb:1}} fullWidth={true} variant={"contained"} className={styles.customBtn}>FAQ</Button>
                                    <Button fullWidth={true} variant={"contained"}  className={styles.customBtn}>About</Button>
                                </Grid>
                            </Grid>
                        </CustomCard>
                    </Grid>
                </Grid>
            </Container>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={messageHistory.length < 2}
            >
                <CircularProgress color="primary"/>
            </Backdrop>
            <Footer/>
        </Grid>
    );
};

export default Dashboard;
