const os = require("os");
const { execFile } = require(
  "child_process"
);

function execPowerShell(command) {
  return new Promise(
    (resolve, reject) => {
      execFile(
        "powershell.exe",
        [
          "-NoProfile",
          "-NonInteractive",
          "-ExecutionPolicy",
          "Bypass",
          "-Command",
          command,
        ],
        {
          windowsHide: true,
          timeout: 10_000,
        },
        (
          error,
          stdout,
          stderr
        ) => {
          if (error) {
            reject(
              new Error(
                stderr?.trim() ||
                  error.message
              )
            );

            return;
          }

          resolve(
            stdout?.trim() ?? ""
          );
        }
      );
    }
  );
}

async function readCpuUsage() {
  const command = `
$cpu = Get-CimInstance Win32_PerfFormattedData_PerfOS_Processor -Filter "Name='_Total'"

if ($null -eq $cpu) {
  exit 2
}

[double]$cpu.PercentProcessorTime
`;

  try {
    const output =
      await execPowerShell(
        command
      );

    const usage =
      Number(output);

    if (
      !Number.isFinite(usage)
    ) {
      return null;
    }

    return Math.round(
      usage * 10
    ) / 10;
  } catch (error) {
    console.error(
      "Erreur lecture utilisation CPU :",
      error.message
    );

    return null;
  }
}

function readMemoryUsage() {
  const totalBytes =
    os.totalmem();

  const freeBytes =
    os.freemem();

  const usedBytes =
    totalBytes -
    freeBytes;

  const usage =
    totalBytes > 0
      ? (
          usedBytes /
          totalBytes
        ) *
        100
      : null;

  return {
    totalGiB:
      Math.round(
        (
          totalBytes /
          1024 ** 3
        ) *
          10
      ) / 10,

    usedGiB:
      Math.round(
        (
          usedBytes /
          1024 ** 3
        ) *
          10
      ) / 10,

    freeGiB:
      Math.round(
        (
          freeBytes /
          1024 ** 3
        ) *
          10
      ) / 10,

    usage:
      Number.isFinite(
        usage
      )
        ? Math.round(
            usage * 10
          ) / 10
        : null,
  };
}

async function readDisk(
  driveLetter
) {
  const command = `
$disk = Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='${driveLetter}:'"

if ($null -eq $disk) {
  exit 2
}

[PSCustomObject]@{
  deviceId = $disk.DeviceID
  size = [double]$disk.Size
  freeSpace = [double]$disk.FreeSpace
} | ConvertTo-Json -Compress
`;

  try {
    const output =
      await execPowerShell(
        command
      );

    if (!output) {
      return {
        available: false,
        drive:
          `${driveLetter}:`,
      };
    }

    const disk =
      JSON.parse(output);

    const totalBytes =
      Number(disk.size);

    const freeBytes =
      Number(
        disk.freeSpace
      );

    if (
      !Number.isFinite(
        totalBytes
      ) ||
      !Number.isFinite(
        freeBytes
      ) ||
      totalBytes <= 0
    ) {
      return {
        available: false,
        drive:
          `${driveLetter}:`,
      };
    }

    const usedBytes =
      totalBytes -
      freeBytes;

    const usage =
      (
        usedBytes /
        totalBytes
      ) *
      100;

    return {
      available: true,

      drive:
        `${driveLetter}:`,

      totalGiB:
        Math.round(
          (
            totalBytes /
            1024 ** 3
          ) *
            10
        ) / 10,

      usedGiB:
        Math.round(
          (
            usedBytes /
            1024 ** 3
          ) *
            10
        ) / 10,

      freeGiB:
        Math.round(
          (
            freeBytes /
            1024 ** 3
          ) *
            10
        ) / 10,

      usage:
        Math.round(
          usage * 10
        ) / 10,
    };
  } catch (error) {
    console.error(
      `Erreur lecture disque ${driveLetter}:`,
      error.message
    );

    return {
      available: false,
      drive:
        `${driveLetter}:`,
    };
  }
}

async function readHomeAssistantVm() {
  const command = `
$vm = Get-VM -Name "Home Assistant" -ErrorAction Stop

[PSCustomObject]@{
  name = $vm.Name
  state = $vm.State.ToString()
  uptimeSeconds = [math]::Round($vm.Uptime.TotalSeconds)
} | ConvertTo-Json -Compress
`;

  try {
    const output =
      await execPowerShell(
        command
      );

    if (!output) {
      return {
        available: false,
        online: false,
      };
    }

    const vm =
      JSON.parse(output);

    const state =
      String(
        vm.state ?? ""
      );

    return {
      available: true,

      name:
        vm.name ??
        "Home Assistant",

      state,

      online:
        state.toLowerCase() ===
        "running",

      uptimeSeconds:
        Number.isFinite(
          Number(
            vm.uptimeSeconds
          )
        )
          ? Number(
              vm.uptimeSeconds
            )
          : null,
    };
  } catch (error) {
    console.error(
      "Erreur lecture VM Home Assistant :",
      error.message
    );

    return {
      available: false,
      online: false,
      name:
        "Home Assistant",
      state:
        "unknown",
      uptimeSeconds:
        null,
    };
  }
}

async function getWindowsHealth() {
  /*
   * Mesure CPU en premier et seule.
   * On évite de lancer plusieurs processus
   * PowerShell simultanément pendant la mesure.
   */
  const cpuUsage =
    await readCpuUsage();

  /*
   * Une fois la mesure CPU terminée,
   * les lectures disques et Hyper-V
   * peuvent être exécutées en parallèle.
   */
  const [
    systemDisk,
    backupDisk,
    homeAssistantVm,
  ] =
    await Promise.all([
      readDisk("C"),
      readDisk("D"),
      readHomeAssistantVm(),
    ]);

  const memory =
    readMemoryUsage();

  return {
    platform: "windows",

    hostname:
      os.hostname(),

    cpu: {
      model:
        os.cpus()?.[0]
          ?.model ??
        null,

      logicalProcessors:
        os.cpus().length,

      usage:
        cpuUsage,
    },

    memory,

    disks: {
      system:
        systemDisk,

      backup:
        backupDisk,
    },

    windows: {
      uptimeSeconds:
        Math.round(
          os.uptime()
        ),
    },

    homeAssistantVm,

    checkedAt:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  getWindowsHealth,
};
