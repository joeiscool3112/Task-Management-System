const fs = require("fs");
const { execSync } = require("child_process");

const PROJECT_ID = "PVT_kwHOCJMtcc4BVWyJ";
const REPO = "joeiscool3112/Task-Management-System";
const FILE_PATH = "./tasks.txt";

// chạy lệnh shell và lấy output
function run(cmd, options = {}) {
  try {
    return execSync(cmd, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
      ...options,
    }).trim();
  } catch (err) {
    const stderr = err.stderr?.toString() || "";
    const stdout = err.stdout?.toString() || "";
    throw new Error(`${cmd}\n${stderr || stdout || err.message}`);
  }
}

// escape dấu " để nhét vào CLI
function escapeQuotes(str) {
  return str.replace(/"/g, '\\"');
}

// đảm bảo label tồn tại
function ensureLabel(name, color, description) {
  try {
    run(`gh label view "${name}" --repo ${REPO}`);
    console.log(`Label exists: ${name}`);
  } catch {
run(
  `gh label create "${name}" --color ${color} --description "${escapeQuotes(
    description
  )}" --repo ${REPO} --force`
);
    console.log(`Created label: ${name}`);
  }
}

// parse file task
function parseTasks(content) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const tasks = [];

  for (const line of lines) {
    // bỏ qua heading
    if (/^=+.*=+$/.test(line)) continue;

    // gộp dòng lỗi format kiểu:
    // [BE] Setup environment variables (.env)
    // structure (routes, controllers, models)
    if (
      tasks.length > 0 &&
      !line.startsWith("[BE]") &&
      !line.startsWith("[FE]") &&
      !/^=+.*=+$/.test(line)
    ) {
      tasks[tasks.length - 1].title += ` ${line}`;
      continue;
    }

    const match = line.match(/^\[(BE|FE)\]\s*(.+)$/i);
    if (!match) continue;

    const label = match[1].toUpperCase();
    const title = match[2].trim();

    if (title) {
      tasks.push({ label, title });
    }
  }

  return tasks;
}

// kiểm tra issue đã tồn tại chưa theo title
function issueExists(title) {
  const safeTitle = title.replace(/"/g, '\\"');
  const result = run(
    `gh issue list --repo ${REPO} --search "in:title \\"${safeTitle}\\"" --limit 100 --json title,url`
  );

  let issues = [];
  try {
    issues = JSON.parse(result);
  } catch {
    return null;
  }

  const exact = issues.find((issue) => issue.title === title);
  return exact || null;
}

// tạo issue
function createIssue(title, label) {
  const cmd = `gh issue create --repo ${REPO} --title "${escapeQuotes(
    title
  )}" --label "${label}" --body "."`;

  const output = run(cmd);

  // output thường là url issue
  const urlMatch = output.match(/https?:\/\/\S+/);
  if (!urlMatch) {
    throw new Error(`Cannot parse issue URL from output: ${output}`);
  }

  return urlMatch[0];
}

// add issue vào project
function addToProject(issueUrl) {
  run(`gh project item-add ${PROJECT_ID} --url ${issueUrl}`);
}

function main() {
  console.log("Reading tasks file...");

  if (!fs.existsSync(FILE_PATH)) {
    throw new Error(`File not found: ${FILE_PATH}`);
  }

  const content = fs.readFileSync(FILE_PATH, "utf-8");
  const tasks = parseTasks(content);

  if (tasks.length === 0) {
    throw new Error("No tasks found in file.");
  }

  console.log(`Found ${tasks.length} tasks.`);

  // tạo label nếu chưa có
  ensureLabel("BE", "FF5733", "Backend tasks");
  ensureLabel("FE", "3498DB", "Frontend tasks");

  let created = 0;
  let skipped = 0;

  for (const task of tasks) {
    try {
      const existed = issueExists(task.title);

      if (existed) {
        console.log(`Skip existing: ${task.title}`);
        skipped++;
        continue;
      }

      const issueUrl = createIssue(task.title, task.label);
      addToProject(issueUrl);

      console.log(`Added: [${task.label}] ${task.title}`);
      created++;
    } catch (err) {
      console.error(`Failed: [${task.label}] ${task.title}`);
      console.error(err.message);
    }
  }

  console.log("\nDone.");
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
}

main();