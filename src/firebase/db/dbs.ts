import AnswersDB from "./app/QandA/answers/answers";
import QuestionsDB from "./app/QandA/questions/questions";
import TeamCodesDB from "./app/team/teamCodes";
import TeamsDB from "./app/team/teams";
import { UsersDB } from "./app/user/users"

const usersDB = new UsersDB();
const teamsDB = new TeamsDB();
const teamCodesDB = new TeamCodesDB();
const questionsDB = new QuestionsDB();
const answersDB = new AnswersDB();

export { usersDB, teamsDB, teamCodesDB, questionsDB, answersDB }