const { getDepots, getVehicles } = require("../repositories/evaluationRepository");
const { log } = require("../middleware/logger");
const { getAccessToken } = require("./authService");

function normalizeTask(task) {
  return {
    TaskID: task.TaskID,
    Duration: Math.floor(Number(task.Duration)),
    Impact: Number(task.Impact)
  };
}

function optimizeTasks(tasks, capacity) {
  const hours = Math.max(0, Math.floor(Number(capacity) || 0));
  const validTasks = tasks.map(normalizeTask).filter((task) => task.TaskID && task.Duration > 0);
  let previous = new Int32Array(hours + 1);
  let current = new Int32Array(hours + 1);
  const keep = validTasks.map(() => new Uint8Array(hours + 1));

  for (let index = 0; index < validTasks.length; index += 1) {
    const task = validTasks[index];
    current.set(previous);

    for (let hour = task.Duration; hour <= hours; hour += 1) {
      const candidate = previous[hour - task.Duration] + task.Impact;

      if (candidate > current[hour]) {
        current[hour] = candidate;
        keep[index][hour] = 1;
      }
    }

    [previous, current] = [current, previous];
  }

  const selectedTasks = [];
  let remaining = hours;

  for (let index = validTasks.length - 1; index >= 0; index -= 1) {
    const task = validTasks[index];

    if (keep[index][remaining]) {
      selectedTasks.push(task);
      remaining -= task.Duration;
    }
  }

  selectedTasks.reverse();
  const totalDuration = selectedTasks.reduce((sum, task) => sum + task.Duration, 0);

  return {
    totalDuration,
    totalImpact: previous[hours],
    selectedTasks
  };
}

async function createSchedule() {
  const token = await getAccessToken();

  await log("info", "service", "vehicle scheduling started", token);

  const [depots, vehicles] = await Promise.all([getDepots(token), getVehicles(token)]);

  const depotSchedules = depots.map((depot) => ({
    depotId: depot.ID,
    mechanicHours: Number(depot.MechanicHours),
    ...optimizeTasks(vehicles, depot.MechanicHours)
  }));

  await log("info", "service", `vehicle scheduling completed for ${depotSchedules.length} depots`, token);

  return { success: true, depotSchedules };
}

module.exports = { createSchedule, optimizeTasks };
