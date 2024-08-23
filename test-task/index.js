"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const { exec } = require("child_process");
async function run() {
    const licenseKey = tl.getInput('licenseKey', true);
    const licenseCertificate = tl.getInput('licenseCertificate', true);
    let parapyPyPiAddress = tl.getInput('parapyPyPIAddress', false);
    parapyPyPiAddress = parapyPyPiAddress ? parapyPyPiAddress : "pypi.parapy.nl";
    const parapyPyPIUsername = tl.getInput('parapyPyPIUsername', true);
    const parapyPyPIPassword = tl.getInput('parapyPyPIPassword', true);
    const installPythonSerialized = tl.getInput('installPython', false);
    const installPython = installPythonSerialized === "true";
    // this task assumes the ParaPy application code is already cloned and resides in the current folder
    let preSetup = [];
    if (installPython) {
        preSetup = [
            'sudo apt-get update',
            'sudo apt-get install python3.11'
        ];
    }
    await runCommandsOrThrow([...preSetup,
        ...['sudo hostname ' + licenseKey,
            'pip install -U -f https://extras.wxpython.org/wxPython4/extras/linux/gtk3/ubuntu-20.04 "wxPython~=4.2.1"',
            'sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 5DC22404A6F9F1CA',
            'sudo apt-get update',
            'sudo apt-get install -y --no-install-recommends build-essential cmake libdouble-conversion3 libgfortran4 libglu1-mesa libopengl0 libqt5core5a libqt5gui5 libqt5help5 libqt5opengl5 libqt5printsupport5 libqt5svg5 libqt5x11extras5 libqt5xml5 libsdl1.2debian libsdl2-2.0-0 libssl-dev libssl1.1 libtbb2',
            `pip install -r requirements-test.txt --index-url https://${parapyPyPIUsername}:${parapyPyPIPassword}@${parapyPyPiAddress}/simple/`,
            `PARAPY_LIC=${licenseCertificate};PARAPY_HEADLESS=true;pytest`]
    ]);
}
function runCommandPromise(command) {
    return new Promise((res, rej) => {
        exec("bash -c " + '"' + command + '"', (error, stdout, stderr) => {
            console.log(stdout);
            if (error) {
                console.error(`error: ${error.message}`);
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
            if (error || stderr) {
                rej();
            }
            res();
        });
    });
}
async function runCommandsOrThrow(commands) {
    for (const command of commands) {
        try {
            await runCommandPromise(command);
        }
        catch {
            break;
        }
    }
}
run();
