const { exec, spawn } = require('child_process');
export default function publish() {
  exec('git pull', (error, stdout, stderr) => {
    if (error) {
      console.log(`git clone 失败: ${error}`);
      return;
    }
    console.log(stdout);
    exec(
      `${process.platform === 'win32' ? 'npm.cmd' : 'npm'} run tsc`,
      {
        cwd: process.cwd()
      },
      (error, stdout, stderr) => {
        if (error) {
          console.log(`tsc编译 异常: ${error}`);
          return;
        }
        console.log(stdout);
        exec(
          `${process.platform === 'win32' ? 'pm2.cmd' : 'pm2'} reload all`,
          (error, stdout, stderr) => {
            if (error) {
              console.log(`pm2 reload 异常: ${error}`);
              return;
            }
            console.log('pm2 reload all 成功');
            console.log(stdout);
            console.log(stderr);
          }
        );
      }
    );
  });
}
