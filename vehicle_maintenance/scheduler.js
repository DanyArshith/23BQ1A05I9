const axios = require("axios");
const Log = require("../logging_middleware");

/**
 * Solves the 0/1 Knapsack problem to schedule vehicle maintenance tasks
 * Maximizes total impact while respecting mechanic hours capacity
 *
 * @param {number} capacity - Available mechanic hours
 * @param {Array} items - Array of tasks with Duration (weight) and Impact (value)
 * @returns {Array} Selected task IDs
 */
function knapsack(capacity, items) {
  const n = items.length;

  // DP table: dp[i][w] = max impact using items 0..i-1 with capacity w
  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(capacity + 1).fill(0));

  // Build the DP table
  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    for (let w = 0; w <= capacity; w++) {
      // Don't include item
      dp[i][w] = dp[i - 1][w];

      // Include item if it fits
      if (item.Duration <= w) {
        dp[i][w] = Math.max(
          dp[i][w],
          dp[i - 1][w - item.Duration] + item.Impact
        );
      }
    }
  }

  // Backtrack to find which items were selected
  const selected = [];
  let w = capacity;
  for (let i = n; i > 0 && w > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(items[i - 1].TaskID);
      w -= items[i - 1].Duration;
    }
  }

  return selected;
}

/**
 * Fetch depots from external API
 */
async function fetchDepots(apiBaseUrl) {
  try {
    await Log(
      "backend",
      "info",
      "service",
      "Fetching depots from evaluation-service"
    );

    const response = await axios.get(`${apiBaseUrl}/evaluation-service/depots`);
    const depots = response.data.depots || [];

    await Log(
      "backend",
      "info",
      "service",
      `Depots fetched successfully: ${depots.length} depot(s)`
    );

    return depots;
  } catch (error) {
    await Log(
      "backend",
      "error",
      "service",
      `Failed to fetch depots: ${error.message}`
    );
    throw error;
  }
}

/**
 * Fetch vehicles from external API
 */
async function fetchVehicles(apiBaseUrl) {
  try {
    await Log(
      "backend",
      "info",
      "service",
      "Fetching vehicles from evaluation-service"
    );

    const response = await axios.get(
      `${apiBaseUrl}/evaluation-service/vehicles`
    );
    const vehicles = response.data.vehicles || [];

    await Log(
      "backend",
      "info",
      "service",
      `Vehicles fetched successfully: ${vehicles.length} vehicle(s)`
    );

    return vehicles;
  } catch (error) {
    await Log(
      "backend",
      "error",
      "service",
      `Failed to fetch vehicles: ${error.message}`
    );
    throw error;
  }
}

/**
 * Generate maintenance schedule for all depots
 */
async function generateSchedule(apiBaseUrl) {
  try {
    await Log(
      "backend",
      "info",
      "service",
      "Starting schedule generation process"
    );

    // Fetch data from external APIs
    const depots = await fetchDepots(apiBaseUrl);
    const vehicles = await fetchVehicles(apiBaseUrl);

    if (!depots.length) {
      await Log(
        "backend",
        "warn",
        "service",
        "No depots available for scheduling"
      );
      return [];
    }

    if (!vehicles.length) {
      await Log(
        "backend",
        "warn",
        "service",
        "No vehicles available for scheduling"
      );
      return [];
    }

    // Generate schedule for each depot
    const schedules = depots.map((depot) => {
      const selected = knapsack(depot.MechanicHours, vehicles);
      const totalImpact = selected.reduce((sum, taskId) => {
        const task = vehicles.find((v) => v.TaskID === taskId);
        return sum + (task ? task.Impact : 0);
      }, 0);
      const totalDuration = selected.reduce((sum, taskId) => {
        const task = vehicles.find((v) => v.TaskID === taskId);
        return sum + (task ? task.Duration : 0);
      }, 0);

      return {
        DepotID: depot.ID,
        SelectedTasks: selected,
        TotalImpact: totalImpact,
        TotalDuration: totalDuration,
        AvailableCapacity: depot.MechanicHours,
      };
    });

    await Log(
      "backend",
      "info",
      "service",
      `Schedule generation completed: ${schedules.length} schedule(s) generated`
    );

    return schedules;
  } catch (error) {
    await Log(
      "backend",
      "error",
      "service",
      `Schedule generation failed: ${error.message}`
    );
    throw error;
  }
}

module.exports = {
  generateSchedule,
  knapsack,
  fetchDepots,
  fetchVehicles,
};
