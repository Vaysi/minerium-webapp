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
import {$$earningsHistory, $$paymentHistory} from "../../utils/api";
import moment from "moment";
import {DataGrid, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";

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


const PaymentHistory = () => {
    const styles = useStyles();
    const [history,setHistory] = useState<Array<any>>([]);

    useEffect(() => {
        $$paymentHistory().then(response => setHistory(response.data));
    },[]);

    const getWalletLink = (params:GridRenderCellParams) => {
        return params.row.wallet ? <a href={walletLink(params.row)} target="_blank">{params.row.wallet}</a> : 'Not Paid';
    };

    const getTransactionLink = (params:GridRenderCellParams) => {
        return params.row.txInfo ? <a href={txInfoLink(params.row)} target="_blank">{params.row.txInfo}</a> : 'Not Paid';
    };

    const columns: GridColDef[] = [
        {
            field: 'updatedAt',
            headerName: 'Payment Time',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle
        },
        {
            field: 'price',
            headerName: 'Amount',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle
        },
        {
            field: 'wallet',
            headerName: 'Walled Address',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle,
            renderCell: getWalletLink
        },
        {
            field: 'txInfo',
            headerName: 'Transaction Link',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle,
            renderCell: getTransactionLink
        },
    ];


    const txInfoLink = (item:any) => {
        let txInfoSites = {
            "dgb":`https://digiexplorer.info/tx/${item.txInfo}`,
            "bsv":`https://whatsonchain.com/tx/${item.txInfo}`,
            "bch":`https://www.blockchain.com/bch/tx/${item.txInfo}`,
            "btc":`https://www.blockchain.com/btc/tx/${item.txInfo}`
        }
        //@ts-ignore
        return txInfoSites[item.currency];
    };

    const walletLink = (item:any) => {
        let walletSites = {
            "dgb":`https://digiexplorer.info/address/${item.wallet}`,
            "bsv":`https://whatsonchain.com/address/${item.wallet}`,
            "bch":`https://www.blockchain.com/bch/address/${item.wallet}`,
            "btc":`https://www.blockchain.com/btc/address/${item.wallet}`
        }
        //@ts-ignore
        return walletSites[item.currency]
    };

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
                                   item.updatedAt = moment(item.updatedAt).format('YYYY-MM-DD');
                                   item.price = `${item.price} ${(item.currency || '').toUpperCase()}`;
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

export default PaymentHistory;
