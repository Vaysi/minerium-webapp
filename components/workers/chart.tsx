import {Box, Button, ButtonGroup, TablePagination,} from "@mui/material";
import {makeStyles} from "@mui/styles";
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
import {WorkersGraph} from "../../utils/interfaces";
import {useContext, useEffect, useState} from "react";
import CustomCard from "../inline-components/card";
import {themeModeContext} from "../../utils/context";
import {ArrowLeft, ArrowRight} from "@mui/icons-material";
import moment from "moment";


const useStyles: any = makeStyles((theme: any) => ({
    arrowButton: {
        "[data-theme=dark] &": {
            backgroundColor: "rgba(255,255,255,.5)"
        }
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

function format_time(timestamp: number) {
    const dtFormat = new Intl.DateTimeFormat('en-US', {
        timeStyle: 'medium',
        timeZone: 'UTC'
    });

    return dtFormat.format(new Date(timestamp * 1e3));
}

const r = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

interface Props {
    data: WorkersGraph,
    options?: any;
    since: any;
    visibleWorkers: Array<any>;
    page: {
        page: number;
        setPage: any;
    }
}

function* colorize() {
    let colors = ['#F44336', '#8BC34A', '#FF9800', '#673AB7', '#00BCD4'];
    let index = 0;
    while (true) {
        if (index >= colors.length) {
            index = 0;

        }
        yield colors[index]
        index++;
    }
}

const HashChart = (props: Props) => {
    const styles = useStyles();
    const {mode} = useContext(themeModeContext);
    const newColors = colorize();

    const workersToGraph = (data: Array<any>) => {
        let newWorkers = [];
        for (const newWorker of props.visibleWorkers) {
            newWorkers.push(data.find((item) => item.name == newWorker.worker_name));
        }
        return newWorkers.map((item: any) => {
            let color = newColors.next().value;
            //@ts-ignore
            item.label = item.name;
            //@ts-ignore
            item.data = item.rates;
            //@ts-ignore
            item.borderColor = color;
            //@ts-ignore
            item.backgroundColor = color;
            item.lineTension = 0.4;
            return {
                ...item, ...{
                    pointBorderColor: color,
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: color,
                    pointHoverBorderWidth: 2,
                    pointRadius: 2,
                    pointHitRadius: 20,
                }
            };
        });
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
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
                },
            }
        },
        maintainAspectRatio: false,
    };

    const [workersData, setWorkersData] = useState(workersToGraph(props.data.workers));

    const [start, setStart] = useState(0);

    const {since, setSince} = props.since;

    useEffect(() => {
        setWorkersData(workersToGraph(props.data.workers));
    }, [props.data,props.visibleWorkers]);

    const labels = props.data.timestamps.map(item => {
        return moment(item, "YYYYMMDDhh").format("MM-DD hh:mm")
    });

    const data = {
        labels,
        datasets: workersData.slice(start, start + 5),
    };

    const nextWorkers = () => {
        setStart(start + 5);
    };

    const prevWorkers = () => {
        setStart(start - 5);
    };

    const canGoNext = start + 5 > workersData.length;

    useEffect(() => console.log(data),[data]);

    return (
        <>
            <CustomCard titleProps={{title: "Hashrate Chart"}} cardProps={{style:{position:"relative"}}}>
                <Box style={{minHeight: "50vh"}}>
                    {
                        //@ts-ignore
                        (<Line options={props.options ?? options} data={data}/>)
                    }
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <ButtonGroup sx={{mt: 2}} variant="contained" aria-label="outlined primary button group">
                        <Button className={styles.arrowButton} style={{minWidth: 109}}
                                onClick={() => setSince(since + 1)} variant={"outlined"}
                                sx={{textTransform: "none"}}>Previous</Button>
                        <Button style={{minWidth: 109}}
                                sx={{textTransform: "none"}}>{moment().subtract(since, 'd').format("YYYY-MM-DD")}</Button>
                        <Button className={styles.arrowButton} onClick={() => setSince(since - 1)} variant={"outlined"}
                                sx={{textTransform: "none"}} style={{minWidth: 109}} disabled={since == 1}>Next</Button>
                    </ButtonGroup>
                </Box>
                <Box sx={{ml:"auto",position:{xs:"relative",sm:"absolute"},bottom:{xs:0,sm:15},right:0}}>
                    <TablePagination
                        component="div"
                        count={workersData.length}
                        page={props.page.page}
                        onPageChange={(event, page) => {
                            props.page.setPage(page);
                        }}
                        rowsPerPage={5}
                        labelRowsPerPage={""}
                        rowsPerPageOptions={[]}
                    />
                </Box>
            </CustomCard>
        </>
    );
}

export default HashChart;
