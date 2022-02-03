import type {NextPage} from 'next'
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Container, Divider,
    Grid,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import Header from "../components/header/header";
import PageTitle from "../components/inline-components/page-title";
import {ContentCopy, OpenInNew, Speed} from "@mui/icons-material";
import Footer from "../components/footer/footer";
import {useCallback, useContext, useEffect, useState} from "react";
import {userContext} from "../utils/context";
import useWebSocket from "react-use-websocket";
import env from "../utils/env";
import CustomCard from "../components/inline-components/card";
import {hasJsonStructure, humanize} from "../utils/functions";
import {getAccessToken} from "axios-jwt";
import {makeStyles} from "@mui/styles";
import Image from "next/image";
import HashChart from "../components/dashboard/chart";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {toast} from "react-toastify";
import {useRouter} from "next/router";

const useStyles: any = makeStyles((theme: any) => ({
    sub: {
        color: "var(--header)",
        fontWeight: 400,
        fontSize: 22
    },
    primary: {
        color: "var(--header)",
        fontWeight: "bold"
    },
    secondary: {
        color: "var(--header)",
        fontWeight: "bold",
        fontSize: 22
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
            <IconButton color="primary" component="span">
                <ContentCopy/>
            </IconButton>
        </CopyToClipboard>
    );

    return (
        <Grid container>
            <Header/>
            <PageTitle title={"Dashboard"} icon={<Speed style={{width: 35, height: "auto"}}/>}/>
            <Container maxWidth={"xl"}>
                <CustomCard titleProps={{title: "Real Time"}}>
                    <Box display={"flex"} justifyContent={"space-around"}>
                        <Typography align={"center"}>
                            Real Time <br/>
                            <big className={styles.sub}>{dashboardData.info.hash5m.toFixed(2)} <small>TH/s</small></big>
                        </Typography>
                        <Typography align={"center"}>
                            24 Hour <br/>
                            <big className={styles.sub}>{dashboardData.info.hash1d.toFixed(2)} <small>TH/s</small></big>
                        </Typography>
                    </Box>
                </CustomCard>
                <CustomCard titleProps={{title: "Workers"}}>
                    <Box display={"flex"} justifyContent={"space-around"}>
                        <Typography align={"center"}>
                            Active <br/>
                            <big className={styles.sub}>{dashboardData.info.workers}</big>
                        </Typography>
                        <Typography align={"center"}>
                            Offline <br/>
                            <big className={styles.sub}>{dashboardData.info.offline_workers}</big>
                        </Typography>
                    </Box>
                </CustomCard>
                <Grid container>
                    {Object.entries(dashboardData.userEarning).map(([k, v]) => {
                        return (
                            <Grid key={k} md={3} sm={6} xs={12} item>
                                <CustomCard key={k} titleProps={{
                                    title: k.toUpperCase(),
                                    avatar: (
                                        <Image src={`/coins/${k}.svg`} width={25} height={25}/>
                                    ),
                                    action: (
                                        <IconButton aria-label="settings">
                                            <OpenInNew style={{cursor: "pointer", color: "#fff"}}/>
                                        </IconButton>
                                    )
                                }}>
                                    <Box>
                                        <Typography align={"center"} sx={{mb: 1}}>
                                            Yesterday Earning <br/>
                                            {
                                                //@ts-ignore
                                                (<big className={styles.sub}>{humanize(v.yesterday)}</big>)
                                            }
                                        </Typography>
                                        <Typography align={"center"} sx={{mb: 1}}>
                                            Account Balance <br/>
                                            {
                                                //@ts-ignore
                                                (<big className={styles.sub}>{humanize(v.balance)}</big>)
                                            }
                                        </Typography>
                                        <Box textAlign={"center"}>
                                            <Button variant={"contained"} color={"primary"}>
                                                {k.toUpperCase()} Calculator
                                            </Button>
                                        </Box>
                                    </Box>
                                </CustomCard>
                            </Grid>
                        );
                    })}
                </Grid>
                {
                    ((dashboardData.graphHour && dashboardData.graphHour.length > 0) || (dashboardData.graphDay && dashboardData.graphDay.length > 0))
                    &&
                    <HashChart setFilter={setSocketFilter} type={socketFiler}
                               data={socketFiler == 'day' ? dashboardData.graphDay : dashboardData.graphHour}/>
                }
                <CustomCard titleProps={{title: "Minerium Mining Addresses"}}>
                    <TextField
                        fullWidth
                        id="address"
                        sx={{my: 1}}
                        value="stratum+tcp://stratum.minerium.com:3333"
                        InputProps={{endAdornment: copyButton("stratum+tcp://stratum.minerium.com:3333")}}
                    />
                    <TextField
                        fullWidth
                        id="address2"
                        sx={{my: 1}}
                        value="stratum+tcp://stratum.minerium.com:4444"
                        InputProps={{endAdornment: copyButton("stratum+tcp://stratum.minerium.com:4444")}}
                    />
                    <TextField
                        fullWidth
                        id="address3"
                        sx={{mt: 1,mb:2}}
                        value="stratum+tcp://stratum.minerium.com:44443"
                        InputProps={{endAdornment: copyButton("stratum+tcp://stratum.minerium.com:44443")}}
                    />
                    <Typography>
                        Miner Config <br/>
                        <Typography className={styles.primary}>
                            {user && user.username || 'username'}.001, {user && user.username || 'username'}.002
                        </Typography>
                    </Typography>
                    <Divider sx={{my:1}} />
                    <Typography>
                        Fee PPS+ <br/>
                        <Typography className={styles.primary}>
                            2%
                        </Typography>
                    </Typography>
                    <Divider sx={{my:1}} />
                    <Typography>
                        Minimum Payout <br/>
                        <Typography className={styles.primary}>
                            0.005 BTC
                        </Typography>
                    </Typography>
                    <Divider sx={{my:1}} />
                    <Typography>
                        Payment Time <br/>
                        <Typography className={styles.primary}>
                            During 00:00-01:00 (UTC)
                        </Typography>
                    </Typography>
                </CustomCard>
                <CustomCard titleProps={{title: "Support"}}>
                    <Typography>
                        <Typography className={styles.secondary}>
                            FAQ
                        </Typography>
                        Here find some of the most frequent questions about minerium, crypto currency and pools.
                    </Typography>
                    <Box textAlign={"center"} sx={{my:2}}>
                        <Button variant={"contained"} color={"primary"}>
                            Check FAQs
                        </Button>
                    </Box>
                    <Typography>
                        <Typography className={styles.secondary}>
                            Contact Us
                        </Typography>
                        Report Problems: <Typography onClick={() => router.push('mailto:support@minerium.com') } component={"span"} className={styles.primary} style={{cursor:"pointer"}}>support@minerium.com</Typography> <br/>
                        Customer Service: <Typography  onClick={() => router.push('https://wa.me/message/M7A2O5XJEHDMH1') } component={"span"} className={styles.primary}  style={{cursor:"pointer"}}>WhatsApp</Typography>
                    </Typography>
                    <Box textAlign={"center"} sx={{my:2}}>
                        <Button variant={"contained"} color={"primary"}>
                            Contact Us
                        </Button>
                    </Box>
                </CustomCard>
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
