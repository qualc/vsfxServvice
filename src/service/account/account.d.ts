import { Article } from '../../entity/article';

export interface AccountInfo {
    id?: Number
    type: number
    price: number
    createTime: String
    IAE: String
    description?: String
}

export interface AccountInterface {
    /**
     * 入账、支出
     * 
     * @param {Account} account 
     * @memberof AccountInterface
     */
    save(account: AccountInfo);
    /**
     * 列表
     */
    getAccountList();
}