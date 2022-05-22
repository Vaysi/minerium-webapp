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
import {useContext, useEffect,useMemo, useRef, useState} from "react";
import CustomCard from "../inline-components/card";
import {themeModeContext} from "../../utils/context";
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
    selection: {
        selection: Array<number>;
        setSelection: any;
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
    const chartRef = useRef();
    const [changedCount,setChangedCount] = useState(0);


    const getWorkersNameById = () => {
        return props.selection.selection.map((pItem) => {
            let find = props.visibleWorkers.filter(item => {
                //@ts-ignore
                return item.worker_id == pItem;
            });
            if (find.length) {
                return find.map(item => item.worker_name)[0];
            }
        });
    };


    const workersToGraph = (data: Array<any>) => {
        let newWorkers = [];
        for (const newWorker of props.visibleWorkers) {
            newWorkers.push(data.find((item) => item.name == newWorker.worker_name));
        }

        return newWorkers.filter(item => item != undefined).map((item: any) => {
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
                display: false,
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
        onClick: function(evt:any, element:any,chart:any) {
            if (element.length > 0) {
                // get selected line index
                let selected = element[0].datasetIndex;
                // a flag to determine if all is hidden or not
                let allHidden = true;
                // search and set the flag
                chart.data.datasets.forEach((dataSet:any, i:any) => {
                    if(i != selected) {
                        let meta = chart.getDatasetMeta(i);
                        if(meta.hidden == false){
                            allHidden = false;
                        }
                    }
                });
                // if all hidden , unhidden all
                if(allHidden){
                    chart.data.datasets.forEach((dataSet:any, i:any) => {
                        let meta = chart.getDatasetMeta(i);

                        meta.hidden = false;
                    });
                }else {
                    chart.data.datasets.forEach((dataSet:any, i:any) => {
                        let meta = chart.getDatasetMeta(i);

                        meta.hidden = true;
                    });
                    chart.getDatasetMeta(selected).hidden = false;
                }
                chart.update();
                setChangedCount(changedCount+1);
            }
        }
    };

    const [workersData, setWorkersData] = useState(workersToGraph(props.data.workers));

    const {since, setSince} = props.since;

    useEffect(() => {
        setWorkersData(workersToGraph(props.data.workers));
    }, [props.data,props.visibleWorkers,props.selection.selection]);

    const labels = props.data.timestamps.map(item => {
        return moment(item, "YYYYMMDDhh").format("MM-DD hh:mm")
    });


    const data = {
        labels,
        datasets: workersData.slice(props.page.page * 5, props.page.page * 5 + 5 ),
    };


    useEffect(() => {
        if(chartRef.current){
            if(getWorkersNameById().length){
                //@ts-ignore
                chartRef.current.data.datasets.forEach((dataSet:any, i:any) => {
                    //@ts-ignore
                    let meta = chartRef.current.getDatasetMeta(i);
                    if(getWorkersNameById().includes(dataSet.name)){
                        meta.hidden = false;
                    }else {
                        meta.hidden = true;
                    }
                });
            }else {
                //@ts-ignore
                chartRef.current.data.datasets.forEach((dataSet:any, i:any) => {
                    //@ts-ignore
                    let meta = chartRef.current.getDatasetMeta(i);
                    meta.hidden = false;
                });
            }
            //@ts-ignore
            chartRef.current.update();
            setChangedCount(changedCount+1);
        }
    },[props.selection]);

    useMemo(() => {
        if(chartRef.current){
            if (typeof window !== "undefined") {
                let legends = document.getElementById('legends');
                //@ts-ignore
                legends.innerHTML = "";
                //@ts-ignore
                chartRef.current.data.datasets.forEach((dataSet:any, i:any) => {
                    //@ts-ignore
                    let meta = chartRef.current.getDatasetMeta(i);
                    let checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = dataSet.label;
                    checkbox.value = i;
                    checkbox.id = `dataset${i}`;
                    checkbox.checked = !meta.hidden;
                    // add label
                    let label = document.createElement('label');
                    label.classList.add('customCheck');
                    // add textnode
                    let labelText = document.createTextNode(dataSet.label);
                    //@ts-ignore
                    label.appendChild(checkbox);
                    let icon = document.createElement('i');
                    let text = document.createElement('span');
                    text.appendChild(labelText);
                    label.appendChild(icon);
                    label.appendChild(text);
                    //@ts-ignore
                    legends.appendChild(label);
                    checkbox.addEventListener('change',(e) => {
                        //@ts-ignore
                        const index = e.target.value;
                        //@ts-ignore
                        if(chartRef.current.isDatasetVisible(index)){
                            //@ts-ignore
                            chartRef.current.hide(index);
                        }else {
                            //@ts-ignore
                            chartRef.current.show(index);
                        }
                    });
                });
            }
        }
    },[chartRef.current,changedCount]);


    return (
        <>
            <CustomCard titleProps={{title: "Hashrate Chart"}} cardProps={{style:{position:"relative"}}}>
                <Box style={{minHeight: "50vh"}}>
                    {
                        //@ts-ignore
                        (<Line ref={chartRef} options={props.options ?? options} data={data}/>)
                    }
                </Box>
                <div id="legends"></div>
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
                        count={props.visibleWorkers.length}
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
