import * as readline from 'readline';
import * as fs from 'fs';
import 'colors';
import {install} from './install';
import {main} from './main';

const welcome = new Promise((resolve) => {
  // Print Welcome message.
  const rl = readline.createInterface({
    input: fs.createReadStream('text/logo.txt')
  });

  rl.on('line', function(line: any) {
    console.log(
      line.substring(0,4) +
      line.substring(4, 30).cyan.bold +
      line.substring(30, 33) +
      line.substring(33, 42).green.bold +
      line.substring(42)
    );
  });

  rl.on('close', function() {
    // Print the welcome screen.
    console.log('');
    console.log(fs.readFileSync('text/welcome.txt').toString().green);
    resolve();
  });
});

welcome.then(() => {
  main
    .then((App: any) => {
      const installSteps = {
        download: false,
        extract: false,
        import: false,
        user: false,
      };

      // Check for the client folder.
      if (!fs.existsSync('client')) {
        installSteps.download = true;
        installSteps.extract = true;
      }

      return App.models.Form.count()
        .then(count => {
          if (count === 0) {
            installSteps.import = true;
            installSteps.user = true;
          }

          if (installSteps.download || installSteps.extract || installSteps.import || installSteps.user) {
            install(App, installSteps, () => {});
          }
        });
    })
    .catch(console.error);
});