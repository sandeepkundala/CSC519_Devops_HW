const path = require('path');
const fs   = require('fs');
const os   = require('os');
const figlet = require("figlet");
const chalk = require("chalk");
const { spawn } = require('child_process');

exports.command = 'ssh';
exports.desc = 'SSH into the VM';
exports.handler = async argv =>{
	(async() => {
            await ssh();
	})();
};

async function ssh()
{
	const init = () => {
		console.log(
			chalk.green(
				figlet.textSync("NodeJS SSHer", {
					font: "Big",
					horizontalLayout: "default",
					verticalLayout: "default"
				})
			)
		);
	};

	init();

	let identifyFile = path.join(os.homedir(), '.bakerx', 'insecure_private_key');
	let sshExe = `ssh -i "${identifyFile}" -p 2800 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null vagrant@127.0.0.1 `;
	return new Promise( function (resolve, reject){
		spawn(`${sshExe}`,[],{ stdio: 'inherit', shell: true});
	});
}

	
