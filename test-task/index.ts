import tl = require('azure-pipelines-task-lib/task');
const { exec } = require("child_process");

 async function run() {
    const licenseKey: string | undefined = tl.getInput('license-key-1', true);
    const licenseCertificate: string | undefined = tl.getInput('license-key-2', true)
    let parapyPyPiAddress: string | undefined = tl.getInput('parapyPyPIAddress', false);
    parapyPyPiAddress = parapyPyPiAddress ? parapyPyPiAddress : "pypi.parapy.nl";
    const parapyPyPIUsername: string | undefined = tl.getInput('parapyPyPIUsername', true);
    const parapyPyPIPassword: string | undefined = tl.getInput('parapyPyPIPassword', true);

    const installPythonSerialized: string | undefined = tl.getInput('installPython', false);
    const installPython = installPythonSerialized === "true";
    // this task assumes the ParaPy application code is already cloned and resides in the current folder

    let preSetup: string[] = []
    if (installPython) {
        preSetup = [
            'sudo apt-get update',
            'sudo apt-get install python3.11'
        ];
    }

    await runCommandsOrThrow([...preSetup, 
        ...['sudo hostname ' + licenseKey,
        'pip install -U -f https://extras.wxpython.org/wxPython4/extras/linux/gtk3/ubuntu-20.04 "wxPython~=4.2.1"',
        'sudo apt-get update',
        'sudo apt-get install -y --no-install-recommends build-essential cmake libdouble-conversion3 libgfortran4 libglu1-mesa libopengl0 libqt5core5a libqt5gui5 libqt5help5 libqt5opengl5 libqt5printsupport5 libqt5svg5 libqt5x11extras5 libqt5xml5 libsdl1.2debian libsdl2-2.0-0 libssl-dev libssl1.1 libtbb2',
        'pip install --upgrade pip',
        `pip install -r requirements-test.txt --index-url https://${ parapyPyPIUsername }:${ parapyPyPIPassword }@${ parapyPyPiAddress }/simple/`,
        `export PARAPY_LIC=${ licenseCertificate };export PARAPY_HEADLESS=true;pytest`]
    ])

 }


 function runCommandPromise(command: string): Promise<void> {
    return new Promise((res, rej) => {
        exec(command, (error: any, stdout: any, stderr: any) => {
            console.log(stdout);
            if (error) {
                console.error(`error: ${error.message}`);
            }
            if (stderr) {
                console.warn(`stderr: ${stderr}`);
            }
            if(error) {
                rej(error + ", " + stderr);
            }
            res();
    })
 })}


async function runCommandsOrThrow(commands: string[]) {
    for(const command of commands) {
        try {
            await runCommandPromise(command);
        } catch(e) {
            throw new Error("One of the commands failed: " + command + ",\nerror: " + e);
        }
    }
}

 run();