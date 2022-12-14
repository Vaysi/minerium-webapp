import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip, useMediaQuery,
} from "@mui/material";
import {makeStyles, useTheme} from "@mui/styles";
import {useRouter} from "next/router";
import CalculatorIcon from "../inline-components/calculator-icon";
import {useEffect, useState} from "react";
import {$$changePaymentPreference, $$earningsBalance, $$getAllPPS, $$getPps} from "../../utils/api";
import {toast} from "react-toastify";
import {addThousandSep, arrayMove, calculateDailyRevBaseOnTime} from "../../utils/functions";
import {ArrowRightAlt} from "@mui/icons-material";

const useStyles: any = makeStyles((theme: any) => ({
    thead: {
        color: "rgba(4, 49, 128, 1)!important",
        fontWeight: "600!important",
        fontFamily: "Open Sans!important",
        fontSize: "18px!important",
        "[data-theme=dark] &": {
            color: "#fff",
        },
    },
    icon: {
        position: "relative",
        top: 10
    },
    tbody: {
        color: "#043386",
        fontSize: 20,
        fontFamily: "Open Sans",
        "[data-theme=dark] &": {
            color: "#fff",
        },
    },
    bodyFont: {
        fontFamily: "var(--font-body)",
        fontSize: 20
    },
    current: {
        backgroundColor: "#8dc351!important",
        "&:hover": {
            backgroundColor: "#8dc351!important"
        },
        textTransform: "none",
        fontFamily: "var(--font-body)",
    },
    switch: {
        backgroundColor: "#043386",
        textTransform: "none",
        fontFamily: "var(--font-body)",
    },
    ticker: {
        color: "#000",
        "[data-theme=dark] &": {
            color: "#fff",
        },
    },
    calcIcon: {
        color: "#043386!important",
        position: "relative",
        marginTop: 5,
        "[data-theme=dark] &": {
            color: "#fff!important",
        },
    },
    select: {
        "[data-theme=dark] &": {
            backgroundColor: "#fff"
        },
        "& .MuiSelect-select": {
            paddingBottom: 4,
            paddingTop: 4
        },
        "& .MuiSelect-icon": {
            top: 0,
            right: 0,
            padding: 2,
            paddingBottom: 5,
            backgroundColor: "#043386",
            fill: "#fff",
            borderTopRightRadius: "3px",
            borderBottomRightRadius: "3px",
        },
    },
    floatingIcon: {
        position: "absolute",
        left: 10,
        bottom: 10
    }
}));

interface Props {
    info: Array<{
        yesterday: number;
        balance: number;
    }>;
}

