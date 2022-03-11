import {
    Box,
    Button,
    Container,
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
    TableRow, Tooltip,
} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {useRouter} from "next/router";
import CalculatorIcon from "../inline-components/calculator-icon";
import {useContext} from "react";
import {themeModeContext} from "../../utils/context";
const useStyles: any = makeStyles((theme: any) => ({
    thead: {
        color: "#043180",
        fontWeight: 600,
        fontFamily: "Open Sans",
        fontSize: "22px",
        "[data-theme=dark] &": {
            color: "#fff",
        },
    },
    icon: {
        position: "relative",
        top: 5
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
        fontFamily: "Montserrat",
        fontSize: 20
    },
    current: {
        backgroundColor: "#CEA716",
        "&:hover": {
            backgroundColor: "#CEA716"
        },
        textTransform: "none",
        fontFamily: "Montserrat",
    },
    switch: {
        backgroundColor: "#043386",
        textTransform: "none",
        fontFamily: "Montserrat",
    },
    ticker: {
        color: "#000",
        "[data-theme=dark] &": {
            color: "#fff",
        },
    },
    calcIcon: {
        color: "#043386!important",
        marginTop:5,
        "[data-theme=dark] &": {
            color: "#fff!important",
        },
    },
    select: {
        "[data-theme=dark] &": {
            backgroundColor: "#fff"
        },
        "& .MuiSelect-select": {
            paddingBottom:4,
            paddingTop:4
        },
        "& .MuiSelect-icon": {
            top: 0,
            right:0,
            padding:2,
            paddingBottom:5,
            backgroundColor: "#043386",
            fill:"#fff",
            borderTopRightRadius: "3px",
            borderBottomRightRadius: "3px",
        },
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
    const {mode} = useContext(themeModeContext);
    return (
        <Grid container>
            <Container sx={{my: 5}} maxWidth={"xl"}>
                <TableContainer className={"dashTable"} component={Paper}
                                style={{backgroundColor: "transparent", boxShadow: "none"}}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell className={styles.thead} align="center">Coin</TableCell>
                                <TableCell className={styles.thead} align="center">Daily Revenue</TableCell>
                                <TableCell className={styles.thead} align="center">Yesterday Earning</TableCell>
                                <TableCell className={styles.thead} align="center">Total Earning</TableCell>
                                <TableCell className={styles.thead} align="center">Balance</TableCell>
                                <TableCell className={styles.thead} align="center">Preferred Currency</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(props.info).map(([k, v]) => {
                                return (
                                    <TableRow
                                        key={k}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell align="center">
                                            <img className={styles.icon} src={`/coins/${k}.svg`} width={25}
                                                 height={25}/>
                                            <span className={styles.ticker} style={{
                                                marginLeft: 10,
                                                fontWeight: "bold",
                                                fontSize: "18px"
                                            }}>{k.toUpperCase()}</span>
                                        </TableCell>
                                        <TableCell align="center" className={styles.tbody}>{v.yesterday.toFixed(8)}
                                            <br/>
                                            <span>4$</span></TableCell>
                                        <TableCell align="center" className={styles.tbody}>{v.yesterday.toFixed(8)}
                                            <br/>
                                            <span>4$</span></TableCell>
                                        <TableCell align="center"
                                                   className={styles.tbody}>{(v.yesterday * 10).toFixed(8)} <br/>
                                            <span>4$</span></TableCell>
                                        <TableCell align="center" className={styles.tbody}>{v.balance.toFixed(9)} <br/>
                                            <span>4$</span></TableCell>
                                        <TableCell align="center" className={styles.tbody}>
                                            <Box display={"flex"} justifyContent={"center"}>
                                                <div>
                                                    <Button sx={{my: 1, maxWidth: 165, minWidth: 165,display:"block"}}
                                                            className={`${k == 'btc' ? styles.current : styles.switch}`}
                                                            variant={"contained"} size={"small"} fullWidth={true}>
                                                        {
                                                            k == 'btc' ? 'Current' : 'Switch'
                                                        }
                                                    </Button>
                                                    <Select
                                                        id={`${k}-select`}
                                                        label="Age"
                                                        size={"small"}
                                                        defaultValue={k == 'btc' ? 'solo' : 'pps'}
                                                        value={k == 'btc' ? 'solo' : 'pps'}
                                                        fullWidth={true}
                                                        className={styles.select}
                                                        style={{minWidth: 165, maxWidth: 165}}
                                                    >
                                                        <MenuItem value={"pps"}>PPS</MenuItem>
                                                        <MenuItem value={"solo"}>SOLO</MenuItem>
                                                    </Select>
                                                </div>
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
                                                            <CalculatorIcon styles={{height:60,width:"auto",fill: mode == 'light' ? "#043386" : "#D4E2F4"}} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Grid>
    );
}

export default CoinsTable;
