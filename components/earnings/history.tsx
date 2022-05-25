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
    Typography, useMediaQuery
} from "@mui/material";
import {makeStyles, styled} from "@mui/styles";
import {EarningHistory, Tab} from "../../utils/interfaces";
import {useEffect, useState} from "react";
import {$$earningsHistory} from "../../utils/api";
import moment from "moment";
import {DataGrid, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import CustomCard from "../inline-components/card";

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

    const matches800 = useMediaQuery("@media (max-width: 800px)");

    const columns: GridColDef[] = [
        {
            field: 'since',
            headerName: 'From',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle,
            renderCell: (params: GridRenderCellParams<string>) => (
                <span style={{textAlign:"center"}}>
                    {
                        matches800 ? (
                            <>
                                {params.value ? params.value.split(" ")[0] : ""}
                                <br />
                                {params.value ? params.value.split(" ")[1].replace("23","00") : ""}
                            </>
                        ) : (
                            <>
                                {params.value ? params.value.split(" ")[0] : ""}
                                {params.value ? params.value.split(" ")[1].replace("23","00") : ""}
                            </>
                        )
                    }
                </span>
            ),
            minWidth: 120,
        },
        {
            field: 'until',
            headerName: 'To',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle,
            renderCell: (params: GridRenderCellParams<string>) => (
                <span style={{textAlign:"center"}}>
                    {
                        matches800 ? (
                            <>
                                {params.value ? params.value.split(" ")[0] : ""}
                                <br />
                                {params.value ? params.value.split(" ")[1].replace("23","00") : ""}
                            </>
                        ) : (
                            <>
                                {params.value ? params.value.split(" ")[0] : ""}
                                {params.value ? params.value.split(" ")[1].replace("23","00") : ""}
                            </>
                        )
                    }
                </span>
            ),
            minWidth: 120,
        },
        {
            field: 'price',
            headerName: 'Amount',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle,
            minWidth: 110,
        },
        {
            field: 'currency',
            headerName: 'Currency',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle,
            minWidth: 120,
        },
        {
            field: 'type',
            headerName: 'Earning Method',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle,
            minWidth: 120,
        },
        {
            field: 'paid',
            headerName: 'Status',
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: styles.headerTitle,
            minWidth: 120
        },
    ];

    return (
       <Container maxWidth={"xl"}>
          <CustomCard titleProps={{title:"Earning History"}}>
              <div style={{display: 'flex', height: '100%', minHeight: 400}}>
                  <div style={{flexGrow: 1}} className="tableContainer historyTable">
                      <DataGrid
                          rows={history.map((item,index) => {
                              item.since = moment(item.since,'YYYYMMDDHH').format('YYYY-MM-DD HH:mm');
                              item.until = moment(item.until,'YYYYMMDDHH').format('YYYY-MM-DD HH:mm');
                              item.paid = item.paid ? 'Settled' : 'Not Settled';
                              item.type = 'PPS';
                              item.id = index;
                              item.currency = item.currency.toUpperCase();
                              return item;
                          })}
                          columns={columns}
                          rowsPerPageOptions={[10]}
                          autoPageSize={true}
                      />
                  </div>
              </div>
          </CustomCard>
       </Container>
    );
}

export default History;
