import type {NextPage} from 'next'
import {
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
import {humanize} from "../utils/functions";
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
        backgroundColor: "#fff"
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
}));

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#043386",
        color: "#fff",
        fontFamily: "var(--font-body)",
        fontWeight: 600
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
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
    ) => {
        if (i_currency_to_usd_rate === 0) {
            return false;
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
            pps *
            fee_in_percent(i_pool_fee) *
            (networkDiff / i_network_diff);
        const earning_currency = {
            daily: EARNING_CURRENCY_DAY,
            weekly: EARNING_CURRENCY_DAY * DAYS_IN_WEEK,
            monthly: EARNING_CURRENCY_DAY * DAYS_IN_MONTH,
            yearly: EARNING_CURRENCY_DAY * DAYS_IN_YEAR,
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

        earning_usd_after_electricity = {
            daily: earning_usd.daily - electricity_cost_usd.daily,
            weekly: earning_usd.weekly - electricity_cost_usd.weekly,
            monthly: earning_usd.monthly - electricity_cost_usd.monthly,
            yearly: earning_usd.yearly - electricity_cost_usd.yearly,
        };
        setRows([
            createData('Day', 0, 0, humanize(earning_currency_after_electricity.daily), humanize(earning_usd_after_electricity.daily, 2), 0, 0),
            createData('Weekly', 0, 0, humanize(earning_currency_after_electricity.weekly), humanize(earning_usd_after_electricity.weekly, 2), 0, 0),
            createData('Monthly', 0, 0, humanize(earning_currency_after_electricity.monthly), humanize(earning_usd_after_electricity.monthly, 2), 0, 0),
            createData('Yearly', 0, 0, humanize(earning_currency_after_electricity.yearly), humanize(earning_usd_after_electricity.yearly, 2), 0, 0),
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
    }, [networkDiff, hashrate, poolFee, power, powerCost, coinValue, coin]);

    useEffect(() => {
        $$getPps(coin).then(res => {
            setNetworkDiff(res.data.difficulty);
            setCoinValue(res.data.exchangeRate);
            setPps(res.data.pps);
            calculate(hashrate, power, powerCost, poolFee, res.data.exchangeRate, res.data.difficulty);
        })
    }, []);

    return (
        <Grid container>
            <Header/>
            <Container maxWidth={"xl"} className={"calculator"}>
                <CustomCard titleProps={{title: "Mining Reward Calculator"}}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item md={6} xs={12} alignItems={"center"} display={"flex"}>
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
                                        >
                                            <MenuItem value={"btc"}>BTC</MenuItem>
                                            <MenuItem value={"bch"}>BCH</MenuItem>
                                            <MenuItem value={"dgb"}>DGB</MenuItem>
                                            <MenuItem value={"bsv"}>BSV</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12} alignItems={"center"} display={"flex"}>
                                    <TextField
                                        label="Hashrate"
                                        id="filled-start-adornment"
                                        sx={{m: 1}}
                                        InputProps={{
                                            endAdornment: <InputAdornment className={styles.adornment}
                                                                          position="end">TH/s</InputAdornment>,
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
                                <Grid item md={6} xs={12} alignItems={"center"} display={"flex"}>
                                    <TextField
                                        label="Power"
                                        id="filled-start-adornment"
                                        fullWidth
                                        sx={{m: 1}}
                                        InputProps={{
                                            endAdornment: <InputAdornment className={styles.adornment}
                                                                          position="end">W</InputAdornment>,
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
                                <Grid item md={6} xs={12} alignItems={"center"} display={"flex"}>
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
                                <Grid item md={6} xs={12} alignItems={"center"} display={"flex"}>
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
                                <Grid item md={6} xs={12} alignItems={"center"} display={"flex"}>
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
                                <Grid item xs={12} alignItems={"center"} display={"flex"}>
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
                            <TableContainer style={{border: "1px solid #043386", borderRadius: 5}} component={Paper} className={"tableContainer"}
                                            sx={{mt: 5,backgroundColor:"transparent"}}>
                                <Table sx={{minWidth: 700}} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">Per</StyledTableCell>
                                            <StyledTableCell align="center">Fee</StyledTableCell>
                                            <StyledTableCell align="center">Est.Reward</StyledTableCell>
                                            <StyledTableCell align="center">Rev.BTC</StyledTableCell>
                                            <StyledTableCell align="center">Rev.$</StyledTableCell>
                                            <StyledTableCell align="center">Cost</StyledTableCell>
                                            <StyledTableCell align="center">Profit</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <StyledTableRow key={row.name}>
                                                <StyledTableCell align={"center"} style={{fontWeight: "bold"}}>
                                                    {row.per}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{row.fee}</StyledTableCell>
                                                <StyledTableCell align="center">{row.reward}</StyledTableCell>
                                                <StyledTableCell align="center">{row.btc}</StyledTableCell>
                                                <StyledTableCell align="center">{row.usd}</StyledTableCell>
                                                <StyledTableCell align="center">{row.cost}</StyledTableCell>
                                                <StyledTableCell align="center">{row.profit}</StyledTableCell>
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
