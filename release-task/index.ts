import tl = require('azure-pipelines-task-lib/task');
const { exec } = require("child_process");

 async function run() {
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

    let preSetup: string[] = []
    if (installPython) {
        preSetup = [
            'sudo apt-get update',
            'sudo apt-get install python3.11'
        ];
    }

    await runCommandsOrThrow([...preSetup, 
        ...[
            'pip install --upgrade pip',
            `pip install parapy-cloud-cli --index-url https://${ parapyPyPIUsername }:${ parapyPyPIPassword }@${ parapyPyPiAddress }/simple/`,
            `parapy cloud app release . --url ${ parapyCloudAddress } --client-id ${ serviceAccountIdentifier } --secret ${ serviceAccountSecret } --version ${ parapyAppVersion } --id ${ parapyAppId } ${deploy ? " --deploy": "" }`
        ]]);
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