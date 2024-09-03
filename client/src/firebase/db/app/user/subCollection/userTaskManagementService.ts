import { Firestore } from "firebase/firestore";
import { TaskManagementService } from "../../../common/task/taskManagementService";

export class UserTaskManagementService extends TaskManagementService {
  constructor(firestore: Firestore) {
    super(firestore, "users");
  }
}