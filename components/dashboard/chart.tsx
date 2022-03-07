import {
    Box,
    Button, ButtonGroup,
    Card,
    CardContent,
    CardHeader,
    Container,
} from "@mui/material";
import {makeStyles, styled} from "@mui/styles";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {WorkersGraph} from "../../utils/interfaces";
import {useEffect, useState} from "react";
import moment from "moment";


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
        backgroundColor: "var(--blue-ghost)",
        minHeight: "50vh",
        /*"@media (max-width: 900px)": {
            minHeight: "40vh",
            maxHeight: "40vh",
        },
        "@media (max-width: 700px)": {
            minHeight: "25vh",
            maxHeight: "25vh",
        },*/
    },
    headerTitle: {

    },
    active: {
        filter: "drop-shadow(0px 10px 50px rgba(0, 0, 0, 0.25))",
        boxShadow: "0px 10px 50px rgba(0, 0, 0, 0.25)",
        backgroundColor: "#043180",
        borderRadius: "15px",
        fontFamily: "Open Sans",
        fontSize: "22px",
        textTransform: "none"
    },
    deactive: {
        filter: "drop-shadow(0px 10px 50px rgba(0, 0, 0, 0.25))",
        boxShadow: "0px 10px 50px rgba(0, 0, 0, 0.25)",
        backgroundColor: "#043180",
        fontFamily: "Open Sans",
        borderRadius: "15px",
        fontSize: "22px",
        opacity: 0.65,
        textTransform: "none"
    }
}));


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
    },

    scales: {
        y: {
            ticks: {
                // Include a dollar sign in the ticks
                callback: function(value:any, index:number, values:any) {
                    return value + ' TH/s';
                }
            }
        }
    },
    maintainAspectRatio: false,
};


interface Props {
    data: any,
    options?: any;
    type: 'day' | 'hour';
    setFilter: any;
}
const HashChart = (props: Props) => {
    const styles = useStyles();

    const [labels,setLabels] = useState([]);
    const [workersData,setWorkersData] = useState(props.data);


    useEffect(() => {
        if(props.data && props.data.length > 0){
            let labelsX:any = [];
            props.data.map((item:any) => {
                labelsX.push(props.type == 'hour' ? moment(item.hour,'YYYYMMDDHH').format('MM-DD HH:mm') :  moment(item.day,'YYYYMMDD').format('YYYY-MM-DD'));
            });
            setLabels(labelsX);
            setWorkersData(props.data);
        }
    },[props.data]);

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Hashrate",
                data: workersData.map((item:any) => {
                    return props.type == 'hour' ? item.hash_1h : item.hash_1day;
                }),
                fill: true,
                lineTension: 0.4,
                backgroundColor: 'rgba(4, 49, 128, 0.4)',
                borderColor: 'rgba(4, 49, 128, 0.75)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(4, 49, 128, 0.75)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(4, 49, 128, 0.75)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 2,
                pointHitRadius: 20,
            }
        ],
    };

    return (
       <Container maxWidth={"xl"}>
           <Card className={styles.card} sx={{mt:3}}>
               <CardHeader
                   className={styles.cardHeader}
                   title="Hashrate Chart"
                   titleTypographyProps={{
                       style:{
                           fontSize: 17,
                           color: "#fff"
                       }
                   }}
               />
               <CardContent className={styles.cardContent}>
                   <Box sx={{mb:2}} textAlign={"right"}>
                       <Button sx={{mr:2}} variant={"contained"} className={props.type == 'hour' ? styles.active : styles.deactive} color={"primary"} onClick={() => {
                           if(props.type != 'hour'){
                               props.setFilter('hour');
                           }
                       }}>
                          By Hour
                       </Button>
                       <Button variant={"contained"} className={props.type == 'day' ? styles.active : styles.deactive} color={"primary"} onClick={() => {
                           if(props.type != 'day'){
                               props.setFilter('day');
                           }
                       }}>
                           By Day
                       </Button>
                   </Box>
                   <Box sx={{height:{xs:450}}}>
                       {
                           //@ts-ignore
                           labels.length > 0 && workersData.length > 0 && (<Line options={props.options ?? options} data={data} />)
                       }
                   </Box>
               </CardContent>
           </Card>
       </Container>
    );
}

export default HashChart;
