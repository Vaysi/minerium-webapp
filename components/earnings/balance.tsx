import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Container,
    Link, Paper,
    Table,
    TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow,
    Typography
} from "@mui/material";
import {makeStyles, styled} from "@mui/styles";
import {Tab} from "../../utils/interfaces";

const useStyles:any = makeStyles((theme:any) => ({
    earnings: {

    },
    card: {

    },
    cardHeader:{
        backgroundColor: "#043180",
        color: "#fff"
    },
    cardContent: {
        backgroundColor: "var(--blue-ghost)"
    },
    headerTitle: {

    }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: "rgba(5, 62, 161, 0.01)",
    },
}));

function createData(currency:string, yesterday:string, status:string, totalEarnings:string, totalPaid:string,balance:string) {
    return { currency, yesterday,status,totalEarnings,totalPaid,balance };
}

const rows = [
    createData('BTC', "0.001151", "cant_pay", "0.10", "0.2","0.07"),
    createData('BCH', "0", "cant_pay", "0.8", "0.2","0.07"),
    createData('BSV', "0", "cant_pay", "0.6", "0.2","0.07"),
    createData('DGB', "0", "cant_pay", "116.52", "0.2","0.07"),
];

const Balance = () => {
    const styles = useStyles();
    return (
       <Container maxWidth={"xl"}>
           <Card className={styles.card} sx={{mt:3}}>
               <CardHeader
                   className={styles.cardHeader}
                   title="EARNINGS"
                   titleTypographyProps={{
                       style:{
                           fontSize: 17,
                           color: "#fff"
                       }
                   }}
               />
               <CardContent className={styles.cardContent}>
                   <TableContainer component={Paper}>
                       <Table sx={{ width: "100%" }} aria-label="customized table">
                           <TableHead>
                               <TableRow style={{borderRadius: "3px 3px 0 0"}}>
                                   <StyledTableCell>Currency</StyledTableCell>
                                   <StyledTableCell align="right">Yesterday</StyledTableCell>
                                   <StyledTableCell align="right">Status</StyledTableCell>
                                   <StyledTableCell align="right">Total Earnings</StyledTableCell>
                                   <StyledTableCell align="right">Total Paid</StyledTableCell>
                                   <StyledTableCell align="right">Balance</StyledTableCell>
                               </TableRow>
                           </TableHead>
                           <TableBody>
                               {rows.map((row) => (
                                   <StyledTableRow key={row.currency}>
                                       <StyledTableCell component="th" scope="row">
                                           {row.currency}
                                       </StyledTableCell>
                                       <StyledTableCell align="right">{row.yesterday}</StyledTableCell>
                                       <StyledTableCell align="right">{row.status}</StyledTableCell>
                                       <StyledTableCell align="right">{row.totalEarnings}</StyledTableCell>
                                       <StyledTableCell align="right">{row.totalPaid}</StyledTableCell>
                                       <StyledTableCell align="right">{row.balance}</StyledTableCell>
                                   </StyledTableRow>
                               ))}
                           </TableBody>
                       </Table>
                   </TableContainer>
               </CardContent>
           </Card>
       </Container>
    );
}

export default Balance;
