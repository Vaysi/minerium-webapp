import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {makeStyles, styled} from "@mui/styles";
import {EarningBalance} from "../../utils/interfaces";
import {useEffect, useState} from "react";
import {$$earningsBalance} from "../../utils/api";
import CustomCard from "../inline-components/card";

const useStyles: any = makeStyles((theme: any) => ({
    subtitle: {
        backgroundColor: "rgba(3, 37, 97, 0.1)",
        borderRadius: 3,
        padding: "0 3px"
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
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: "rgba(5, 62, 161, 0.1)",
    },
}));

const Balance = () => {
    const styles = useStyles();
    const [balances, setBalances] = useState<Array<EarningBalance>>([]);

    useEffect(() => {
        $$earningsBalance().then(response => {
            setBalances(response.data);
        })
    }, []);

    const status = (row: EarningBalance) => {
        if (!row.balance.wallet) {
            return (<>
                Not Payable<br/><span className={styles.subtitle}>No Wallet Address Defined</span>
            </>);
        } else if (row.balance.price < row.balance.minimum) {
            return (
                <>
                    Not Payable<br/><span className={styles.subtitle}>Min. Amount Has Not Reached</span>
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
            <CustomCard titleProps={{title: "Earnings"}}>
                <TableContainer component={Paper} className={"tableContainer"} sx={{backgroundColor:"transparent"}}>
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
                                        {row.currency.toUpperCase()}
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
