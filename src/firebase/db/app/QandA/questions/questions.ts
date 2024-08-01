import { Firestore } from "firebase/firestore";
import BaseDB from "../../../base";
import { Question } from "../../../../../types/firebase/db/qAndA/questionTypes";

class QuestionsDB extends BaseDB<Question> {
    constructor(firestore: Firestore) {
        super(firestore, "questions");
    }
}

export default QuestionsDB;
