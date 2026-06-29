#!/usr/bin/env node

/**
 * clean-dev.js — Cross-platform Next.js build-cache cleanup for Windows/OneDrive.
 *
 * This script:
 *  1. Kills stale Node.js processes that reference this project (Windows only).
 *  2. Deletes the .next directory with retry logic for Windows file locks.
 *  3. Verifies deletion succeeded.
 *  4. Warns if the project lives inside a OneDrive-synced folder.
 *
 * Zero external dependencies — uses only Node.js built-in modules.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ───────────────────────── Config ─────────────────────────
const PROJECT_ROOT = path.resolve(__dirname, "..");
const NEXT_DIR = path.join(PROJECT_ROOT, ".next");
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 1500;
const IS_WINDOWS = process.platform === "win32";

// ───────────────────────── Helpers ────────────────────────

function log(emoji, msg) {
    console.log(`${emoji}  ${msg}`);
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ───────────── 1. Kill stale Node processes (Windows) ─────────────

function killStaleProcesses() {
    if (!IS_WINDOWS) return;

    log("🔍", "Checking for stale Node.js processes...");

    try {
        // Use PowerShell + Get-CimInstance (works on all modern Windows)
        const psCmd = `powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress"`;
        const raw = execSync(psCmd, { encoding: "utf-8", timeout: 15000 }).trim();

        if (!raw || raw === "null") {
            log("✅", "No stale processes found.");
            return;
        }

        const currentPid = process.pid;
        const parentPid = process.ppid;
        const projectDir = PROJECT_ROOT.toLowerCase();

        // PowerShell returns a single object if only one match, or an array
        let processes = JSON.parse(raw);
        if (!Array.isArray(processes)) processes = [processes];

        let killed = 0;

        for (const proc of processes) {
            const pid = proc.ProcessId;
            const cmdLine = (proc.CommandLine || "").toLowerCase();

            if (!pid || isNaN(pid)) continue;
            // Never kill ourselves or our parent
            if (pid === currentPid || pid === parentPid) continue;

            // Only kill processes that reference this project directory
            if (cmdLine.includes(projectDir) || cmdLine.includes(".next")) {
                try {
                    execSync(`taskkill /F /PID ${pid}`, {
                        encoding: "utf-8",
                        timeout: 5000,
                        stdio: "ignore",
                    });
                    killed++;
                } catch {
                    // Process may have already exited — ignore
                }
            }
        }

        if (killed > 0) {
            log("⚠️", `Terminated ${killed} stale process(es).`);
        } else {
            log("✅", "No stale processes found.");
        }
    } catch {
        // PowerShell may not be available in all environments — that's OK
        log("ℹ️", "Could not check for stale processes (non-critical).");
    }
}

// ───────────── 2. Delete .next with retry logic ─────────────

async function deleteNextDir() {
    log("🧹", "Cleaning Next.js build cache...");

    if (!fs.existsSync(NEXT_DIR)) {
        log("✅", ".next directory does not exist — nothing to clean.");
        return true;
    }

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            fs.rmSync(NEXT_DIR, { recursive: true, force: true });
            log("✅", ".next directory removed.");
            return true;
        } catch (err) {
            const retryable = ["EBUSY", "EPERM", "ENOTEMPTY", "EINVAL", "EACCES"];
            if (retryable.includes(err.code) && attempt < MAX_RETRIES) {
                log(
                    "⏳",
                    `File lock detected (${err.code}). Retry ${attempt}/${MAX_RETRIES} in ${RETRY_DELAY_MS / 1000}s...`
                );
                await sleep(RETRY_DELAY_MS);
            } else if (err.code === "ENOENT") {
                // Directory was removed between the existsSync check and rmSync call
                log("✅", ".next directory removed.");
                return true;
            } else {
                throw err;
            }
        }
    }

    return false;
}

// ───────────── 3. Verify deletion ─────────────

function verifyCleanup() {
    if (fs.existsSync(NEXT_DIR)) {
        log("❌", "WARNING: .next directory still exists after cleanup!");
        log(
            "💡",
            "Try closing any editors/terminals that may be using the project, then run again."
        );
        if (IS_WINDOWS) {
            log("💡", "You can also run: taskkill /F /IM node.exe  (kills ALL Node processes)");
        }
        process.exit(1);
    }
    log("✅", "Cleanup verified — .next directory is gone.");
}

// ───────────── 4. OneDrive detection & guidance ─────────────

function checkOneDrive() {
    const cwd = PROJECT_ROOT.toLowerCase();
    if (!cwd.includes("onedrive")) return;

    console.log("");
    log("⚠️", "This project is inside a OneDrive-synchronized folder.");
    console.log("   OneDrive can interfere with Next.js build artifacts and cause");
    console.log("   EINVAL / readlink errors. Recommendations:");
    console.log("");
    console.log("   1. Exclude the .next folder from OneDrive sync:");
    console.log("      Right-click .next → Free up space (or mark as 'Always keep on this device')");
    console.log("");
    console.log("   2. For best reliability, move the project outside OneDrive:");
    console.log("      e.g.  C:\\Projects\\VaadaKaro");
    console.log("");
}

// ───────────── Main ─────────────

async function main() {
    console.log("");
    console.log("━".repeat(52));
    log("🚀", "VaadaKaro — Development Startup Cleanup");
    console.log("━".repeat(52));
    console.log("");

    // Step 1: Kill stale processes (Windows only)
    killStaleProcesses();

    // Step 2: Delete .next
    const deleted = await deleteNextDir();
    if (!deleted) {
        log("❌", "Failed to remove .next after all retries.");
        log("💡", "Close other programs that may be locking files and try again.");
        process.exit(1);
    }

    // Step 3: Verify
    verifyCleanup();

    // Step 4: OneDrive guidance
    checkOneDrive();

    console.log("");
    log("🚀", "Starting Next.js development server...");
    console.log("");
}

main().catch((err) => {
    console.error("");
    log("❌", `Cleanup failed: ${err.message}`);
    console.error("");
    console.error("Full error:", err);
    process.exit(1);
});
