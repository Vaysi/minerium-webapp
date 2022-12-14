import {Box, Button, IconButton, MobileStepper, Pagination, TextField} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {ContentCopy, KeyboardArrowLeft, KeyboardArrowRight} from "@mui/icons-material";
import {useContext, useEffect, useState} from "react";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {toast} from "react-toastify";
import {userContext} from "../../utils/context";

const useStyles: any = makeStyles((theme: any) => ({}));

const copyButton = (text: string) => (
    <CopyToClipboard text={text} onCopy={() => toast.success('Successfully Copied !')}>
        <IconButton color="primary" component="span">
            <ContentCopy/>
        </IconButton>
    </CopyToClipboard>
);

const step1 = <>
    <h4>1. Connect to The Miner</h4>
    <ul className="bluedot">
        <li>Connect your computer to the same router or switch that your
            miner is connected to.
        </li>
        <li>Get the IP address of the miner.</li>
        <li>Using your browser, log in to the miner.</li>
    </ul>
</>;

const step2 = <>
    <h4>2. Config the Miner &amp; Connect to Pool</h4>
    <ul className="bluedot">
        <li>Set the pool URL to Minerium addresses listed below this page.</li>
        <li>Set the worker to hans.workerID.</li>
        <li>Set the password to any content you choose; just don’t leave
            it blank.
        </li>
    </ul>
    <TextField
        fullWidth
        id="address"
        sx={{my: 1}}
        size={"small"}
        value="stratum+tcp://stratum.minerium.com:3333"
        InputProps={{endAdornment: copyButton("stratum+tcp://stratum.minerium.com:3333")}}
    />
    <TextField
        fullWidth
        id="address2"
        sx={{my: 1}}
        size={"small"}
        value="stratum+tcp://stratum.minerium.com:4444"
        InputProps={{endAdornment: copyButton("stratum+tcp://stratum.minerium.com:4444")}}
    />
    <TextField
        fullWidth
        id="address3"
        sx={{my: 1}}
        size={"small"}
        value="stratum+tcp://stratum.minerium.com:44443"
        InputProps={{endAdornment: copyButton("stratum+tcp://stratum.minerium.com:44443")}}
    />
</>;

const step4 = <>
    <h4>4. Enjoy Mining</h4>
    <p>Once the miner is connected to the Minerium pool, you can
        confirm its status to view data in the background page,
        including miner uptime, hashrate status and mining revenue.</p>
    <p>Having a problem? Check our FAQ page to find more.</p>
</>;


const AddWorkerStepper = () => {
    const styles = useStyles();

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const {user} = useContext(userContext);


    const step3 = <>
        <h4>3. An Example</h4> <p>A miner with the mining account username:
        <b style={{paddingRight:3,paddingLeft:3,textTransform:"capitalize"}}>{user && user.username || 'username'}</b>
        and a worker named
        <b  style={{paddingRight:3,paddingLeft:3}}>Worker001</b>
        who wants to connect to our pool server would configure his/her
        device as follows:</p> <p><b  style={{paddingRight:2}}>URL:</b>
        stratum+tcp://pool.minerium,com:3333<br/> <b style={{paddingRight:2}}>Username:</b> {user && user.username || 'username'}.worker001<br/> <b>Password:</b>
        123<br/></p> <p>Please note, each miner requires its own ID.</p>
    </>;


    const steps = [
        {
            description: step1,
        },
        {
            description: step2,
        },
        {
            description: step3,
        },
        {
            description: step4,
        },
    ];
    const maxSteps = steps.length;

    useEffect(() => {
        if (document) {
            let els = document.querySelectorAll('.MuiMobileStepper-dots .MuiMobileStepper-dot');
            for (let i=0;i < 4;i++) {
                els[i].addEventListener("click", function(){
                    setActiveStep(i);
                });
            }
        }
    },[]);

    return (
        <Box sx={{flexGrow: 1}} className={"customStep"}>
            <Box sx={{width: '100%', p: 2}}>
                {steps[activeStep].description}
            </Box>
            <MobileStepper
                variant="dots"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        color={"primary"}
                        disabled={activeStep === maxSteps - 1}
                        variant={"contained"}
                    >
                        Next
                        <KeyboardArrowRight/>
                    </Button>
                }
                backButton={
                    <Button variant={"contained"} size="small" color={"primary"} onClick={handleBack}
                            disabled={activeStep === 0}>
                        <KeyboardArrowLeft/>
                        Back
                    </Button>
                }
            />
        </Box>
    );
}

export default AddWorkerStepper;
