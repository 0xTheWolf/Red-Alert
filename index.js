import tpLink from 'tplink-smarthome-api'
import _ from 'lodash'
import express from 'express'

const app = express()
const port = 1434
const client = new tpLink.Client();
const timerTimeout = 20000

let devices = []
let timer = null


// Look for devices
client.startDiscovery().on('device-new', async (device) => {
	devices = [...client.devices.values()]
		.filter(async device => (await device.getSysInfo()).alias == 'ALERT')
		//.forEach(device => device.setPowerState(false));
		console.log('New Device Found');
});

const toggleDevices = (isOn=false)=>{
	devices.forEach(device => device.setPowerState(isOn));
}

const alert = ()=>{
	toggleDevices(true)
	if(timer) clearTimeout(timer);
	timer = setTimeout(()=>toggleDevices(false), timerTimeout)
}


app.get('/', async (req, res)=>{
	alert()
	console.log('TRIGGER ALERT')
	res.json({
		success: true
	})
})

app.listen(process.env.PORT || port, () => {
    console.log(`RED ALERT ONLINE!!!!`)
  })
