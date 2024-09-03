import { Firestore, Timestamp } from 'firebase/firestore';
import BaseDB from '../../../base';
import { getInitialBaseDocumentData } from '../../../../../functions/db/dbUtils';
import { UserPartnerData } from '../../../../../types/firebase/db/user/userStructure';
import { PartnerStatus } from '../../../../../types/firebase/db/user/userSupplementTypes';

export class UserPartnerService {
  constructor(private firestore: Firestore) {}

  private createBaseDB(userId: string): BaseDB<UserPartnerData> {
    return new BaseDB(this.firestore, `users/${userId}/partners`);
  }

  async createUserPartner(
    userId: string,
    partnerUserId: string,
    status: PartnerStatus,
    since: Timestamp = Timestamp.now(),
    merge: boolean = false
  ): Promise<void> {
    const data: UserPartnerData = {
      ...getInitialBaseDocumentData(userId),
      since,
      status,
    };
    return this.createBaseDB(userId).createWithId(partnerUserId, data, merge);
  }

  async isPartnerExist(userId: string, partnerUserId: string): Promise<boolean> {
    const snapshot = await this.createBaseDB(userId).readAsDocumentSnapshot(partnerUserId);
    return snapshot.exists();
  }

  async getAllUserPartners(userId: string): Promise<UserPartnerData[]> {
    return this.createBaseDB(userId).getAll();
  }

  async setPartnerStatus(userId: string, partnerUserId: string, status: PartnerStatus): Promise<void> {
    await this.createBaseDB(userId).update(partnerUserId, { status });
  }
}
