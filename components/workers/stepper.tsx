import {Box, Button, IconButton, MobileStepper, TextField} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {ContentCopy, KeyboardArrowLeft, KeyboardArrowRight} from "@mui/icons-material";
import {useState} from "react";

const useStyles: any = makeStyles((theme: any) => ({}));

const copyButton = (text: string) => (<IconButton color="primary" component="span">
    <ContentCopy/>
</IconButton>);

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
        value="stratum+tcp://stratum.minerium.com:3333"
        InputProps={{endAdornment: copyButton("stratum+tcp://stratum.minerium.com:3333")}}
    />
    <TextField
        fullWidth
        id="address2"
        sx={{my: 1}}
        value="stratum+tcp://stratum.minerium.com:4444"
        InputProps={{endAdornment: copyButton("stratum+tcp://stratum.minerium.com:4444")}}
    />
    <TextField
        fullWidth
        id="address3"
        sx={{my: 1}}
        value="stratum+tcp://stratum.minerium.com:44443"
        InputProps={{endAdornment: copyButton("stratum+tcp://stratum.minerium.com:44443")}}
    />
</>;

const step3 = <>
    <h4>3. An Example</h4> <p>A miner with the mining account username
    <b>hans</b>
    and a worker named
    <b>worker001</b>
    who wants to connect to our pool server would configure his/her
    device as follows:</p> <p><b>URL:</b>
    stratum+tcp://pool.minerium,com:3333<br/> <b>Username:</b> hans.worker001<br/> <b>Password:</b>
    123<br/></p> <p>Please note, each miner requires its own ID.</p>
</>;

const step4 = <>
    <h4>4. Enjoy Mining</h4>
    <p>Once the miner is connected to the Minerium pool, you can
        confirm its status to view data in the background page,
        including miner uptime, hashrate status and mining revenue.</p>
    <p>Having a problem? Check our FAQ page to find more.</p>
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

const AddWorkerStepper = () => {
    const styles = useStyles();

    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = steps.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Box sx={{flexGrow: 1}}>
            <Box sx={{width: '100%', p: 2}}>
                {steps[activeStep].description}
            </Box>
            <MobileStepper
                variant="text"
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
