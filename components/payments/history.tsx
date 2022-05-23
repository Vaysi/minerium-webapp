import {makeStyles} from "@mui/styles";
import {useEffect, useState} from "react";
import {$$paymentHistory} from "../../utils/api";
import moment from "moment";
import {DataGrid, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import CustomCard from "../inline-components/card";
import {sumUp} from "../../utils/functions";

const useStyles: any = makeStyles((theme: any) => ({
    earnings: {},
    card: {},
    cardHeader: {
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
    noUnder: {
        textDecoration: "none",
    }
}));


const PaymentHistory = () => {
    const styles = useStyles();
    const [history, setHistory] = useState<Array<any>>([]);

    useEffect(() => {
        $$paymentHistory().then(response => setHistory(response.data));
    }, []);

    const getWalletLink = (params: GridRenderCellParams) => {
        return params.row.wallet ?
            <a className={styles.noUnder} href={walletLink(params.row)} rel={"noreferrer"} target="_blank">{sumUp(params.row.wallet,10)}</a> : 'Not Paid';
    };

    const getTransactionLink = (params: GridRenderCellParams) => {
        return params.row.txInfo ?
            <a className={styles.noUnder} href={txInfoLink(params.row)} rel={"noreferrer"} target="_blank">{sumUp(params.row.txInfo,10)}</a> : 'Not Paid';
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


    const txInfoLink = (item: any) => {
        let txInfoSites = {
            "dgb": `https://digiexplorer.info/tx/${item.txInfo}`,
            "bsv": `https://whatsonchain.com/tx/${item.txInfo}`,
            "bch": `https://www.blockchain.com/bch/tx/${item.txInfo}`,
            "btc": `https://www.blockchain.com/btc/tx/${item.txInfo}`
        }
        //@ts-ignore
        return txInfoSites[item.currency];
    };

    const walletLink = (item: any) => {
        let walletSites = {
            "dgb": `https://digiexplorer.info/address/${item.wallet}`,
            "bsv": `https://whatsonchain.com/address/${item.wallet}`,
            "bch": `https://www.blockchain.com/bch/address/${item.wallet}`,
            "btc": `https://www.blockchain.com/btc/address/${item.wallet}`
        }
        //@ts-ignore
        return walletSites[item.currency]
    };

    return (
        <CustomCard titleProps={{title: "Earning History"}}>
            <div style={{display: 'flex', height: '100%', minHeight: 400}}>
                <div style={{flexGrow: 1}} className="tableContainer historyTable">
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
        </CustomCard>
    );
}

export default PaymentHistory;
