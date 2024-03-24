import { DB } from "github-gist-database";

const userSchema = new DB(
  {
    username: "String",
    password: "String",
  },
  {
    githubToken: process.env.GIST_TOKEN!,
    projectName: "mern-auth-concept",
    schemaName: "user",
    gistId: "c0c3fd501b3908ce2ebb98d8c628252f",
    timeStamps: true,
  }
);

export default userSchema;
