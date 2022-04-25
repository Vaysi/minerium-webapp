import type {NextPage} from 'next'
import {
    Backdrop, Box,
    CircularProgress,
    Container,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import {makeStyles, styled} from "@mui/styles";
import {useEffect, useState} from "react";
import {$$getPps} from "../utils/api";
import {addThousandSep, humanize} from "../utils/functions";
import {useRouter} from "next/router";
import CustomCard from "../components/inline-components/card";

const useStyles: any = makeStyles((theme: any) => ({
    titleSecondary: {
        fontSize: "1.em",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        color: "var(--header)"
    },
    titlePrimary: {
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: "2em",
        color: "var(--header)"
    },
    cardTitle: {
        backgroundColor: "var(--header)",
        color: "#fff",
        padding: 5,
        fontWeight: 600,
        textTransform: "uppercase",
        fontSize: "0.9em",
    },
    cardBody: {
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: "1.2em",
        color: "var(--header)",
        fontWeight: 700,
    },
    cardCurrency: {
        textTransform: "uppercase",
        fontSize: "0.7em"
    },
    usd: {
        fontSize: "0.7em",
        fontWeight: 400,
        color: "var(--header)",
    },
    note: {
        paddingLeft: 15,
        paddingRight: 15,
        color: "var(--header)",
        marginBottom: 5,
        marginTop: 15,
        fontSize: "14px"
    },
    notchedOutline: {
        border: "none"
    },
    field: {
        backgroundColor: "#CCD9F0"
    },
    input: {
        backgroundColor: "#fff",
        height: 16
    },
    adornment: {
        width: "50px",
        justifyContent: "center"
    },
    select: {
        "& fieldset": {
            display: "none"
        },
        "& 	.MuiSelect-outlined": {
            backgroundColor: "#fff"
        }
    },
    parent: {
        position: "relative",
        minHeight: 200
    },
    backdrop: {
        position: "absolute"
    }
}));

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#043386",
        color: "#fff",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: 20
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 16,
        color: "#043180"
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        // @ts-ignore
        backgroundColor: theme.palette.action.hover,
    },
}));

function createData(per: any, fee: any, reward: any, btc: any, usd: any, cost: any, profit: any) {
    return {per, fee, reward, btc, usd, cost, profit};
}