const CoinsTable = (props: Props) => {
    const styles = useStyles();
    const router = useRouter();
    const [miningMode, setMiningMode] = useState<string>("pps");
    const [selected, setSelected] = useState<string>('btc');
    const [loading, setLoading] = useState<boolean>(false);
    const [saved, setSaved] = useState<boolean>(false);
    const [ask, setAsk] = useState<boolean>(false);
    const [tempVal, setTempVal] = useState<any>('');
    const [balance, setBalance] = useState<Array<any>>([]);
    const theme = useTheme();
    //@ts-ignore
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const matches1160 = useMediaQuery("@media (max-width: 1160px)");

    useEffect(() => {
        $$getAllPPS().then(response => {
            let {preference,method} = response.data;
            setSelected(preference);
            setMiningMode(method ? method : 'pps');
        });
        $$earningsBalance().then(res => {
            setBalance(res.data);
        });
    }, []);

    const updateMiningMode = () => {
        setLoading(true);
        $$changePaymentPreference(selected, miningMode).then(response => {
            toast.success("Changes Saved !");
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        if (saved) {
            updateMiningMode();
        }
        setSaved(false);
    }, [miningMode, selected]);

    const getBalance = (currency: string) => {
        let out = balance.filter((item: any) => {
            return item.currency == currency;
        });
        return out.length ? out[0] : null;
    };

    return (
        <Grid container>
            <Container sx={{my: 5}} maxWidth={"xl"}>
                <TableContainer sx={{backgroundColor:"var(--blue-ghost)",borderRadius:5,boxShadow: "2px 10px 60px rgb(0 0 0 / 25%)"}} className={"dashTable"} component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell className={styles.thead} align="center">Coin</TableCell>
                                <TableCell className={styles.thead} align="center">Daily Revenue</TableCell>
                                <TableCell className={styles.thead} align="center">Yesterday Earning</TableCell>
                                <TableCell className={styles.thead} align="center">Total Earning</TableCell>
                                <TableCell className={styles.thead} align="center">Balance</TableCell>
                                <TableCell className={styles.thead} align="center">Earning Method</TableCell>
                                <TableCell className={styles.thead} align="center">Calculator</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(props.info).length > 0 && arrayMove(Object.entries(props.info), 2, 0).map(([k, v]) => {
                                return (
                                    <TableRow
                                        key={k}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        {/* Coin */}
                                        <TableCell align="center">
                                            {
                                                matches1160 ? (
                                                    <>
                                                        <span className={styles.ticker} style={{
                                                            marginLeft: matches ? 0 : 10,
                                                            fontWeight: "bold",
                                                            fontSize: "18px"
                                                        }}>{k.toUpperCase()}</span>
                                                        <img className={styles.icon} src={`/coins/${k}.svg`} width={matches ? 30 : 35}
                                                             height={matches ? 30 : 35} style={{top: matches ? 0 : 10}}/>
                                                    </>
                                                ) : (
                                                    <>
                                                        <img className={styles.icon} src={`/coins/${k}.svg`} width={matches ? 30 : 35}
                                                             height={matches ? 30 : 35} style={{top: matches ? 0 : 10}}/>
                                                        <span className={styles.ticker} style={{
                                                            marginLeft: matches ? 0 : 10,
                                                            fontWeight: "bold",
                                                            fontSize: "18px"
                                                        }}>{k.toUpperCase()}</span>
                                                    </>
                                                )
                                            }
                                        </TableCell>
                                        {/* Daily Rev */}
                                        <TableCell align="center" className={styles.tbody}>
                                            {v.yesterday.toFixed(8)}
                                            <br/>
                                            { v?.price > 0 && (<span style={{fontSize:21,fontWeight:"bold"}}>{addThousandSep((v.yesterday.toFixed(8) * v.price).toFixed(2))}$</span>)}
                                        </TableCell>
                                        {/* Yesterday Earning */}
                                        <TableCell align="center" className={styles.tbody}>
                                            {v.yesterday.toFixed(8)}
                                            <br/>
                                            { v?.price > 0 && (<span style={{fontSize:21,fontWeight:"bold"}}>{addThousandSep((v.yesterday.toFixed(8) * v.price).toFixed(2))}$</span>)}
                                        </TableCell>
                                        <TableCell align="center" className={styles.tbody}>
                                            {((getBalance(k) != null ? getBalance(k).total : 0)).toFixed(8)}
                                            <br/>
                                            { v?.price > 0 && (<span style={{fontSize:21,fontWeight:"bold"}}>{addThousandSep((((getBalance(k) != null ? getBalance(k).total : 0)).toFixed(8) * v.price).toFixed(2))}$</span>)}
                                        </TableCell>
                                        <TableCell align="center" className={styles.tbody}>
                                            {v.balance.toFixed(9)} <br/>
                                            { v?.price > 0 && (<span style={{fontSize:21,fontWeight:"bold"}}>{addThousandSep((v.balance.toFixed(9) * v.price).toFixed(2))}$</span>)}
                                        </TableCell>
                                        <TableCell align="center" className={styles.tbody}>
                                            <Box display={"flex"} justifyContent={"center"}>
                                                <div>
                                                    <Select
                                                        id={`${k}-select`}
                                                        size={"small"}
                                                        defaultValue={miningMode ? miningMode.toLowerCase() : ""}
                                                        value={miningMode ? miningMode.toLowerCase() : ""}
                                                        fullWidth={true}
                                                        className={styles.select}
                                                        style={{minWidth: 165, maxWidth: 165}}
                                                        disabled={k.toLowerCase() != 'btc' || selected != 'btc'}
                                                        onChange={(e) => {
                                                            setSaved(true);
                                                            setMiningMode(e.target.value);
                                                        }}
                                                    >
                                                        <MenuItem value={"solo"}>SOLO</MenuItem>
                                                        <MenuItem value={"pps"}>PPS</MenuItem>
                                                    </Select>
                                                    <Button sx={{my: 1, maxWidth: 165, minWidth: 165, display: "block"}}
                                                            className={`${k.toLowerCase() == selected.toLowerCase() ? styles.current : styles.switch}`}
                                                            variant={"contained"} size={"small"} fullWidth={true}
                                                            onClick={() => {
                                                                setTempVal(k.toLowerCase());
                                                                setAsk(true);
                                                            }}>
                                                        {
                                                            k.toLowerCase() == selected.toLowerCase() ? 'Current' : 'Select'
                                                        }
                                                    </Button>
                                                </div>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                                <Tooltip placement={"top"} title={`${k.toUpperCase()} Calculator`}>
                                                    <IconButton className={styles.calcIcon} onClick={() => router.push({
                                                        pathname: "/calculator",
                                                        query: {coin: k}
                                                    })}>
                                                        <CalculatorIcon styles={{height: 60, width: "auto"}}/>
                                                        <img className={styles.floatingIcon} src={`/coins/${k}.svg`}
                                                             width={30} height={30}/>
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={loading}
                >
                    <CircularProgress color="primary"/>
                </Backdrop>
                <Dialog
                    open={ask}
                    onClose={() => setAsk(false)}
                    PaperProps={{
                        style: {
                            backgroundColor: '#F5F5F7',
                        },
                    }}
                >
                    <DialogTitle id="alert-dialog-title">
                        Changing Earning Method
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                    <img src={`/coins/${selected}.svg`}
                                         width={40} height={40}/>
                                    <ArrowRightAlt sx={{mx:1}} />
                                    <img src={`/coins/${tempVal}.svg`}
                                         width={40} height={40}/>
                                </Box>
                            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <span>{selected.toUpperCase()}</span>
                                <ArrowRightAlt sx={{mx:1.5}} />
                                <span>{tempVal.toUpperCase()}</span>
                            </Box>
                            We will change how we calculate your earnings from the next hour by switching the earning
                            method.
                            Do you want to proceed?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setAsk(false)}>Cancel</Button>
                        <Button color={"primary"} variant={"contained"} onClick={() => {
                            setSaved(true);
                            setSelected(tempVal);
                            setTempVal('');
                            setAsk(false);
                        }} autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Grid>
    );
}

export default CoinsTable;
