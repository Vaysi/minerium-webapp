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
import {EarningHistory, Tab} from "../../utils/interfaces";
import {useEffect, useState} from "react";
import {$$earningsHistory} from "../../utils/api";
import moment from "moment";
import {DataGrid, GridColDef} from "@mui/x-data-grid";

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
        backgroundColor: "#043180",
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "3px 3px 0 0"
    },
}));


const History = () => {
    const styles = useStyles();
    const [history,setHistory] = useState<Array<any>>([]);

    useEffect(() => {
        $$earningsHistory().then(response => setHistory(response.data));
    },[]);

    const columns: GridColDef[] = [
        {
            field: 'since',
            headerName: 'Since',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle
        },
        {
            field: 'until',
            headerName: 'Until',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle
        },
        {
            field: 'price',
            headerName: 'Price',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle
        },
        {
            field: 'currency',
            headerName: 'Currency',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle
        },
        {
            field: 'type',
            headerName: 'Earning Type',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle
        },
        {
            field: 'paid',
            headerName: 'Settled',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle
        },
    ];

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
                   <div style={{display: 'flex', height: '100%', minHeight: 400}}>
                       <div style={{flexGrow: 1}}>
                           <DataGrid
                               rows={history.map(item => {
                                   item.since = moment(item.since,'YYYYMMDDHH').format('YYYY-MM-DD H:m');
                                   item.until = moment(item.until,'YYYYMMDDHH').format('YYYY-MM-DD H:m');
                                   item.paid = item.paid ? 'Settled' : 'Not Settled';
                                   item.type = 'PPS';
                                   item.id = (new Date()).getTime();
                                   item.currency = item.currency.toUpperCase();
                                   return item;
                               })}
                               columns={columns}
                               rowsPerPageOptions={[10]}
                               autoPageSize={true}
                           />
                       </div>
                   </div>
               </CardContent>
           </Card>
       </Container>
    );
}

export default History;
