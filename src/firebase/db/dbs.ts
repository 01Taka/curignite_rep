import { db } from "../firebase";
import AnswersDB from "./app/QandA/answers/answers";
import QuestionsDB from "./app/QandA/questions/questions";
import SpacesDB from "./app/space/spaces";
import TeamCodesDB from "./app/team/teamCodes";
import TeamsDB from "./app/team/teams";
import { UsersDB } from "./app/user/users"

const usersDB = new UsersDB(db);
const teamsDB = new TeamsDB(db);
const teamCodesDB = new TeamCodesDB(db);
const spacesDB = new SpacesDB(db);
const questionsDB = new QuestionsDB(db);
const answersDB = new AnswersDB(db);

export { usersDB, teamsDB, teamCodesDB, spacesDB, questionsDB, answersDB }