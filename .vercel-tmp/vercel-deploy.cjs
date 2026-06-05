#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isWindows = os.platform() === 'win32';

const ALLOWED_COMMANDS = new Set(['vercel']);

function log(msg) { console.error(msg); }
function commandExists(cmd) {
  if (!ALLOWED_COMMANDS.has(cmd)) throw new Error(`Command not in whitelist: ${cmd}`);
  try {
    if (isWindows) {
      const result = spawnSync('where', [cmd], { stdio: 'ignore' });
      return result.status === 0;
    } else {
      const result = spawnSync('sh', ['-c', `command -v "$1"`, '--', cmd], { stdio: 'ignore' });
      return result.status === 0;
    }
  } catch { return false; }
}
function getCommandOutput(cmd, args) {
  try {
    const result = spawnSync(cmd, args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], shell: isWindows });
    return result.status === 0 ? (result.stdout || '').trim() : null;
  } catch { return null; }
}
function checkVercelInstalled() {
  if (!commandExists('vercel')) {
    log('Error: Vercel CLI is not installed');
    process.exit(1);
  }
  const version = getCommandOutput('vercel', ['--version']) || 'unknown';
  log(`Vercel CLI version: ${version}`);
}
function checkLoginStatus() {
  log('Checking login status...');
  try {
    const result = spawnSync('vercel', ['whoami'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], shell: isWindows });
    const output = (result.stdout || '').trim();
    if (result.status === 0 && output && !output.includes('Error') && !output.includes('not logged in')) {
      log(`Logged in as: ${output}`);
      return true;
    }
  } catch {}
  return false;
}
function checkProject(projectPath) {
  const absPath = path.resolve(projectPath);
  if (!fs.existsSync(absPath) || !fs.statSync(absPath).isDirectory()) {
    log(`Error: Project directory does not exist: ${absPath}`);
    process.exit(1);
  }
  log(`Project path: ${absPath}`);
  const indexHtml = path.join(absPath, 'index.html');
  if (fs.existsSync(indexHtml)) {
    log('Detected static HTML project');
  } else {
    log('Warning: No index.html detected');
  }
  return absPath;
}
function doDeploy(projectPath) {
  log('');
  log('Starting deployment...');
  log('Deployment environment: Production (Public)');
  log('');
  log('========================================');
  try {
    const result = spawnSync('vercel', ['--yes', '--prod'], {
      cwd: projectPath,
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe'],
      timeout: 300000,
      shell: isWindows
    });
    const output = (result.stdout || '') + (result.stderr || '');
    log(output);
    if (result.status !== 0) {
      throw new Error('Deployment command failed');
    }
    const aliasedMatch = output.match(/Aliased:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
    const productionUrl = aliasedMatch ? aliasedMatch[1] : null;
    const deploymentMatch = output.match(/Production:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
    const deploymentUrl = deploymentMatch ? deploymentMatch[1] : null;
    const finalUrl = productionUrl || deploymentUrl;
    log('');
    log('========================================');
    log('Deployment successful!');
    log('========================================');
    if (finalUrl) {
      log(`Your site is live! Visit: ${finalUrl}`);
      console.log(JSON.stringify({ status: 'success', url: finalUrl }));
    } else {
      console.log(JSON.stringify({ status: 'success', message: 'Deployment successful' }));
    }
  } catch (error) {
    log(error.message || '');
    log('Deployment failed');
    process.exit(1);
  }
}
function main() {
  log('========================================');
  log('Vercel CLI Project Deployment');
  log('========================================');
  checkVercelInstalled();
  if (!checkLoginStatus()) {
    log('Error: Not logged in');
    process.exit(1);
  }
  const projectPath = checkProject('.');
  doDeploy(projectPath);
}
main();
