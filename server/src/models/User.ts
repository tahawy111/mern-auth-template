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
    gistId: "57e142646b00b52a8e551eae8e1290ee",
    timeStamps: true,
  }
);

export default userSchema;
