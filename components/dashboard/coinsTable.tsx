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
import {Calculate} from "@mui/icons-material";
import {useRouter} from "next/router";


const useStyles: any = makeStyles((theme: any) => ({
    thead: {
        color: "#043180",
        fontWeight: 600,
        fontFamily: "Open Sans",
        fontSize: "22px"
    },
    icon: {
        position: "relative",
        top: 5
    },
    tbody: {
        color: "#043386",
        fontSize: 20,
        fontFamily: "Open Sans"
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
                                            <span style={{
                                                marginLeft: 10,
                                                color: "#000",
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
                                            <Box display={"flex"} justifyContent={"space-around"}>
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
                                                        <IconButton color={"primary"} onClick={() => router.push({
                                                            pathname: "/calculator",
                                                            query: {coin: k}
                                                        })}>
                                                            <Calculate sx={{width: 50, height: "auto"}}/>
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
