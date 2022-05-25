import {
    Backdrop, Button, CircularProgress,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow, Tooltip
} from "@mui/material";
import {makeStyles, styled} from "@mui/styles";
import {EarningBalance} from "../../utils/interfaces";
import {useEffect, useState} from "react";
import {$$earningsBalance} from "../../utils/api";
import CustomCard from "../inline-components/card";

const useStyles: any = makeStyles((theme: any) => ({
    subtitle: {
        backgroundColor: "rgba(143, 156, 179, 0.5)",
        borderRadius: 3,
        padding: "0 3px",
        color: "#043386",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        display: "inline-block",
        fontSize: 10
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
        backgroundColor: "#043180",
        color: "#fff",
        textAlign: "center"
    },
    [`&.${tableCellClasses.body}`]: {
        color: "#043180",
        textAlign: "center"
    },
    [`& .MuiTableCell-body`]: {
        color: "#043180",
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: "rgba(5, 62, 161, 0.1)",
    },
}));

const Balance = () => {
    const styles = useStyles();
    const [balances, setBalances] = useState<Array<EarningBalance>>([]);
    const [showTooltip,setShowTooltip] = useState(false);
    useEffect(() => {
        $$earningsBalance().then(response => {
            setBalances(response.data);
        })
    }, []);

    const status = (row: EarningBalance) => {
        if (!row.balance.wallet) {
            return (<>
                <Tooltip open={showTooltip}
                         onOpen={() => setShowTooltip(true)}
                         onClose={() => setShowTooltip(false)} enterTouchDelay={0} arrow title="No Wallet Address Defined">
                    <Button style={{fontSize:12,textTransform:"unset",minWidth:110}} size={"small"} variant="contained">Not Settled</Button>
                </Tooltip>
            </>);
        } else if (row.balance.price < row.balance.minimum) {
            return (
                <>
                    <Tooltip open={showTooltip}
                             onOpen={() => setShowTooltip(true)}
                             onClose={() => setShowTooltip(false)} enterTouchDelay={0} arrow title="The Minimum Amount of Payment has not been Reached">
                        <Button style={{fontSize:12,textTransform:"unset",minWidth:110}} size={"small"} variant="contained">Not Settled</Button>
                    </Tooltip>
                </>
            );
        } else if (row.balance.price === 0) {
            return 'Paid';
        } else {
            return 'Pending';
        }
    };

    return (
        <Container maxWidth={"xl"}>
            {balances.length < 1 &&  (
                <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1,px:5,py:5}} className={styles.backdrop} open={balances.length < 1 }>
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) }
            <CustomCard titleProps={{title: "Earnings"}}>
                <TableContainer component={Paper} className={"tableContainer"} sx={{backgroundColor:"transparent",borderRadius:"10px"}}>
                    <Table sx={{width: "100%"}} aria-label="customized table">
                        <TableHead>
                            <TableRow style={{borderRadius: "3px 3px 0 0"}}>
                                <StyledTableCell>Currency</StyledTableCell>
                                <StyledTableCell align="center">Yesterday</StyledTableCell>
                                <StyledTableCell align="center">Status</StyledTableCell>
                                <StyledTableCell align="center">Total Earnings</StyledTableCell>
                                <StyledTableCell align="center">Total Paid</StyledTableCell>
                                <StyledTableCell align="center">Balance</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {balances.map((row) => (
                                <StyledTableRow key={row.currency}>
                                    <StyledTableCell>
                                        <b>{row.currency.toUpperCase()}</b>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.yesterday}</StyledTableCell>
                                    <StyledTableCell align="center">{status(row)}</StyledTableCell>
                                    {
                                        row.currency == 'dgb' ? (
                                            <>
                                                <StyledTableCell
                                                    align="center">{row.total.toFixed(2)}</StyledTableCell>
                                                <StyledTableCell
                                                    align="center">{(row.balance.paid || 0).toFixed(2)}</StyledTableCell>
                                                <StyledTableCell
                                                    align="center">{row.balance.price.toFixed(2)}</StyledTableCell>
                                            </>
                                        ) : (
                                            <>
                                                <StyledTableCell
                                                    align="center">{row.total.toFixed(8)}</StyledTableCell>
                                                <StyledTableCell
                                                    align="center">{(row.balance.paid || 0).toFixed(8)}</StyledTableCell>
                                                <StyledTableCell
                                                    align="center">{row.balance.price.toFixed(8)}</StyledTableCell>
                                            </>
                                        )
                                    }
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CustomCard>
        </Container>
    );
}

export default Balance;
