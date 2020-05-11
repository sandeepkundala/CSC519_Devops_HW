const got    = require("got");
const chalk  = require('chalk');
const os     = require('os');

var config = {};
// Retrieve our api token from the environment variables.
config.token = process.env.NCSU_DOTOKEN;
config.sshkey = process.env.NCSU_DOSSH;
if( !config.token )
{
	console.log(chalk`{red.bold NCSU_DOTOKEN is not defined!}`);
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}

console.log(chalk.green(`Your token is: ${config.token.substring(0,4)}...`));

// Configure our headers to use our token when making REST api requests.
const headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};


class DigitalOceanProvider
{
	// Documentation for needle:
	// https://github.com/tomas/needle

	async createDroplet (dropletName, region, imageName )
	{
		if( dropletName == "" || region == "" || imageName == "" )
		{
			console.log( chalk.red("You must provide non-empty parameters for createDroplet!") );
			return;
		}

		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			"ssh_keys": [config.sshkey],
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		let response = await got.post("https://api.digitalocean.com/v2/droplets", 
		{
	  	 	headers:headers,
		 	json:true,
		 	body: data
		}).catch( err => 
		 	console.error(chalk.red(`createDroplet: ${err}`)));

		if( !response ) return;
		console.log(response.statusCode);
		var droplet_id = response.body.droplet.id;
		if(response.statusCode == 202)
		{
			var sleep = require('sleep');
			sleep.sleep(30);
		 	console.log(chalk.green(`Created droplet id ${response.body.droplet.id}`));
		}
		var url = `https://api.digitalocean.com/v2/droplets/${droplet_id}`;
		response = await got(url, { headers: headers, json:true })
                                                         .catch(err => console.error(`dropletID Not Found!! ${err}`));

		if( !response ) return;
		if( response.body.droplet )
		{
			let droplet = response.body.droplet;
			console.log("IP ADDRESS IS: " + droplet.networks.v4[0].ip_address);
		}
	}
};


async function provision()
{
	let client = new DigitalOceanProvider();

	var name = "skundal"+os.hostname();
	var region = "nyc1"; // Fill one in from #1
	var image = "ubuntu-14-04-x32-do"; // Fill one in from #2
	await client.createDroplet(name, region, image);	
}


// Run workshop code...
(async () => {
	await provision();
})();
