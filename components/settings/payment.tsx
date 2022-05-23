import type {NextPage} from 'next'
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    useMediaQuery
} from "@mui/material";
import CustomCard from "../../components/inline-components/card";
import {useEffect, useState} from "react";
import {$$getCap, $$setCap} from "../../utils/api";
import {makeStyles, styled} from "@mui/styles";
import {Cap} from "../../utils/interfaces";
import {toast} from "react-toastify";
import {walletAddress} from "../../utils/functions";


const useStyles: any = makeStyles((theme: any) => ({
    cardHeader: {
        backgroundColor: "#043180",
        color: "#fff"
    },
    cardContent: {
        backgroundColor: "var(--blue-ghost)"
    },
    headerTitle: {},
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

const PaymentSettings: NextPage = () => {
    const styles = useStyles();
    const [cap, setCap] = useState<Array<Cap>>([]);
    const [coin, setCoin] = useState<string>('BTC');
    const [wallet, setWallet] = useState<string>('');
    const [priceCap, setPriceCap] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const match900 = useMediaQuery('(max-width:900px)');

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        $$getCap().then(response => {
            setCap(response.data);
        });
    }, []);

    const submit = () => {
        setLoading(true);
        $$setCap(coin, priceCap, wallet).then(response => {
            setLoading(false);
            toast.success('Settings Saved');
            setCap(cap.map((item) => {
                if (item.coin == coin) {
                    item.priceCap = priceCap;
                    item.wallet = wallet;
                }
                return item;
            }));
            handleClose();
        });
    };

    return (
        <>
            <CustomCard titleProps={{title: "Payment Settings"}}>
                {
                    cap.length < 1 ? <Skeleton variant="rectangular" height={118}/> : ""
                }
                {cap.length > 0 && <TableContainer component={Paper} className={"tableContainer"} sx={{backgroundColor:"transparent"}}>
                    <Table sx={{width: "100%"}} aria-label="customized table">
                        <TableHead>
                            <TableRow style={{borderRadius: "3px 3px 0 0"}}>
                                <StyledTableCell>Currency</StyledTableCell>
                                <StyledTableCell align="center">Wallet Address</StyledTableCell>
                                <StyledTableCell align="center">Minimum Payout</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cap.map((row) => (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell>
                                        {row.coin.toUpperCase()}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.wallet && !match900 ? walletAddress(row.wallet) : (
                                        <Button onClick={() => {
                                            setCoin(row.coin);
                                            setPriceCap(row.priceCap);
                                            setWallet(row.wallet);
                                            handleClickOpen();
                                        }} variant={"contained"} color={"primary"}>
                                            Add
                                        </Button>
                                    )}</StyledTableCell>
                                    <StyledTableCell align="center">{row.priceCap}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button onClick={() => {
                                            setCoin(row.coin);
                                            setPriceCap(row.priceCap);
                                            setWallet(row.wallet);
                                            handleClickOpen();
                                        }} variant={"contained"} color={"primary"}>
                                            Edit
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>}
            </CustomCard>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{coin?.toUpperCase()} Payment</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="wallet"
                        label="Wallet Address"
                        fullWidth
                        value={wallet}
                        onChange={(e) => setWallet(e.target.value)}
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        id="priceCap"
                        label="Create Payment When Earning Reaches"
                        fullWidth
                        value={priceCap}
                        onChange={(e) => setPriceCap(parseInt(e.target.value))}
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={submit} variant={"contained"}
                            startIcon={loading ? <CircularProgress size={20}/> : ''}>Save</Button>
                    <Button onClick={handleClose} autoFocus>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PaymentSettings;
