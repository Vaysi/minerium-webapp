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
import {$$getPps} from "../utils/api";

const useStyles: any = makeStyles((theme: any) => ({
    primary: {
        color: "var(--header)",
        fontWeight: "bold",
        fontSize: 20,
        "@media (max-width: 800px)": {
            fontSize: "1rem",
        },
        "[data-theme=dark] &": {
            color: "#fff",
        },
    },
    secondary: {
        color: "var(--header)",
        fontWeight: "bold",
        fontSize: 22,
        "[data-theme=dark] &": {
            color: "#fff",
        },
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
        },
        "[data-theme=dark] &": {
            backgroundColor: "#043180",
            color: "#fff",
        }
    },
    bodyFont: {
        "@media (max-width: 800px)": {
            fontSize: "0.9rem",
        },
        "[data-theme=dark] &": {
            color: "#fff!important",
            "& .MuiOutlinedInput-input": {
                color: "#fff",
            }
        },
        fontFamily: "Montserrat",
        display:"flex",
        justifyContent:"space-between",
        fontSize: 20,
        color: "#043180",
        marginTop:0,
        marginBottom: 8
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
            resolve(env.SOCKET_URL);
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
                    if(data.data.userEarning){
                        for (let key in data.data.userEarning) {
                            // @ts-ignore
                            if(data.data.userEarning[key].balance > 0){
                                $$getPps(key).then(item => {
                                    let newInfo = {...data.data};
                                    // @ts-ignore
                                    newInfo.userEarning[key].price = item.data.exchangeRate;
                                    setDashboardData({...newInfo});
                                });
                            }else {
                                let newInfo = {...data.data};
                                // @ts-ignore
                                newInfo.userEarning[key].price = 0;
                                setDashboardData({...newInfo});
                            }
                        }
                    }
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
            <Grid container>
                <Container maxWidth={"xl"} style={{paddingLeft:0,paddingRight:0}}>
                    <Grid container>
                        <Grid item lg={6} xs={12}>
                            <CustomCard titleProps={{title: "Pool Info"}} cardProps={{style: {height: "290px"}}}>
                                <Typography className={styles.bodyFont}>
                                <span>
                                    Miner Config
                                </span>
                                    <Typography className={styles.primary}>
                                        {user && user.username || 'username'}.001, {user && user.username || 'username'}.002
                                    </Typography>
                                </Typography>
                                <Divider sx={{my: 1}}/>
                                <Typography className={styles.bodyFont}>
                                    <span>Fee PPS+</span>
                                    <Typography className={styles.primary}>
                                        2%
                                    </Typography>
                                </Typography>
                                <Divider sx={{my: 1}}/>
                                <Typography className={styles.bodyFont}>
                                    <span>Minimum Payout</span>
                                    <Typography className={styles.primary}>
                                        0.005 BTC
                                    </Typography>
                                </Typography>
                                <Divider sx={{my: 1}}/>
                                <Typography className={styles.bodyFont}>
                                    <span>Payment Time</span>
                                    <Typography className={styles.primary}>
                                        00:00-01:00 (UTC)
                                    </Typography>
                                </Typography>
                            </CustomCard>
                        </Grid>
                        <Grid item lg={6} xs={12} className={"noOutline"}>
                            <CustomCard titleProps={{title: "Minerium Addresess"}} cardProps={{style: {height: "290px",paddingTop:0}}}>
                                <TextField
                                    fullWidth
                                    className={styles.bodyFont}
                                    id="address"
                                    sx={{py:0}}
                                    value="stratum+tcp://stratum.minerium.com:3333"
                                    InputProps={{style:{fontSize: 20, color: "#043180"},endAdornment: copyButton("stratum+tcp://stratum.minerium.com:3333")}}
                                />
                                <TextField
                                    fullWidth
                                    id="address2"
                                    className={styles.bodyFont}
                                    sx={{py:0}}
                                    value="stratum+tcp://stratum.minerium.com:4444"
                                    InputProps={{style:{fontSize: 20, color: "#043180"},endAdornment: copyButton("stratum+tcp://stratum.minerium.com:4444")}}
                                />
                                <TextField
                                    fullWidth
                                    id="address3"
                                    className={styles.bodyFont}
                                    sx={{py:0}}
                                    value="stratum+tcp://stratum.minerium.com:44443"
                                    InputProps={{style:{fontSize: 20, color: "#043180"},endAdornment: copyButton("stratum+tcp://stratum.minerium.com:44443")}}
                                />
                            </CustomCard>
                        </Grid>
                        <Grid item lg={6} xs={12} sx={{px: 1}}>
                            <CustomCard titleProps={{title: "Contact Us"}}>
                                <Typography
                                    style={{display: "flex", justifyContent: "space-between",marginBottom:25}} className={styles.bodyFont}>
                                    <span>Report Problems:</span>
                                    <Typography onClick={() => router.push('mailto:support@minerium.com')}
                                                component={"span"} className={styles.primary}
                                                style={{
                                                    cursor: "pointer",
                                                    fontWeight: "bold"
                                                }}>support@minerium.com</Typography>
                                </Typography>
                                <Typography
                                    style={{display: "flex", justifyContent: "space-between"}}
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
                            <CustomCard titleProps={{title: "Help"}} cardProps={{style:{minHeight:198}}}>
                                <Grid container>
                                    <Grid item md={9} xs={8}>
                                        <Typography className={styles.bodyFont} sx={{lineHeight:"28px",marginBottom:3}}>
                                            Here find some of the most frequent questions about minerium, coins and pools.
                                        </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={4} justifyContent={"end"} textAlign={"right"}>
                                        <Button sx={{mb:1}} variant={"contained"} className={styles.customBtn}>&nbsp; FAQ &nbsp;</Button>
                                    </Grid>
                                </Grid>
                            </CustomCard>
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
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
