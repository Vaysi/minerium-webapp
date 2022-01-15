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
        backgroundColor: "rgba(5, 62, 161, 0.1)",
    },
}));

function createData(id:number,since:string, until:string, price:number, currency:string, earningType:string,settled:string) {
    return { id,since,until,price,currency,earningType,settled };
}

const rows = [
    createData(1,"2021-04-21 00:00","2021-04-22 00:00",0.00227991,"BTC","PPS","Settled"),
    createData(2,"2021-04-21 00:00","2021-04-22 00:00",0.00227991,"BTC","PPS","Settled"),
    createData(3,"2021-04-21 00:00","2021-04-22 00:00",0.00227991,"BTC","PPS","Settled"),
    createData(4,"2021-04-21 00:00","2021-04-22 00:00",0.00227991,"BTC","PPS","Settled"),
    createData(5,"2021-04-21 00:00","2021-04-22 00:00",0.00227991,"BTC","PPS","Settled"),
    createData(6,"2021-04-21 00:00","2021-04-22 00:00",0.00227991,"BTC","PPS","Settled"),
    createData(7,"2021-04-21 00:00","2021-04-22 00:00",0.00227991,"BTC","PPS","Settled"),
    createData(8,"2021-04-21 00:00","2021-04-22 00:00",0.00227991,"BTC","PPS","Settled"),
    createData(9,"2021-04-21 00:00","2021-04-22 00:00",0.00227991,"BTC","PPS","Settled"),
];

const History = () => {
    const styles = useStyles();
    return (
       <Container maxWidth={"xl"}>
           <Card className={styles.card} sx={{mt:3}}>
               <CardHeader
                   className={styles.cardHeader}
                   title="Earnings History"
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
                                   <StyledTableCell>Since</StyledTableCell>
                                   <StyledTableCell align="center">Until</StyledTableCell>
                                   <StyledTableCell align="center">Price</StyledTableCell>
                                   <StyledTableCell align="center">Currency</StyledTableCell>
                                   <StyledTableCell align="center">Earning Type</StyledTableCell>
                                   <StyledTableCell align="center">Settled</StyledTableCell>
                               </TableRow>
                           </TableHead>
                           <TableBody>
                               {rows.map((row) => (
                                   <StyledTableRow key={row.id}>
                                       <StyledTableCell>
                                           {row.since}
                                       </StyledTableCell>
                                       <StyledTableCell align="center">{row.until}</StyledTableCell>
                                       <StyledTableCell align="center">{row.price}</StyledTableCell>
                                       <StyledTableCell align="center">{row.currency}</StyledTableCell>
                                       <StyledTableCell align="center">{row.earningType}</StyledTableCell>
                                       <StyledTableCell align="center">{row.settled}</StyledTableCell>
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

export default History;
