import {Backdrop, Box, Button, CircularProgress, useMediaQuery,} from "@mui/material";
import {makeStyles, useTheme} from "@mui/styles";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {useContext, useEffect, useState} from "react";
import moment from "moment";
import CustomCard from "../inline-components/card";
import {themeModeContext} from "../../utils/context";


const useStyles: any = makeStyles((theme: any) => ({
    earnings: {},
    card: {},
    cardHeader: {
        backgroundColor: "#043180",
        color: "#fff"
    },
    cardContent: {
        backgroundColor: "var(--blue-ghost)",
        minHeight: "50vh",
    },
    headerTitle: {},
    active: {
        filter: "drop-shadow(0px 10px 50px rgba(0, 0, 0, 0.25))",
        boxShadow: "0px 10px 50px rgba(0, 0, 0, 0.25)",
        backgroundColor: "#043180",
        borderRadius: "15px",
        fontFamily: "Open Sans",
        fontSize: "17px",
        textTransform: "none",
        minWidth:100,
    },
    deactive: {
        filter: "drop-shadow(0px 10px 50px rgba(0, 0, 0, 0.25))",
        boxShadow: "0px 10px 50px rgba(0, 0, 0, 0.25)",
        backgroundColor: "#043180",
        fontFamily: "Open Sans",
        borderRadius: "15px",
        fontSize: "17px",
        opacity: 0.65,
        textTransform: "none",
        minWidth:100,
    },
    backdrop: {
        position: "absolute"
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


interface Props {
    data: any,
    options?: any;
    type: 'day' | 'hour';
    setFilter: any;
}

const HashChart = (props: Props) => {
    const styles = useStyles();

    const [labels, setLabels] = useState([]);
    const [workersData, setWorkersData] = useState(props.data);
    const {mode} = useContext(themeModeContext);
    const theme = useTheme();
    const [loading,setLoading] = useState(false);
    //@ts-ignore
    const matches = useMediaQuery(theme.breakpoints.down('sm'));


    const options = () => {
        return {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
            },

            scales: {
                y: {
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function (value: any, index: number, values: any) {
                            return value + ' TH/s';
                        },
                        color: mode == 'dark' ? "#fff" : "#000"
                    }
                },
                x: {
                    ticks: {
                        color: mode == 'dark' ? "#fff" : "#000"
                    }
                }
            },
            maintainAspectRatio: false,
        };
    };


    useEffect(() => {
        if (props.data && props.data.length > 0) {
            let labelsX: any = [];
            props.data.map((item: any) => {
                labelsX.push(props.type == 'hour' ? moment(item.hour, 'YYYYMMDDHH').format('MM-DD HH:mm') : moment(item.day, 'YYYYMMDD').format('YYYY-MM-DD'));
            });
            setLabels(labelsX);
            setWorkersData(props.data);
            if(loading){
                setLoading(false);
            }
        }
    }, [props.data]);

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Hashrate",
                data: workersData.map((item: any) => {
                    return props.type == 'hour' ? item.hash_1h : item.hash_1day;
                }),
                fill: true,
                lineTension: 0.4,
                backgroundColor: '#043180',
                borderColor: '#043180',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#043180',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: mode == 'light' ? '#043180' : '#fff',
                pointHoverBorderWidth: 2,
                pointRadius: 2,
                pointHitRadius: 20,
            }
        ],
    };

    const timeframeButtons = (
        <>
            <Button sx={{mr: 2}} variant={"contained"}
                    className={props.type == 'hour' ? styles.active : styles.deactive} color={"primary"}
                    onClick={() => {
                        if (props.type != 'hour') {
                            props.setFilter('hour');
                            setLoading(true);
                        }
                    }}>
                By Hour
            </Button>
            <Button variant={"contained"} className={props.type == 'day' ? styles.active : styles.deactive}
                    color={"primary"} onClick={() => {
                if (props.type != 'day') {
                    props.setFilter('day');
                    setLoading(true);
                }
            }}>
                By Day
            </Button>
        </>
    );


    return (
        <CustomCard titleProps={{
            title: "Hashrate Chart", action: !matches && (timeframeButtons)
        }} cardProps={{style:{position: "relative"}}}>
            {matches && (
                <Box sx={{mb: 2}} textAlign={"center"}>
                    {timeframeButtons}
                </Box>
            )}
            <Box sx={{height: {md: 450,xs:300}}}>
                {
                    //@ts-ignore
                    labels.length > 0 && workersData.length > 0 && (<Line options={props.options ?? options()} data={data}/>)
                }
            </Box>
            <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1,px:5,py:5}} className={styles.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </CustomCard>
    );
}

export default HashChart;
