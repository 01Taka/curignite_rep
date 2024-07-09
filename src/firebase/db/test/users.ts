import { DocumentData, DocumentReference } from "firebase/firestore";
import BaseDB from "./base";

interface User {
    name: string;
    email: string;
    age: number;
}

interface SomeSub {
    title: string;
    content: string;
}
  
class UserDB extends BaseDB<User> {
    constructor() {
      super('users');
    }
  
    async createUser(name: string, email: string, age: number): Promise<DocumentReference<DocumentData>> {
      const user: User = { name, email, age };
      return this.create(user);
    }
  
    async updateUser(id: string, name?: string, email?: string, age?: number): Promise<void> {
      const data: Partial<User> = {};
      if (name) data.name = name;
      if (email) data.email = email;
      if (age) data.age = age;
      return this.update(id, data);
    }
  
    async readUser(id: string): Promise<User | null> {
      return this.readAsObject(id);
    }

    async getAllUsers(): Promise<User[]> {
        return this.getAllAsObjects();
    }

    async getSomeSub(parentId: string, id: string): Promise<SomeSub | null> {
        const path = "path";
        return this.readAsObjectFromSubCollection<SomeSub>(parentId, path, id);
    } 
  }
  

  // UserDBインスタンスの作成
const userDb = new UserDB();

// 新しいユーザーを作成
userDb.createUser('John Doe', 'john@example.com', 30).then(docRef => {
  console.log('User created with ID:', docRef.id);
});

// ユーザーを読み取り
userDb.readUser('userId').then(user => {
  if (user) {
    console.log('User data:', user);
  } else {
    console.log('User not found');
  }
});

// ユーザーを更新
userDb.updateUser('userId', 'John Doe', 'john.doe@example.com', 31).then(() => {
  console.log('User updated');
});