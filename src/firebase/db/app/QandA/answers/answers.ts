import { Firestore } from "firebase/firestore";
import BaseDB from "../../../base";
import { Answer } from "../../../../../types/firebase/db/qAndA/answerTypes";

class AnswersDB extends BaseDB<Answer> {
    constructor(firestore: Firestore) {
        super(firestore, "answers");
    }
}

export default AnswersDB;
