import nodecron from "node-cron";

function taskMailNewLocation() {
  return nodecron.schedule("* * * * *", () => {

  })
}

function taskMailEmailChange() {
  return nodecron.schedule("* * * * *", () => {

  })
}

function taskMailPasswordChange() {
  return nodecron.schedule("* * * * *", () => {

  })
}

export const cron = {
  taskMailNewLocation,
  taskMailEmailChange,
  taskMailPasswordChange,
}