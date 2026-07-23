const { execSync } = require('child_process');

try {
  console.log("Running npm run build...");
  const stdout = execSync("NEXT_TELEMETRY_DISABLED=1 npm run build", { 
    encoding: 'utf-8', 
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } 
  });
  console.log("BUILD SUCCESS");
  console.log(stdout.slice(-1000));
} catch (e) {
  console.log("BUILD FAILED (exit code: " + e.status + ")");
  console.log(e.stdout.slice(-1000));
  if (e.stderr) {
    console.log("STDERR:");
    console.log(e.stderr.slice(-1000));
  }
}
