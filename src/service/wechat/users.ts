import { Service } from 'vsfx';
import { BaseService } from '../BaseService';
import WXUsers from '../../entity/WXUsers';

@Service()
export class WXUsersService extends BaseService {
    async insertWXUsers(wxUsers) {
        const connection = this.getConnection();
        const queryRunner = connection.createQueryRunner();
        let users: Array<WXUsers> | null = null;
        // establish real database connection using our new query runner
        await queryRunner.connect();
        await queryRunner.manager.find(WXUsers);
        await queryRunner.startTransaction();
        try {
            users = await queryRunner.query(`select openid from wx_users where openid = '${wxUsers.openid}'`);
            if (users && users.length > 0) {
                const [{ openid }] = users;
                await queryRunner.manager.update(WXUsers, wxUsers, { openid });
            } else {
                const date = new Date();
                wxUsers.createDate = date.toUTCString();
                await queryRunner.manager.insert(WXUsers, wxUsers);
                users = [wxUsers];
            }
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
        }
        return (users as Array<WXUsers>)[0];
    }
    async getUsersByOpenId(openid): Promise<WXUsers> {
        return <WXUsers>await this.getRepository(WXUsers).findOne({ openid });
    }
}
