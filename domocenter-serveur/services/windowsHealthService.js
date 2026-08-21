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
          timeout: 15_000,
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

function buildDiskData(
  disk,
  driveLetter
) {
  if (!disk) {
    return {
      available: false,
      drive:
        `${driveLetter}:`,
    };
  }

  const totalBytes =
    Number(disk.size);

  const freeBytes =
    Number(disk.freeSpace);

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
}

async function readWindowsMetrics() {
  const command = `
$cpuUsage = $null

try {
  $cpu = Get-CimInstance Win32_PerfFormattedData_PerfOS_Processor -Filter "Name='_Total'" -ErrorAction Stop

  if ($null -ne $cpu) {
    $cpuUsage = [double]$cpu.PercentProcessorTime
  }
}
catch {
  $cpuUsage = $null
}

$disks = @()

try {
  $disks = @(
    Get-CimInstance Win32_LogicalDisk -ErrorAction Stop |
      Where-Object {
        $_.DeviceID -eq "C:" -or
        $_.DeviceID -eq "D:"
      } |
      ForEach-Object {
        [PSCustomObject]@{
          deviceId = $_.DeviceID
          size = [double]$_.Size
          freeSpace = [double]$_.FreeSpace
        }
      }
  )
}
catch {
  $disks = @()
}

$vmData = [PSCustomObject]@{
  available = $false
  name = "Home Assistant"
  state = "unknown"
  uptimeSeconds = $null
}

try {
  $vm = Get-VM -Name "Home Assistant" -ErrorAction Stop

  $vmData = [PSCustomObject]@{
    available = $true
    name = $vm.Name
    state = $vm.State.ToString()
    uptimeSeconds = [math]::Round(
      $vm.Uptime.TotalSeconds
    )
  }
}
catch {
}

[PSCustomObject]@{
  cpuUsage = $cpuUsage
  disks = $disks
  homeAssistantVm = $vmData
} | ConvertTo-Json -Depth 4 -Compress
`;

  const output =
    await execPowerShell(
      command
    );

  if (!output) {
    throw new Error(
      "Aucune donnée Windows reçue."
    );
  }

  return JSON.parse(output);
}

async function getWindowsHealth() {
  let windowsMetrics = null;

  try {
    windowsMetrics =
      await readWindowsMetrics();
  } catch (error) {
    console.error(
      "Erreur lecture santé Windows :",
      error.message
    );
  }

  const cpuUsage =
    Number(
      windowsMetrics
        ?.cpuUsage
    );

  const disks =
    Array.isArray(
      windowsMetrics?.disks
    )
      ? windowsMetrics.disks
      : [];

  const systemDiskRaw =
    disks.find(
      (disk) =>
        disk?.deviceId ===
        "C:"
    );

  const backupDiskRaw =
    disks.find(
      (disk) =>
        disk?.deviceId ===
        "D:"
    );

  const systemDisk =
    buildDiskData(
      systemDiskRaw,
      "C"
    );

  const backupDisk =
    buildDiskData(
      backupDiskRaw,
      "D"
    );

  const rawVm =
    windowsMetrics
      ?.homeAssistantVm;

  const vmState =
    String(
      rawVm?.state ??
        "unknown"
    );

  const homeAssistantVm = {
    available:
      rawVm?.available ===
      true,

    name:
      rawVm?.name ??
      "Home Assistant",

    state:
      vmState,

    online:
      rawVm?.available ===
        true &&
      vmState.toLowerCase() ===
        "running",

    uptimeSeconds:
      Number.isFinite(
        Number(
          rawVm
            ?.uptimeSeconds
        )
      )
        ? Number(
            rawVm
              .uptimeSeconds
          )
        : null,
  };

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
        Number.isFinite(
          cpuUsage
        )
          ? Math.round(
              cpuUsage * 10
            ) / 10
          : null,
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
