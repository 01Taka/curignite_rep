import { Firestore } from "firebase/firestore";
import { UsersDB } from "./app/user/users";
import SpacesDB from "./app/space/spaces";
import { StorageManager, storageManager } from "../storage/storageManager";
import TeamsDB from "./app/team/teams";
import { db } from "../firebase";
import TeamCodesDB from "./app/team/teamCodes";

export class CollectionFactory {
  private static instance: CollectionFactory;
  
  private _usersDB?: UsersDB;
  private _teamsDB?: TeamsDB;
  private _teamCodesDB?: TeamCodesDB;
  private _spacesDB?: SpacesDB;

  private constructor(private firestore: Firestore, private storageManager: StorageManager) {}

  static getInstance(firestore: Firestore, storageManager: StorageManager): CollectionFactory {
    if (!CollectionFactory.instance) {
      CollectionFactory.instance = new CollectionFactory(firestore, storageManager);
    }
    return CollectionFactory.instance;
  }

  createUsersDB(): UsersDB {
    if (!this._usersDB) {
      this._usersDB = new UsersDB(this.firestore);
    }
    return this._usersDB;
  }

  createTeamsDB(): TeamsDB {
    if (!this._teamsDB) {
      this._teamsDB = new TeamsDB(this.firestore, this.storageManager);
    }
    return this._teamsDB;
  }

  createTeamCodesDB(): TeamCodesDB {
    if (!this._teamCodesDB) {
      this._teamCodesDB = new TeamCodesDB(this.firestore);
    }
    return this._teamCodesDB;
  }

  createSpacesDB(): SpacesDB {
    if (!this._spacesDB) {
      this._spacesDB = new SpacesDB(this.firestore);
    }
    return this._spacesDB;
  }
}

// インスタンスの取得
export const collectionFactory = CollectionFactory.getInstance(db, storageManager);
