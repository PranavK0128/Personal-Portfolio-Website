import { getVisitorStore } from "../src/lib/visitor-store.ts";

const [action, id] = process.argv.slice(2);
const store = getVisitorStore();
try {
  if (action === "list") {
    console.table(store.db.prepare("SELECT id,name,message,hidden FROM notes ORDER BY created_at DESC").all());
  } else if (["hide", "restore", "block"].includes(action) && id) {
    store.moderate(id, action);
    console.log(`Note ${id}: ${action} completed.`);
  } else {
    console.log("Usage: npm run visitors:moderate -- list | hide NOTE_ID | restore NOTE_ID | block NOTE_ID");
    process.exitCode = 1;
  }
} finally { store.close(); }
