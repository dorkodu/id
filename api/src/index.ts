import express from "express";

async function main() {
  const app = express();
  app.use(express.json());
  
  app.listen(8001, () => { console.log(`Server has started on port ${8001}`) })
}

main();