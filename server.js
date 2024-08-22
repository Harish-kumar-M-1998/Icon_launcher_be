const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = 2354;

app.use(cors());
app.use(express.json());

const apps = [
  { name: 'VS Code', command: 'code', quitCommand: 'taskkill /IM Code.exe /F', icon: 'vs_code_icon.png' },
  { name: 'Chrome', command: '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"', quitCommand: 'taskkill /IM chrome.exe /F', icon: 'chrome_icon.png' },
  { name: 'Zoom', command: '"C:\\Users\\Asus\\Desktop\\Zoom"', quitCommand: 'taskkill /IM Zoom.exe /F', icon: 'zoom_icon.png' },
  { name: 'Postman', command:'"C:\\Users\\Asus\\Desktop\\Postman"', quitCommand: 'taskkill /IM Postman.exe /F', icon: 'postman_icon.png' }
];

app.get('/apps', (req, res) => {
  res.json(apps);
});

app.post('/launch', (req, res) => {
  const appName = req.body.appName;
  const app = apps.find(a => a.name === appName);
  if (app) {
    exec(app.command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error launching app: ${error}`);
        return res.status(500).send('Error launching app');
      }
      res.send('App launched');
    });
  } else {
    res.status(404).send('App not found');
  }
});

app.post('/quit', (req, res) => {
  const appName = req.body.appName;
  const app = apps.find(a => a.name === appName);
  if (app) {
    exec(app.quitCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error quitting app: ${error}`);
        return res.status(500).send('Error quitting app');
      }
      res.send('App quit');
    });
  } else {
    res.status(404).send('App not found');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