const Calculator: NextPage = () => {
    const styles = useStyles();
    const router = useRouter();
    const {coin: queryCoin} = router.query;
    const [networkDiff, setNetworkDiff] = useState<number>(0);
    const [coin, setCoin] = useState<string>(queryCoin as string || 'BTC');
    const [hashrate, setHashrate] = useState<string | number>(1);
    const [poolFee, setPoolFee] = useState<string | number>(4);
    const [coinValue, setCoinValue] = useState<string | number>(0);
    const [pps, setPps] = useState<number>(0);
    const [hashUnit, setHashUnit] = useState<string>("TH/s");
    const [powerUnit, setPowerUnit] = useState<string>("W");
    const [power, setPower] = useState<string | number>(0);
    const [powerCost, setPowerCost] = useState<string | number>(0);
    const [rows, setRows] = useState<Array<any>>([]);

    const HOURS_IN_DAY = 24,
        DAYS_IN_WEEK = 7,
        DAYS_IN_MONTH = 30,
        DAYS_IN_YEAR = 365;
    const HOURS_IN_WEEK = HOURS_IN_DAY * DAYS_IN_WEEK,
        HOURS_IN_MONTH = HOURS_IN_DAY * DAYS_IN_MONTH,
        HOURS_IN_YEAR = HOURS_IN_DAY * DAYS_IN_YEAR;


    let earning_currency_after_electricity = {
        daily: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0
    };
    let earning_currency_after_electricity_no_fee = {
        daily: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0
    };
    let earning_usd_after_electricity = {
        daily: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0
    };

    const calculate = (
        i_hashrate: any,
        i_electricity_Wh: any,
        i_kWh_usd_rate: any,
        i_pool_fee: any,
        i_currency_to_usd_rate: any,
        i_network_diff: any,
        i_pps: any=0,
    ) => {
        if (i_currency_to_usd_rate === 0) {
            return false;
        }

        if(hashUnit != "TH/s"){
            if(hashUnit == 'PH/s'){
                i_hashrate *= 1000;
            }else if(hashUnit == 'EH/s'){
                i_hashrate *= 1000000;
            }
        }

        if(powerUnit != "W"){
            if(powerUnit == 'KW'){
                i_electricity_Wh *= 1000;
            }else if(powerUnit == 'MW'){
                i_electricity_Wh *= 1000000;
            }
        }

        // Watt to kW
        const w2kw = (w: number) => w / 1000;
        let electricity_per_hour_usd = i_electricity_Wh * w2kw(i_kWh_usd_rate);
        const electricity_cost_usd = {
            daily: electricity_per_hour_usd * HOURS_IN_DAY,
            weekly: electricity_per_hour_usd * HOURS_IN_WEEK,
            monthly: electricity_per_hour_usd * HOURS_IN_MONTH,
            yearly: electricity_per_hour_usd * HOURS_IN_YEAR,
        };

        const electricity_cost_currency = {
            daily: electricity_cost_usd.daily / i_currency_to_usd_rate,
            weekly: electricity_cost_usd.weekly / i_currency_to_usd_rate,
            monthly: electricity_cost_usd.monthly / i_currency_to_usd_rate,
            yearly: electricity_cost_usd.yearly / i_currency_to_usd_rate,
        };

        const fee_in_percent = (fee: number) => 1.0 - fee * 0.01;
        const EARNING_CURRENCY_DAY =
            i_hashrate *
            (i_pps || pps) *
            fee_in_percent(i_pool_fee) *
            (networkDiff / i_network_diff);

        const EARNING_CURRENCY_DAY_NO_FEE =
            i_hashrate *
            (i_pps || pps) *
            (networkDiff / i_network_diff);
        const earning_currency = {
            daily: EARNING_CURRENCY_DAY,
            weekly: EARNING_CURRENCY_DAY * DAYS_IN_WEEK,
            monthly: EARNING_CURRENCY_DAY * DAYS_IN_MONTH,
            yearly: EARNING_CURRENCY_DAY * DAYS_IN_YEAR,
        };

        const earning_currency_no_fee = {
            daily: EARNING_CURRENCY_DAY_NO_FEE,
            weekly: EARNING_CURRENCY_DAY_NO_FEE * DAYS_IN_WEEK,
            monthly: EARNING_CURRENCY_DAY_NO_FEE * DAYS_IN_MONTH,
            yearly: EARNING_CURRENCY_DAY_NO_FEE * DAYS_IN_YEAR,
        };

        const earning_usd = {
            daily: earning_currency.daily * i_currency_to_usd_rate,
            weekly: earning_currency.weekly * i_currency_to_usd_rate,
            monthly: earning_currency.monthly * i_currency_to_usd_rate,
            yearly: earning_currency.yearly * i_currency_to_usd_rate,
        };

        earning_currency_after_electricity = {
            daily: earning_currency.daily - electricity_cost_currency.daily,
            weekly: earning_currency.weekly - electricity_cost_currency.weekly,
            monthly: earning_currency.monthly - electricity_cost_currency.monthly,
            yearly: earning_currency.yearly - electricity_cost_currency.yearly,
        };

        earning_currency_after_electricity_no_fee = {
            daily: earning_currency_no_fee.daily - electricity_cost_currency.daily,
            weekly: earning_currency_no_fee.weekly - electricity_cost_currency.weekly,
            monthly: earning_currency_no_fee.monthly - electricity_cost_currency.monthly,
            yearly: earning_currency_no_fee.yearly - electricity_cost_currency.yearly,
        };

        earning_usd_after_electricity = {
            daily: earning_usd.daily - electricity_cost_usd.daily,
            weekly: earning_usd.weekly - electricity_cost_usd.weekly,
            monthly: earning_usd.monthly - electricity_cost_usd.monthly,
            yearly: earning_usd.yearly - electricity_cost_usd.yearly,
        };
        const calcFeeInBtc =  (reward:any) => reward * (i_pool_fee * 0.01);
        setRows([
            createData('Day', humanize(calcFeeInBtc(earning_currency_no_fee.daily)), humanize(earning_currency_no_fee.daily), humanize(earning_currency.daily), humanize(earning_usd.daily, 2), humanize(electricity_cost_usd.daily,2), humanize(earning_usd_after_electricity.daily, 2)),
            createData('Week', humanize(calcFeeInBtc(earning_currency_no_fee.weekly)), humanize(earning_currency_no_fee.weekly), humanize(earning_currency.weekly), humanize(earning_usd.weekly, 2), humanize(electricity_cost_usd.weekly,2), humanize(earning_usd_after_electricity.weekly, 2)),
            createData('Month', humanize(calcFeeInBtc(earning_currency_no_fee.monthly)), humanize(earning_currency_no_fee.monthly), humanize(earning_currency.monthly), humanize(earning_usd.monthly, 2), humanize(electricity_cost_usd.monthly,2), humanize(earning_usd_after_electricity.monthly, 2)),
            createData('Year', humanize(calcFeeInBtc(earning_currency_no_fee.yearly)), humanize(earning_currency_no_fee.yearly), humanize(earning_currency.yearly), humanize(earning_usd.yearly, 2), humanize(electricity_cost_usd.yearly,2), humanize(earning_usd_after_electricity.yearly, 2)),
        ]);
        return true;
    };

    useEffect(() => {
        $$getPps(coin).then(res => {
            setNetworkDiff(res.data.difficulty);
            setCoinValue(res.data.exchangeRate);
            setPps(res.data.pps);
        })
    }, [coin]);

    useEffect(() => {
        calculate(hashrate, power, powerCost, poolFee, coinValue, networkDiff);
    }, [networkDiff, hashrate, poolFee, power, powerCost, coinValue, coin,hashUnit,powerUnit]);

    useEffect(() => {
        $$getPps(coin).then(res => {
            setNetworkDiff(res.data.difficulty);
            setCoinValue(res.data.exchangeRate);
            setPps(res.data.pps);
            calculate(hashrate, power, powerCost, poolFee, res.data.exchangeRate, res.data.difficulty,res.data.pps);
        })
        setTimeout(() => {
            setHashUnit('PH/s');
            setHashUnit('TH/s');
        },2000);
    }, []);


    return (
        <Grid container>
            <Header/>
            <Container maxWidth={"xl"} className={"calculator"}>
                <CustomCard titleProps={{title: "Mining Reward Calculator"}}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item md={3} sm={6} xs={12} alignItems={"center"} display={"flex"}>
                                    <FormControl sx={{m: 1}} fullWidth>
                                        <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={coin.toLowerCase()}
                                            label="Currency"
                                            fullWidth
                                            variant={"outlined"}
                                            onChange={(e) => {
                                                setCoin(e.target.value);
                                            }}
                                            className={styles.select}
                                            inputProps={{style:{height:10}}}
                                        >
                                            <MenuItem value={"btc"}>BTC</MenuItem>
                                            <MenuItem value={"bch"}>BCH</MenuItem>
                                            <MenuItem value={"dgb"}>DGB</MenuItem>
                                            <MenuItem value={"bsv"}>BSV</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={6} xs={12} alignItems={"center"} display={"flex"}>
                                    <TextField
                                        label="Hashrate"
                                        id="filled-start-adornment"
                                        sx={{m: 1}}
                                        InputProps={{
                                            endAdornment: <InputAdornment className={styles.adornment}
                                                                          position="end">
                                                <Select
                                                    defaultValue={hashUnit}
                                                    value={hashUnit}
                                                    onChange={(e) => setHashUnit(e.target.value)}
                                                    variant={"standard"}
                                                >
                                                    <MenuItem value={"TH/s"}>TH/s</MenuItem>
                                                    <MenuItem value={"PH/s"}>PH/s</MenuItem>
                                                    <MenuItem value={"EH/s"}>EH/s</MenuItem>
                                                </Select>
                                            </InputAdornment>,
                                            classes: {
                                                notchedOutline: styles.notchedOutline,
                                                input: styles.input,
                                            }
                                        }}
                                        value={hashrate}
                                        onChange={(e) => {
                                            setHashrate(e.target.value);
                                        }}
                                        fullWidth
                                        className={styles.field}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12} alignItems={"center"} display={"flex"}>
                                    <TextField
                                        label="Power"
                                        id="filled-start-adornment"
                                        fullWidth
                                        sx={{m: 1}}
                                        InputProps={{
                                            endAdornment: <InputAdornment className={styles.adornment}
                                                                          position="end">
                                                <Select
                                                    defaultValue={powerUnit}
                                                    value={powerUnit}
                                                    onChange={(e) => setPowerUnit(e.target.value)}
                                                    variant={"standard"}
                                                >
                                                    <MenuItem value={"W"}>W</MenuItem>
                                                    <MenuItem value={"KW"}>KW</MenuItem>
                                                    <MenuItem value={"MW"}>MW</MenuItem>
                                                </Select>
                                            </InputAdornment>,
                                            classes: {
                                                notchedOutline: styles.notchedOutline,
                                                input: styles.input,
                                            }
                                        }}
                                        onChange={(e) => {
                                            setPower(e.target.value);
                                        }}
                                        value={power}
                                        variant="outlined"
                                        className={styles.field}
                                    />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12} alignItems={"center"} display={"flex"}>
                                    <TextField
                                        label="Power Cost"
                                        id="filled-start-adornment"
                                        fullWidth
                                        sx={{m: 1}}
                                        InputProps={{
                                            endAdornment: <InputAdornment className={styles.adornment}
                                                                          position="end">$/kWh</InputAdornment>,
                                            classes: {
                                                notchedOutline: styles.notchedOutline,
                                                input: styles.input,
                                            }
                                        }}
                                        onChange={(e) => {
                                            setPowerCost(e.target.value);
                                        }}
                                        value={powerCost}
                                        variant="outlined"
                                        className={styles.field}
                                    />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12} alignItems={"center"} display={"flex"}>
                                    <TextField
                                        label="Pool Fee"
                                        id="filled-start-adornment"
                                        fullWidth
                                        sx={{m: 1}}
                                        InputProps={{
                                            endAdornment: <InputAdornment className={styles.adornment}
                                                                          position="end">%</InputAdornment>,
                                            classes: {
                                                notchedOutline: styles.notchedOutline,
                                                input: styles.input,
                                            }
                                        }}
                                        onChange={(e) => {
                                            setPoolFee(e.target.value);
                                        }}
                                        value={poolFee}
                                        variant="outlined"
                                        className={styles.field}
                                    />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12} alignItems={"center"} display={"flex"}>
                                    <TextField
                                        label={`${coin.toUpperCase()} Value`}
                                        id="filled-start-adornment"
                                        fullWidth
                                        sx={{m: 1}}
                                        InputProps={{
                                            endAdornment: <InputAdornment className={styles.adornment}
                                                                          position="end">$</InputAdornment>,
                                            classes: {
                                                notchedOutline: styles.notchedOutline,
                                                input: styles.input,
                                            }
                                        }}
                                        onChange={(e) => {
                                            setCoinValue(e.target.value);
                                        }}
                                        value={coinValue}
                                        variant="outlined"
                                        className={styles.field}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12} alignItems={"center"} display={"flex"}>
                                    <TextField
                                        label="Net Difficulty"
                                        id="filled-start-adornment"
                                        fullWidth
                                        sx={{m: 1}}
                                        onChange={(e) => {
                                            //@ts-ignore
                                            setNetworkDiff(e.target.value);
                                        }}
                                        value={networkDiff}
                                        variant="outlined"
                                        InputProps={{
                                            classes: {
                                                notchedOutline: styles.notchedOutline,
                                                input: styles.input,
                                            }
                                        }}
                                        className={styles.field}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer style={{border: "1px solid #043386", borderRadius: 5}} component={Paper} className={"tableContainer " + styles.parent}
                                            sx={{mt: 5,backgroundColor:"transparent"}}>
                                {rows.length < 1 &&  (
                                    <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1,px:5,py:5}} className={styles.backdrop} open={rows.length < 1 }>
                                        <CircularProgress color="inherit" />
                                    </Backdrop>
                                ) }
                                <Table sx={{minWidth: 700}} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell className={styles.thead} align="left" style={{width:0}}>Per</StyledTableCell>
                                            <StyledTableCell className={styles.thead} align="center">Est.Rewards</StyledTableCell>
                                            <StyledTableCell className={styles.thead} align="center">Fee</StyledTableCell>
                                            <StyledTableCell className={styles.thead} align="center">Rev.{coin.toUpperCase()}</StyledTableCell>
                                            <StyledTableCell className={styles.thead} align="center">Rev.$</StyledTableCell>
                                            <StyledTableCell className={styles.thead} align="center">Cost</StyledTableCell>
                                            <StyledTableCell className={styles.thead} align="center">Profit</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.length > 0 && rows.map((row) => (
                                            <StyledTableRow key={row.name}>
                                                <StyledTableCell align={"left"} style={{fontWeight: "bold"}}>
                                                    {row.per}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{row.reward}</StyledTableCell>
                                                <StyledTableCell align="center">{row.fee}</StyledTableCell>
                                                <StyledTableCell align="center">{row.btc}</StyledTableCell>
                                                <StyledTableCell align="center">{addThousandSep(row.usd)} <b>$</b></StyledTableCell>
                                                <StyledTableCell align="center">{addThousandSep(row.cost)} <b>$</b></StyledTableCell>
                                                <StyledTableCell align="center">{addThousandSep(row.profit)} <b>$</b></StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                    <Typography className={styles.note}>
                        <b>Note:</b> You could use this tool to calculate the theoretical earnings based on current
                        network difficulty, the result may deviate from your actual earnings, for reference only.
                    </Typography>
                </CustomCard>
            </Container>
            <Footer/>
        </Grid>
    );
};

export default Calculator;
