import { Service } from 'vsfx';
import { BaseService } from '../BaseService';
import { AccountInterface, AccountInfo } from './account.d';
import { Account } from '../../entity/account';
import { isNotFalse } from '../../lib/validate';

@Service()
export class AccountService extends BaseService implements AccountInterface {
    execute;
    getRepository;
    async save({ type, price, createTime = 'now()', IAE, description }: AccountInfo) {
        return this.execute(`insert into account(disabled, updateDate, createDate, IAE, price, type,description) value (1,now(),${createTime},'${IAE}','${price}','${type}','${description}')`);
    }
    async getAccountList() {
        let list = this.execute('select * from account order by id desc');
        return list;
    }
}
