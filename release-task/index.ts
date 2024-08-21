import tl = require('azure-pipelines-task-lib/task');
const { exec } = require("child_process");

 async function run() {
    const licenseKey: string | undefined = tl.getInput('licenseKey', true);
    let parapyPyPiAddress: string | undefined = tl.getInput('parapyPyPIAddress', false);
    parapyPyPiAddress = parapyPyPiAddress ? parapyPyPiAddress : "pypi.parapy.nl";
    const parapyPyPIUsername: string | undefined = tl.getInput('parapyPyPIUsername', true);
    const parapyPyPIPassword: string | undefined = tl.getInput('parapyPyPIPassword', true);
    const parapyCloudAddress: string | undefined = tl.getInput('parapyCloudAddress');
    const serviceAccountIdentifier: string | undefined = tl.getInput('serviceAccountIdentifier', true);
    const serviceAccountSecret: string | undefined = tl.getInput('serviceAccountSecret', true);
    const parapyAppId: string | undefined = tl.getInput('parapyAppId', true);
    const parapyAppVersion: string | undefined = tl.getInput('parapyAppVersion', true);
    const deploySerialized: string | undefined = tl.getInput('deploy', true);
    const deploy = deploySerialized === "true";

    const installPythonSerialized: string | undefined = tl.getInput('installPython', false);
    const installPython = installPythonSerialized === "true";
    // this task assumes the ParaPy application code is already cloned and resides in the current folder

    if (installPython) {
        runCommandsOrThrow([
            'sudo apt-get update',
            'sudo apt-get install python3.11'
        ])
    }

    runCommandsOrThrow([
        'sudo hostname ' + licenseKey,
        'pip install -U -f https://extras.wxpython.org/wxPython4/extras/linux/gtk3/ubuntu-20.04 "wxPython~=4.2.1"',
        'sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 5DC22404A6F9F1CA',
        'sudo apt-get update',
        'sudo apt-get install -y --no-install-recommends build-essential cmake libdouble-conversion3 libgfortran4 libglu1-mesa libopengl0 libqt5core5a libqt5gui5 libqt5help5 libqt5opengl5 libqt5printsupport5 libqt5svg5 libqt5x11extras5 libqt5xml5 libsdl1.2debian libsdl2-2.0-0 libssl-dev libssl1.1 libtbb2',
        `pip install parapy-cloud-cli --index-url https://${ parapyPyPIUsername }:${ parapyPyPIPassword }${ parapyPyPiAddress }}/simple/`,
        `parapy cloud app release . --url ${ parapyCloudAddress } --client-id ${ serviceAccountIdentifier } 
        --secret ${ serviceAccountSecret } --version ${ parapyAppVersion } --id ${ parapyAppId } ${deploy ? " --deploy": "" }`
    ])
 }


function runCommandOrThrow(command: string) {
    exec("bash -c " + '"' + command + '"', (error: any, stdout: any, stderr: any) => {
        console.log(stdout);
        if (error) {
            console.error(`error: ${error.message}`);
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        if(error || stderr) {
            throw new Error("execution failed");
        }
    })
 }


function runCommandsOrThrow(commands: string[]) {
    commands.forEach(runCommandOrThrow)
}

 run();