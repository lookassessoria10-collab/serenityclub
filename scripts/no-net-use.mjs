import childProcess from "node:child_process";
import { syncBuiltinESMExports } from "node:module";

const originalExec = childProcess.exec;

childProcess.exec = function patchedExec(command, options, callback) {
  if (typeof command === "string" && command.trim().toLowerCase() === "net use") {
    const done = typeof options === "function" ? options : callback;
    if (typeof done === "function") {
      queueMicrotask(() => done(null, "", ""));
    }
    return {
      stdout: null,
      stderr: null,
      stdin: null,
      killed: false,
      pid: 0,
      kill() {
        return true;
      },
      on() {
        return this;
      },
      once() {
        return this;
      },
    };
  }

  return originalExec.call(this, command, options, callback);
};

syncBuiltinESMExports();
