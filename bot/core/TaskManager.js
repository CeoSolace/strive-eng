const { readdirSync } = require('fs');
const path = require('path');

class TaskManager {
  constructor(client) {
    this.client = client;
    this.tasks = new Map();
  }

  async start() {
    const taskFiles = readdirSync(path.join(__dirname, '..', '..', 'tasks')).filter(file => file.endsWith('.js'));
    for (const file of taskFiles) {
      const task = require(path.join(__dirname, '..', '..', 'tasks', file));
      this.tasks.set(task.name, task);
      if (task.cron) {
        setInterval(async () => {
          try {
            await task.execute(this.client);
          } catch (err) {
            console.error(`[TASK] Error in ${task.name}:`, err);
          }
        }, parseCronInterval(task.cron));
      }
    }
    console.log(`✅ Loaded ${this.tasks.size} recurring tasks.`);
  }
}

function parseCronInterval(cron) {
  if (typeof cron === 'number') return cron;
  if (cron.endsWith('m')) return parseInt(cron) * 60 * 1000;
  if (cron.endsWith('h')) return parseInt(cron) * 60 * 60 * 1000;
  if (cron.endsWith('d')) return parseInt(cron) * 24 * 60 * 60 * 1000;
  return 60000; // default 1 min
}

module.exports = TaskManager;
