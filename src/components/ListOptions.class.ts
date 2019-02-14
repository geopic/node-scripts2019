// * ------------------------------------
// * List of options for the application.
// * ------------------------------------
import { exec } from 'child_process';
import * as fs from 'fs-extra';
import os from 'os';
import path from 'path';
import readline from 'readline';
import { Option } from '../types';

export default class ListOptions {
  /**
   * Default list of options for the command line application.
   */
  public static get entries(): Option[] {
    return [
      {
        displayText: 'Command-line project setup -- Node.js',
        script: () => {
          /**
           * Output messages for command line. Takes in name of project, returns array of messages to show at each successful step.
           * @param {String} projectName Name of project.
           * @returns {Array} Messages to show at each successful step of the process one-by-one.
           */
          const messages = (projectName?: string) => {
            const arr = [
              `User input successful. Beginning git clone into ${path.join(process.cwd(), projectName)}...`,
              `Clone successful. Switching to ${path.sep}${projectName}...`,
              `Removing and re-initialising git repository...`,
              `Done! Remember to run npm install!`
            ];

            return arr.map((val, index) => val = `(${index}): ${val}`);
          };

          // ========================================== //
          // Ask user for details of project via input. //
          // ========================================== //
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });

          return new Promise(resolve => {
            rl.question('What do you wish to name the project? ', answer => {
              // Test for invalid directory characters in Windows
              if (/[^a-zA-Z\d :]/g.test(answer) && os.type() === 'Windows_NT') {
                throw new Error('Cannot create directory with invalid characters.');
              }

              // Replace whitespace with '-'
              answer = answer.replace(/\s+/g, '-');

              resolve(answer);
            });
          })
          .then((projectName: string) => {
            console.log(messages(projectName)[0]);

            // ================================================= //
            // Clone from project template repository on GitHub. //
            // ================================================= //
            exec(`git clone --depth=1 https://github.com/tedjenkins/node-cmdline-project-generator.git ${projectName}`, (err: Error) => {
              if (err) { throw err; }
              console.log(messages(projectName)[1]);
            });

            // =================================================================== //
            // Delete .git directory from cloned repository then create a new one. //
            // =================================================================== //
            fs.emptyDir(path.resolve(process.cwd(), projectName, '.git'))
              .then(() => fs.rmdirSync(path.resolve(process.cwd(), projectName, '.git')))
              .catch((err: Error) => { throw err; });

            exec('git init', { cwd: path.resolve(process.cwd(), projectName) }, (err: Error) => {
              if (err) { throw err; }
              console.log(messages()[2]);
            });

            // ======================== //
            // Process is now complete. //
            // ======================== //
            console.log(messages()[3]);
          })
          .finally(() => rl.close())
          .catch((err: Error) => { throw err; });
        }
      }
    ];
  }
}
